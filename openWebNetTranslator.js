
var ack = '*#*1##'
var nack = '*#*0##'

module.exports = {

    //ON OFF
    buildOnOffMsg: function(target, action) {
        if (action == 'on') {
            return '*1*1*' + target + '##'
        }
        if (action == 'off') {
            return '*1*0*' + target + '##'
        }
        if (action == 'state') {
            return '*#1*' + target + '##'
        }
    },

    retrieveOnOffMsg: function(ownMsg, request) {
        if (ownMsg == nack) {
            return {status: "ownError", req: request}
        } else {
            if (request.action == "state") {
                return {status: "success", target: request.target, state: ownMsg[3] == "1" ? "on" : "off"}
            } else {
                return {status: "success"}
            }
        }
    }

};
