
var express      = require('express')
var bodyParser   = require('body-parser')
var telnet       = require('telnet-client');
var tnConnection = new telnet();
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
    return new Promise(function(resolve, reject) {
        if (request.type == 'combine') {
            //recursive call
        }

        parser = ownMapper[request.type]

        target = parser.config[request.target]
        action = request.action
        ownRequest = parser.buildMethod(target, action)

        tnConnection.connect(tnParam).then(function(prompt) {
            tnConnection.send(ownRequest, {timeout: 250}).then(function(ownResponse) {
                resolve(parser.retrieveMethod(ownResponse, request))
            }).catch(function(e) {
                reject(Error("fail send: " + e))
            })
        }).catch(function(e) {
            reject(Error("fail connect: " + e))
        })
    });
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
    })
});

app.route('/papa')
.get(function(req, res) {
    res.send("coucou Papa")
})
.post(function(req, res) {
    console.log('json reçu: ')
    res.send("titi")
});

app.listen(3000, function () {
    console.log('Start')
});
