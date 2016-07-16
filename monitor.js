



var python = require('child_process').spawn('python', ["./monitor.py"]);

python.stdout.on('data', function(data){
    console.log(data.toString())
});
