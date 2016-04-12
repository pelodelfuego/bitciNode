
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
        console.log('Get')
        res.send('Get')
    })
    .post(function(req, res) {
        console.log('Post')
        console.log(req.body)
        res.send('Post')
    });

app.listen(3000, function () {
  console.log('Start')
});
