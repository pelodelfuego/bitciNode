
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
    rule: require('./config/rule.json'),
    scenario: require('./config/scenario.json')
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
    if (request.type == 'combine') {
        return sendOwnCombine(request.action)
    } else if(request.type == 'sequence') {
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

function sendOwnCombine(requestList) {
    return Promise.all(requestList.map(sendOwnMessage))
}

function sendOwnSequence(requestList) {

}

// ------
// HELPER
// ------
function addLocalStatement(statementFile, statement) {
    // add scenario or rule to corresponding file and save
}

function removeLocalStatement(statementFile, statementName) {
    // remove scenario or rule in corresponding file and save
}

function loadLocalStatementList(statementFile, statementList) {
    // replace scenario or rule file
}


// --------
// SCENARIO
// --------
function executeScenario(scenarioName) {
    //return promise with evaluated scenario
}

// ----
// RULE
// ----
function executeRule(rule) {
    //add the rule listener
}

function reloadRuleList() {
    //unload and then load reaload all rules
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

app.route('/scenario')
.get(function(req, res) {
    res.send(bitcinodeConf.scenario)
});

app.listen(3000, function () {
    console.log('Start bitciNode on 192.168.0.130:3000\n'.cyan)
});
