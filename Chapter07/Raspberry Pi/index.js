var Client = require('ibmiotf');
var rpiDhtSensor = require('rpi-dht-sensor');
var dht = new rpiDhtSensor.DHT11(2); // `2` => GPIO2
const QOS = 2;

var config = {
    'org': 'do22tg',
    'domain': 'internetofthings.ibmcloud.com',
    'type': 'pi3_dht11',
    'id': 'Pi3-DHT11-Node',
    'auth-method': 'token',
    'auth-token': 'K*TP9J0GMFFLeMDg?Q'
};

var deviceClient = new Client.IotfDevice(config);
//setting the log level to trace. By default its 'warn'
deviceClient.log.setLevel('debug');

deviceClient.connect();

deviceClient.on('connect', function() {
    console.log("connected");
    console.log('Waiting for 30 seconds...');
    setInterval(function function_name() {
        console.log('Publishing Data!');
        var data = fetchData();
        deviceClient.publish('dht11', 'json', JSON.stringify(data), QOS);
    }, 30000);
});

deviceClient.on('reconnect', function() {
    console.log('Reconnected!!!');
});

deviceClient.on('disconnect', function() {
    console.log('Disconnected from IoTF');
});

deviceClient.on('error', function(argument) {
    console.log(argument);
});

function fetchData() {
    var readout = dht.read();
    var temp = readout.temperature.toFixed(2);
    var humd = readout.humidity.toFixed(2);

    return {
        "temp": temp,
        "humd": humd
    };
}