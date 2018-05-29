'use strict';
const assert = require('assert');
const tp = require("../src");
const objAsr = require("../src/tp-train/tp-obj-assembler.js");
const tpOut = require("../src/tp-alexaout/tp-alexaout-train.js");
const tpErrOut = require("../src/tp-alexaout/tp-alexaout-train-error.js");
var tpTrain = require("../src/tp-train/tp-stationerror.js");
const tpReq = require("../src/tp-train/tp-request.js");
// const stop_type = { FROM: "origin", TO: "destination", BOTH: "both", CHANGE: "change" };


function testStationExists(name, stopType) {
  var station = objAsr.getTrainStation(name, stopType);
  assert(station.name === name);
  assert(station.id != undefined);
  assert(station.status === true);
  assert(station.status === true);
  assert(station.stopType != undefined);
  return station;
}

function testStationError(name, stopType) {
  var station = objAsr.getTrainStation(name, stopType);
  assert(station.name === name);
  assert(station.id === undefined);
  assert(station.status === false);
  assert(station.stopType != undefined);
  assert(station.stopType === stopType);
  return station;
}


function testRunner() {
  var s1 = testStationExists("jannali", objAsr.stop_type.TO);
  assert(s1.stopType === objAsr.stop_type.TO);
  assert(s1.name === "jannali");
  assert(s1.status === true);

  var s2 = testStationExists("central", objAsr.stop_type.FROM);
  assert(s2.stopType === objAsr.stop_type.FROM);
  assert(s2.name === "central");

  var s3 = testStationError("laptop", objAsr.stop_type.FROM);
  assert(s3.stopType === objAsr.stop_type.FROM);
  assert(s3.name === "laptop");

  var s4 = testStationError(undefined, objAsr.stop_type.FROM);
  assert(s4.stopType === objAsr.stop_type.FROM);
  assert(s4.status === false);

  var s5 = testStationError("{laptop}", objAsr.stop_type.TO);
  assert(s5.stopType === objAsr.stop_type.TO);
  assert(s5.status === false);

  var s6 = testStationError("melbourne / casino", objAsr.stop_type.TO);
  assert(s6.stopType === objAsr.stop_type.TO);
  assert(s6.status === false);

  var s7 = testStationExists("high street", objAsr.stop_type.TO);
  assert(s7.stopType === objAsr.stop_type.TO);
  assert(s7.name === "high street");
  assert(s7.status === true);

  var s8 = testStationExists("melbourne", objAsr.stop_type.TO);
  assert(s8.stopType === objAsr.stop_type.TO);
  assert(s8.status === true);

  var s9 = testStationExists("casino", objAsr.stop_type.TO);
  assert(s9.stopType === objAsr.stop_type.TO);
  assert(s9.status === true);

  setTimeout(status, 1055);
}


function status() {
  console.log('#test-station: OK');
}

testRunner();

module.exports = {
  testRunner: testRunner
};
