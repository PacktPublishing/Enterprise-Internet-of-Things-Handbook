var iotf = require('ibmiotf');
var appClientConfig = {
    org: 'do22tg',
    id: 'Pi3-DHT11-Node',
    "auth-key": 'a-do22tg-zu64byfitt',
    "auth-token": '_*4_tB?0TBt-WO?MiL'
};

var appClient = new iotf.IotfApplication(appClientConfig);

//setting the log level to trace. By default its 'warn'
appClient.log.setLevel('debug');

appClient.connect();

appClient.on('connect', function() {
    console.log("connected");
    appClient.subscribeToDeviceEvents();
    appClient.subscribeToDeviceEvents('myevt');
});

appClient.on('deviceEvent', function(deviceType, deviceId, eventType, format, payload) {
    console.log("Device Event from :: " + deviceType + " : " + deviceId + " of event " + eventType + " with payload : " + payload);
});

appClient.on('reconnect', function() {
    console.log("Reconnected!!!");
});

appClient.on('disconnect', function() {
    console.log('Disconnected from IoTF');
});

appClient.on('error', function(argument) {
    console.log(argument);
});