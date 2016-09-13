
var express      = require('express')
var colors       = require('colors/safe')
var bodyParser   = require('body-parser')
var childProcess = require('child_process')

var Promise      = require('promise');
var Telnet       = require('telnet-client');
var cron         = require('node-cron');

var ownParser    = require('./openWebNetParser')

var app = express()
app.use(bodyParser.json());

var tnParam = require('./config/telnet.json')

var bitcinodeConf = {
    ownInputConf: {
        onOff: require('./config/onOff.json')
    },
    ownOutputConf: {
        motionDetector: require('./config/motionDetector.json')
    },
    ruleConf: require('./config/rule.json')
};

var ownMapper = {
    'onOff': {ownTargetList: bitcinodeConf.ownInputConf.onOff, buildMethod: ownParser.buildOnOffMsg, retrieveMethod: ownParser.retrieveOnOffMsg}
}

// -----------
// OWN COMMAND
// -----------
function sendOwnMessage(request) {
    if(request.type == 'sequence') {
        return sendOwnSequence(request.action)
    } else {
        return new Promise(function(resolve, reject) {
            request.delay = 'delay' in request ? request.delay : 0

            var parser = ownMapper[request.type]
            if (parser === undefined) {
                reject({status: "parseError",summary: "no matching parser", detail: request.type})
            }

            var target = parser.ownTargetList[request.target]
            if (target === undefined) {
                reject({status: "parseError",summary: "no matching target", detail: request.target})
            }

            var action = request.action
            var ownRequest = parser.buildMethod(target, action)
            if (ownRequest === undefined) {
                reject({status: "parseError",summary: "no matching action", detail: request.action})
            }

            var tnConnection = new Telnet();
            setTimeout(function() {
                tnConnection.connect(tnParam).then(function(prompt) {
                    tnConnection.send(ownRequest, {waitfor: "##"}).then(function(ownResponse) {
                        resolve(parser.retrieveMethod(ownResponse, request))
                    }).catch(function(e) {
                        reject({status: "tnError", summary: "fail send", detail:e})
                    })
                }).catch(function(e) {
                    reject({status: "tnError",summary: "fail connect", detail:e})
                })
            }, request.delay);
        });
    }
}

function sendOwnSequence(requestList) {
    return new Promise(function(resolve, reject) {
        var lastPromise = requestList[requestList.length-1]
        var ownResponseList = []

        var prevPromise = Promise.resolve();
        requestList.forEach(function(request) {
            prevPromise = prevPromise.then(function() {
                return sendOwnMessage(request);
            }).then(function(ownResponse) {
                ownResponseList.push(ownResponse)
                if (request == lastPromise) {
                    resolve(ownResponseList)
                }
            }).catch(function(e) {
                reject({status: "sequenceError",summary: "fail at item: " + ownResponseList.length, detail:e});
            });
        });
    });
}


// ----
// RULE
// ----
function executeRule(ruleName) {
    var rule = bitcinodeConf.ruleConf[ruleName]
    if (rule.type == 'cron') {
        cron.schedule(rule.trigger, function(){
            sendOwnMessage(rule.action).then(function(parsedOwnresponse) {
                printLog('RUL', [ruleName, rule, parsedOwnresponse], colors.blue)
            }).catch(function(e) {
                e.input = rule.action
                printLog('ERR', ['rule', ruleName, e], colors.red)
            })
        });
    }
}

function reloadRuleConf() {
    //unload and then reaload all rules
    for (var ruleName in bitcinodeConf.ruleConf) {
        executeRule(ruleName)
    }
}


// ------
// ROUTES
// ------
app.route('/')
.get(function(req, res) {
    res.send(bitcinodeConf)
});

app.route('/cmd')
.get(function(req, res) {
    res.send(bitcinodeConf.ownInputConf)
})
.post(function(req, res) {
    sendOwnMessage(req.body).then(function(parsedOwnresponse) {
        printLog('CMD', [req.body, parsedOwnresponse], colors.green)
        res.send(parsedOwnresponse)
    }).catch(function(e) {
        e.input = req.body
        printLog('ERR', ['cmd', e], colors.red)
        res.send(e)
    })
});

app.route('/motionDetector')
.get(function(req, res) {
    res.send(bitcinodeConf.ownOutputConf)
});

app.route('/rule')
.get(function(req, res) {
    res.send(bitcinodeConf.rule)
});


// ------
// SERVER
// ------
function printLog(logType, contentArray, colorFmt) {
    console.log(colorFmt(new Date().toString() + ' / ' + logType + ': ' + contentArray.map(JSON.stringify).join(' - ')));
}

app.listen(3000, function () {
    console.log('Start bitciNode on 192.168.0.120:3000')

    reloadRuleConf()

    childProcess.spawn('python', ["./ownMonitor.py", tnParam.host, tnParam.port]).stdout.on('data', function(data) {
        var rawEvent = data.toString().trim()
        printLog('MON', [rawEvent], colors.yellow)

        //motionDetectorConf = bitcinodeConf.ownOutputConf.motionDetector
        //eventSource = rawEvent in motionDetectorConf ? motionDetectorConf[rawEvent] : rawEvent

    });
});
