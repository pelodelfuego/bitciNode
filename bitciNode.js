
var express      = require('express')
var bodyParser   = require('body-parser')
var telnet       = require('telnet-client');
var Promise = require('promise');

var own        = require('./openWebNetTranslator')

var app = express()
app.use(bodyParser.json());

var ownConfig = {
    onOff: require('./config/onOff.json')
};

var ownMapper = {
    'onOff': {config: ownConfig.onOff, buildMethod: own.buildOnOffMsg, retrieveMethod: own.retrieveOnOffMsg}
}

var tnParam = {
    host: '192.168.0.63',
    port: 20000,
    shellPrompt: '*#*1##',
};

function sendOwnMessage(request) {
    if (request.type == 'combine') {
        return sendCombinedOwnMessage(request.action)
    } else {
        return new Promise(function(resolve, reject) {

            var parser = ownMapper[request.type]
            //check parser correct

            var target = parser.config[request.target]
            //check target exist

            var action = request.action
            var ownRequest = parser.buildMethod(target, action)
            //check action properly built

            var tnConnection = new telnet();
            setTimeout(function() {
                tnConnection.connect(tnParam).then(function(prompt) {
                    tnConnection.send(ownRequest, {waitfor: "##"}).then(function(ownResponse) {
                        resolve(parser.retrieveMethod(ownResponse, request))
                    }).catch(function(e) {
                        reject(Error("fail send: " + e))
                    })
                }).catch(function(e) {
                    reject(Error("fail connect: " + e))
                })
            }, request.delay);
        });
    }
}

function sendCombinedOwnMessage(requestList) {
    return Promise.all(requestList.map(sendOwnMessage))
}

app.route('/')
.get(function(req, res) {
    res.send(ownConfig)
})
.post(function(req, res) {
    sendOwnMessage(req.body).then(function(parsedOwnresponse) {
        console.log(new Date().toString() + ' - ' + JSON.stringify(req.body) + ' - ' + JSON.stringify(parsedOwnresponse));
        res.send(parsedOwnresponse)
    }).catch(function(e) {
        console.log(e)
        res.send(e)
    })
});

app.listen(3000, function () {
    console.log('Start')
});
