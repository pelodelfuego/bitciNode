
var express    = require('express')
var bodyParser = require('body-parser')
var telnet     = require('telnet-client');

var own        = require('./openWebNetTranslator')

var app = express()
app.use(bodyParser.json());

var config = {
    onOff: require('./config/onOff.json')
};

var ownMapper = {
    'onOff': [config.onOff, own.buildOnOffMsg, own.retrieveOnOffMsg]
}

function sendOwnMessage(request) {
    if (request.type == 'combine') {
        //recursive call
    }

    localConfig = ownMapper[request.type][0]
    buildMethod = ownMapper[request.type][1]
    retrieveMethod = ownMapper[request.type][2]

    console.log(localConfig);
    console.log(buildMethod);
    console.log(retrieveMethod);


    target = localConfig[request.target]
    action = request.action

    console.log(target);

    ownRequest = own.buildOnOffMsg(target, action)

    //promise with return
    return ownRequest
}

app.route('/')
.get(function(req, res) {
    res.send(config)
})
.post(function(req, res) {
    res.send(sendOwnMessage(req.body))
});

app.listen(3000, function () {
    console.log('Start')
});
