
var express    = require('express')
var bodyParser = require('body-parser')
var telnet     = require('telnet-client');

var own        = require('./openWebNetTranslator')

var app = express()
app.use(bodyParser.json());

var config = {
    onOff: require('./config/onOff.json')
};

function buildOwnMessage(parser, target, action) {

}

function sendOwnMessage(request) {
    console.log(request)
    delay = 0

    settimeout(function (request) {
        if (request.type == 'onOff') {
            target = '12'
            ownRequest = buildOwnMessage(own.onOffParser, target, action)
        }
    }, delay);

    //tn.send()
    //ownResponse
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
