
var express    = require('express')
var bodyParser = require('body-parser')

var own        = require('./openWebNetTranslator')

var app = express()
app.use(bodyParser.json());

var config = {
    onOff: require('./config/onOff.json')
};

app.route('/')
    .get(function(req, res) {
        res.send(config)
    });

function buildOwnMessage(parser, config, target, action) {

}

function sendOwnMessage(jsonRequest) {
    console.log(jsonRequest)
    ownMessage = ''
    delay = 0
    if (jsonRequest.type == 'onOff') {
        ownMessage = buildOwnMessage(own.onOffParser, target, action)
    }

    //tn.send()
    //ownResponse
    return ownMessage
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
