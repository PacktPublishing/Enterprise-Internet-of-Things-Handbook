var EventHubClient = require('azure-event-hubs').Client;
var connectionString = 'HostName=Pi3-DHT11-Nodes.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=J0MTJVy+RFkSaaenfegGMJY3XWKIpZp2HO4eTwmUNoU=';
const TAG = '[TEST DEVICE] >>>>>>>>> ';

var printError = function(err) {
    console.log(TAG, err);
};

var printMessage = function(message) {
    console.log(TAG, 'Message received: ', JSON.stringify(message.body));
};

var client = EventHubClient.fromConnectionString(connectionString);

client.open()
    .then(client.getPartitionIds.bind(client))
    .then(function(partitionIds) {
        return partitionIds.map(function(partitionId) {
            return client.createReceiver('$Default', partitionId, { 'startAfterTime': Date.now() })
                .then(function(receiver) {
                    // console.log(TAG, 'Created partition receiver: ' + partitionId)
                    console.log(TAG, 'Listening...');
                    receiver.on('errorReceived', printError);
                    receiver.on('message', printMessage);
                });
        });
    })
    .catch(printError);