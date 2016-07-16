
var express      = require('express')
var colors       = require('colors')
var bodyParser   = require('body-parser')

var Promise      = require('promise');
var Telnet       = require('telnet-client');

var ownParser    = require('./openWebNetParser')

var app = express()
app.use(bodyParser.json());

var bitcinodeConf = {
    ownInputConf: {
        onOff: require('./config/onOff.json')
    },
    ownOutputConf: {},
    rule: require('./config/rule.json')
};

var ownMapper = {
    'onOff': {ownTargetList: bitcinodeConf.ownInputConf.onOff, buildMethod: ownParser.buildOnOffMsg, retrieveMethod: ownParser.retrieveOnOffMsg}
}

var tnParam = {
    host: '192.168.0.63',
    port: 20000,
    shellPrompt: '*#*1##',
};


// -----------
// OWN COMMAND
// -----------
function sendOwnMessage(request) {
    request.delay = 'delay' in request ? request.delay : 0
    if(request.type == 'sequence') {
        return sendOwnSequence(request.action)
    } else {
        return new Promise(function(resolve, reject) {

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
        var lastPromise = requestList[requestList.length - 1]
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
                reject(e);
            });
          });
    });
}


// ----
// RULE
// ----
function executeRule(rule) {
    //add the rule listener
}

function reloadRuleList() {
    //unload and then reaload all rules
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
        console.log((new Date().toString() + ' - ' + JSON.stringify(req.body) + ' - ' + JSON.stringify(parsedOwnresponse)).green)
        res.send(parsedOwnresponse)
    }).catch(function(e) {
        e.input = req.body
        console.log((new Date().toString() + ' - ' + JSON.stringify(e)).red)
        res.send(e)
    })
});

app.route('/rule')
.get(function(req, res) {
    res.send(bitcinodeConf.rule)
});

app.listen(3000, function () {
    console.log('Start bitciNode on 192.168.0.130:3000\n'.cyan)
});
