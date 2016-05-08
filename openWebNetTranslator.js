

module.exports = {
    ack: '#1',
    nack: '#0',


    //ON OFF
    buildOnOffMsg: function(target, action) {
        return target + ' : ' + action
    },

    retrieveOnOffMsg: function(ownMsg) {
        return ownMsg
    }

};
