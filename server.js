'use strict'

const log = require('npmlog-ts')
    , globals  = require('./globals')()
    , _ = require('lodash')
    , util = require('util')
    , ankiNodeUtils = require('./ankiNodeUtils.js')()
    , express = require('express')
    , bodyParser = require('body-parser')
;
//var trackMap = require('./trackMap.js')();

log.timestamp = true;
log.level     = 'verbose';

var movingTruck = _.noop(); // We need to know the moving truck by the time we request to stop it when it reaches the finish line

log.info(PROCESS, "WEDO Industry - Truck Handler - 1.0");
log.info(PROCESS, "Author: John Graves <john.graves@oracle.com> (Main code)");
log.info(PROCESS, "        Carlos Casares <carlos.casares@oracle.com> (WEDO Industry tailoring)");
log.info(BLE, "Using BLE device id: " + (process.env.NOBLE_HCI_DEVICE_ID || 0));

var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.post('/connect/:carname', function (req, res) {
    var carName = req.params.carname
    log.verbose(BLE, "Trying to connect to " + carName)
    ankiNodeUtils.connectCar(carName);
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify({ result: "Success"}));
    res.end();
});

app.post('/disconnect/:carname', function (req, res) {
    var carName = req.params.carname
    log.verbose(BLE, "Trying to disonnect to "+carName)
    ankiNodeUtils.disconnectCar(carName);
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify({ result: "Success"}));
    res.end();
});

app.post('/setSpeed/:carname/:speedValue', function (req, res) {
  var carName = req.params.carname
  var speed = req.params.speedValue
  ankiNodeUtils.setSpeed(carName,speed);
  res.set('Content-Type', 'application/json');
  res.send(JSON.stringify({ result: "Success"}));
  res.end();
});

app.post('/changeLanes/:carname/:changeValue', function (req, res) {
  var carName = req.params.carname
  var change = req.params.changeValue
  ankiNodeUtils.changeLanes(carName,change);
  res.set('Content-Type', 'application/json');
  res.send(JSON.stringify({ result: "Success"}));
  res.end();
});

app.post('/setLaneOffset/:carname/:changeValue', function (req, res) {
  var carName = req.params.carname
  var change = req.params.changeValue
  ankiNodeUtils.setLaneOffset(carName,change);
  res.set('Content-Type', 'application/json');
  res.send(JSON.stringify({ result: "Success"}));
  res.end();
});

app.post('/turnOnHeadlights/:carname', function (req, res) {
  result = ankiNodeUtils.setLights(req.params.carname,0x44);
  res.set('Content-Type', 'application/json');
  res.send(JSON.stringify({ result: "Success"}));
  res.end();
});

app.post('/turnOffHeadlights/:carname', function (req, res) {
  result = ankiNodeUtils.setLights(req.params.carname,0x04);
  res.set('Content-Type', 'application/json');
  res.send(JSON.stringify({ result: "Success"}));
  res.end();
});

app.post('/turnOnTaillights/:carname', function (req, res) {
  result = ankiNodeUtils.setLights(req.params.carname,0x22);
  res.set('Content-Type', 'application/json');
  res.send(JSON.stringify({ result: "Success"}));
  res.end();
});

app.post('/flashTaillights/:carname', function (req, res) {
  result = ankiNodeUtils.setLights(req.params.carname,0x88);
  res.set('Content-Type', 'application/json');
  res.send(JSON.stringify({ result: "Success"}));
  res.end();
});

app.post('/turnOffTaillights/:carname', function (req, res) {
  result = ankiNodeUtils.setLights(req.params.carname,0x02);
  res.set('Content-Type', 'application/json');
  res.send(JSON.stringify({ result: "Success"}));
  res.end();
});

app.post('/setEngineLight/:carName/:red/:green/:blue', function (req, res) {
  ankiNodeUtils.setEngineLight(req.params.carName,req.params.red,req.params.green,req.params.blue);
  res.set('Content-Type', 'application/json');
  res.send(JSON.stringify({ result: "Success"}));
  res.end();
});

app.get('/ping/:carname', function (req, res) {
  ankiNodeUtils.ping(req.params.carname).then(function(data) {
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify({ ping: data}));
    log.verbose(BLE, "Returning value");
    res.end();
  });
});

app.get('/batteryLevel/:carname', function (req, res) {
  ankiNodeUtils.batteryLevel(req.params.carname).then(function(level) {
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify({ battery: level}));
    log.verbose(BLE, "Returning value");
    res.end();
  });
});

app.get('/uturn/:carname', function (req, res) {
  ankiNodeUtils.uTurn(req.params.carname);
  res.set('Content-Type', 'application/json');
  res.send(JSON.stringify({ result: "Success"}));
  res.end();
});

app.get('/getDevices', function (req, res) {
  res.contentType('application/json');
  res.set('Content-Type', 'application/json');
  res.send(JSON.stringify({ carList: carList}));
  res.end();
});

app.post('/rescan', function (req, res) {
    log.verbose(BLE, "Rescan");
    ankiNodeUtils.rescan();
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify({ result: "Success"}));
    res.end();
});

app.post('/turnOnLogging/:carname', function (req, res) {
    var carName = req.params.carname
    log.verbose(BLE, "Turn on logging: "+carName);
    ankiNodeUtils.turnOnLogging(carName);
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify({ result: "Success"}));
    res.end();
});

app.post('/trackCountTravel/:carname/:trackCount/:speed', function (req, res) {
    var carName = req.params.carname
    var trackCount = req.params.trackCount
    var speed = req.params.speed
    log.verbose(BLE, "trackCountTravel: "+carName+" - "+trackCount+" - "+speed);
    ankiNodeUtils.trackCountTravel(carName,trackCount,speed);
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify({ result: "Success"}));
    res.end();
});

app.get('/exit', function (req, res) {
  res.set('Content-Type', 'application/json');
  res.send(JSON.stringify({ result: "Success"}));
  res.end();
  process.exit();
});

app.get('/ping', function (req, res) {
  res.set('Content-Type', 'application/json');
  res.send(JSON.stringify({ result: "Success"}));
  res.end();
});

// Custom API for WEDO Industry

app.post('/start/:carname/:speedAlias', function (req, res) {
  var carName = req.params.carname;
  var speedAlias = req.params.speedAlias;
  var speedRecord = _.find(SPEED, { alias: speedAlias } );
  if (!speedRecord) {
    var message = "Unknown spped parameter: " + speedAlias;
    log.error(REST, message);
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify({ result: "Failure", message: message}));
    res.end();
    return;
  }
  if (!ankiNodeUtils.checkCar(carName)) {
    var message = "Car '" + carName + "' not found or discovered";
    log.error(REST, message);
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify({ result: "Failure", message: message}));
    res.end();
    return;
  }
  ankiNodeUtils.setSpeed(carName, speedRecord.speed);
  res.set('Content-Type', 'application/json');
  res.send(JSON.stringify({ result: "Success"}));
  res.end();
  movingTruck = carName;
});

app.post('/stop/:carname', function (req, res) {
  var carName = req.params.carname;
  var speedRecord = _.find(SPEED, { alias: 'stop' } );
  if (!ankiNodeUtils.checkCar(carName)) {
    var message = "Car '" + carName + "' not found or discovered";
    log.error(REST, message);
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify({ result: "Failure", message: message}));
    res.end();
    return;
  }
  ankiNodeUtils.setSpeed(carName, speedRecord.speed);
  res.set('Content-Type', 'application/json');
  res.send(JSON.stringify({ result: "Success"}));
  res.end();
  movingTruck = _.noop();
});

app.post('/changeLane/:carname/:laneAlias', function (req, res) {
  var carName = req.params.carname;
  var laneAlias = req.params.laneAlias;
  var laneRecord = _.find(LANES, { alias: laneAlias } );
  if (!laneRecord) {
    var message = "Unknown lane parameter: " + laneAlias;
    log.error(REST, message);
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify({ result: "Failure", message: message}));
    res.end();
    return;
  }
  if (!ankiNodeUtils.checkCar(carName)) {
    var message = "Car '" + carName + "' not found or discovered";
    log.error(REST, message);
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify({ result: "Failure", message: message}));
    res.end();
    return;
  }
  ankiNodeUtils.changeLanes(carName, laneRecord.laneOffset);
  res.send(JSON.stringify({ result: "Success"}));
  res.end();
});

//app.use('/', express.static('apidoc'));

//////////////////////////////////////////////////////////
// Start listener
//////////////////////////////////////////////////////////
var server = app.listen(7877, function () {
  log.info(PROCESS, "Listening at http://localhost:7877");
})
