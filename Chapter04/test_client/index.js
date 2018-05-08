var awsIot = require('aws-iot-device-sdk');

const NODE_ID = 'Pi3-DHT11-Node';
const TAG = '[TEST THING] >>>>>>>>> ';

console.log(TAG, 'Connecting...');

var device = awsIot.device({
    keyPath: './certs/db80b0f635-private.pem.key',
    certPath: './certs/db80b0f635-certificate.pem.crt',
    caPath: './certs/RootCA-VeriSign-Class 3-Public-Primary-Certification-Authority-G5.pem',
    clientId: NODE_ID,
    host: 'a1afizfoknpwqg.iot.us-east-1.amazonaws.com',
    port: 8883,
    region: 'us-east-1',
    debug: false, // optional to see logs on console
});

device.on('connect', function() {
    console.log(TAG, 'device connected!');
    device.subscribe('$aws/things/Pi3-DHT11-Node/shadow/get/accepted');
    device.subscribe('$aws/things/Pi3-DHT11-Node/shadow/get/rejected');
    // Publish an empty packet to topic `$aws/things/Pi3-DHT11-Node/shadow/get`
    // to get the latest shadow data on either `accepted` or `rejected` topic
    device.publish('$aws/things/Pi3-DHT11-Node/shadow/get', '');
});

device.on('message', function(topic, payload) {
    payload = JSON.parse(payload.toString());
    console.log(TAG, 'message from ', topic, JSON.stringify(payload, null, 4));
});