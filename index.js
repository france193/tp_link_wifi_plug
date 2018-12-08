// import modules
const dotenv = require('dotenv');
const {Client} = require('tplink-smarthome-api');

// check env settings
const result = dotenv.config();

if (result.error) {
	throw result.error
}

// test if ev are loaded
console.log(process.env.TP_LINK_HOST);

const client = new Client();

// Look for devices, log to console
client.startDiscovery().on('device-new', (device) => {
	device.getSysInfo()
		.then(console.log);
});

// host IP read from .env variable
const deviceOptions = {host: process.env.TP_LINK_HOST};

// Given a known host, read its status and:
// - if it is on, turn it off
// - if it is off, turn it on
client.getDevice(deviceOptions)
	.then(async function (device) {
		//device.getSysInfo().then(console.log);

		const status = await device.getPowerState();

		if (status) {
			device.setPowerState(false).then(function () {
				console.log("Turned OFF");
			});
		}

		if (!status) {
			device.setPowerState(true).then(function () {
				console.log("Turned ON");
			});
		}
	});