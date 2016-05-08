

module.exports = {

    ack: '*#*1##',
    nack: '*#*0##',

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

    retrieveOnOffMsg: function(ownMsg, ownReq) {

        return ownMsg
    }

};
