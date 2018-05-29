'use strict';
var assert = require('assert');
var tp = require("../src");
var tpOut = require("../src/tp-alexaout/tp-alexaout-train.js");
var tpErrOut = require("../src/tp-alexaout/tp-alexaout-train-error.js");
var tpTrain = require("../src/tp-train/tp-stationerror.js");
var testLib = require("./shared/test-trip-util.js");


// melbourne / casino / griffith to high street"
function negativeCases() {
  var err1 = testLib.testTrip(0, "melbournxe / casino", "high streetx");
  assert(err1.stopType === testLib.stop_type.BOTH_ERR);

  var err2 = testLib.testTrip(0, "melbourne", "high streetx");
  assert(err2.stopType === testLib.stop_type.TO);

  var err3 = testLib.testTrip(0, "melbourne / casinox", "high street");
  assert(err3.stopType === testLib.stop_type.FROM);
}

function positiveCases() {
  var retVal1 = testLib.testTrip(0, "melbourne", "high street");
  assert(retVal1 === true);

  var retVal2 = testLib.testTrip(0, "brisbane", "central");
  assert(retVal2 === true);
}

function status() {
  console.log('#test-trip-interstate: OK');
}

function testRunner()  {
  setTimeout(negativeCases, 50);
  setTimeout(positiveCases, 950);
  setTimeout(status, 2350);
}

testRunner();

module.exports = {
  testRunner : testRunner
}
