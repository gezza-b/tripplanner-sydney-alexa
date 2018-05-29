'use strict';
var assert = require('assert');
var tp = require("../src");
var tpOut = require("../src/tp-alexaout/tp-alexaout-train.js");
var tpErrOut = require("../src/tp-alexaout/tp-alexaout-train-error.js");
var tpTrain = require("../src/tp-train/tp-stationerror.js");
var testLib = require("./shared/test-trip-util.js");


function testRunner() {
  // T4 ----
  var retVal1 = testLib.testTrip(0, "Loftus", "Kirrawee");
  assert(retVal1 === true);

 // T4 ----
  var retVal2 = testLib.testTrip(1, "Kirrawee", "Loftus");
  assert(retVal2 === true);

 // T2 & T3 ----
 var retVal3 = testLib.testTrip(0, "revesby", "bankstown");
 assert(retVal3 === true);

 setTimeout(status, 2050);
}

function status() {
  console.log('#test-trip-complex: OK');
}

testRunner();

module.exports = {
  testRunner : testRunner
}
