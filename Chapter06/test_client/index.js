var PubSub = require('@google-cloud/pubsub');
var projectId = 'pi-iot-project';
var stateSubscriber = 'dht11-data'

// Instantiates a client
var pubsub = new PubSub({
    projectId: projectId,
});

var subscription = pubsub.subscription('projects/' + projectId + '/subscriptions/' + stateSubscriber);
var messageHandler = function(message) {
    console.log('Message Begin >>>>>>>>');
    console.log('message.connectionId', message.connectionId);
    console.log('message.attributes', message.attributes);
    console.log('message.data', Buffer.from(message.data, 'base64').toString('ascii'));
    console.log('Message End >>>>>>>>>>');

    // "Ack" (acknowledge receipt of) the message
    message.ack();
};

// Listen for new messages
subscription.on('message', messageHandler);