
function getTarget(configList, targetName) {
    for (var potentialTarget in configList) {
        if (targetName == potentialTarget.target) {
            return potentialTarget.adress
        }
    }
}


module.exports = {
    ack: '#1',
    nack: '#0',

    onOffParser: function(target, action) {
        return target + ' : ' + action
    }

};
