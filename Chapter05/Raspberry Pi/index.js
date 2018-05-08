'use strict';

var Protocol = require('azure-iot-device-mqtt').Mqtt;
var Client = require('azure-iot-device').Client;
var Message = require('azure-iot-device').Message;
var async = require('async');

var rpiDhtSensor = require('rpi-dht-sensor');
var dht = new rpiDhtSensor.DHT11(2); // `2` => GPIO2

var connectionString = 'HostName=Pi3-DHT11-Nodes.azure-devices.net;DeviceId=Pi3-DHT11-Node;SharedAccessKey=uvP9Tk+LFNJB0D6A2bhgKNx4qo0VOj2j5GfZ1Z0EAjU=';

var client = Client.fromConnectionString(connectionString, Protocol);

const NODE_ID = 'Pi3-DHT11-Node';
const TAG = '[' + NODE_ID + '] >>>>>>>>> ';

var connectCallback = function(err) {
    if (err) {
        console.error(TAG, 'Could not connect: ' + err.message);
    } else {
        console.log(TAG, 'Client connected');

        // Create device Twin
        client.getTwin(function(err, twin) {
            if (err) {
                console.error(TAG, 'Could not get twin');
            } else {
                console.log(TAG, 'Twin created');
                sendData(twin);
            }
        });
    }
};


function sendDataEvent(message, callback) {
    client.sendEvent(message, function(err, info) {
        if (!err) console.log(TAG, 'Data Sent');
        callback(err);
    });
}

function updateTwin(twin, message, callback) {
    twin.properties.reported.update(message, function(err) {
        if (!err) console.log(TAG, 'Twin Updated');
        callback(err);
    });
}

function fetchData() {
    var readout = dht.read();
    var temp = readout.temperature.toFixed(2);
    var humd = readout.humidity.toFixed(2);

    return {
        "temp": parseFloat(temp),
        "humd": parseFloat(humd)
    };
}


function sendData(twin) {
    var data = fetchData();

    var message = new Message(JSON.stringify(data));

    async.parallel({
            sendDataEvent: function(callback) {
                sendDataEvent(message, callback);
            },
            updateTwin: function(callback) {
                updateTwin(twin, data, callback);
            }
        },
        function(err, results) {
            if (err) throw err;
            console.log(TAG, 'Waiting for 30 seconds');
            setTimeout(function() {
                sendData(twin);
            }, 30000);
        });
}

client.open(connectCallback);