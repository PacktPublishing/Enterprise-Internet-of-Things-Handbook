var rpiDhtSensor = require('rpi-dht-sensor');
var request = require('request');

var API_KEY = 'R9XY4AXEG52DJHIT'; // ThingSpeak 'write' API key
var dht = new rpiDhtSensor.DHT11(2); // `2` => GPIO2

function read() {
    var readout = dht.read();
    var t = readout.temperature.toFixed(2);
    var h = readout.humidity.toFixed(2);

    console.log(new Date(), 'Temperature: ' + t + 'C, ' + 'humidity: ' + h + '%');
    // Post data only if temperature and humidity are > `0`
    if (t > 0 && h > 0) {
        uploadData({
            t: t,
            h: h
        });
    }
    setTimeout(read, 30000); // 30 seconds gap between reads 
}

// inti read
read();

function uploadData(data) {
    var options = {
        method: 'POST',
        url: 'https://api.thingspeak.com/update',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
            field1: data.t,
            field2: data.h,
            api_key: API_KEY
        }
    };
    
    request(options, function(error, response, body) {
        if (error) { console.log(error) };
    });
}