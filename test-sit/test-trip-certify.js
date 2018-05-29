'use strict';
var assert = require('assert');
var tp = require("../src");
var tpOut = require("../src/tp-alexaout/tp-alexaout-train.js");
var tpErrOut = require("../src/tp-alexaout/tp-alexaout-train-error.js");
var tpTrain = require("../src/tp-train/tp-stationerror.js");
var tpReq = require("../src/tp-train/tp-request.js");
var testLib = require("./shared/test-trip-util.js");


function testAwsCases() {
  // var retVal1 = testLib.testTrip(0, "casino", "high street");
  // assert(retVal1 === true);

  var retVal2 = testLib.testTrip(0, "melbourne", "high street");
  assert(retVal2 === true);

  // var retVal3 = testLib.testTrip(0, "melbourne", "griffith");
  // assert(retVal3 === true);

}

function testRunner()  {
  testAwsCases();
  //melbourne", "casino", "griffith", the skill provides error response.
}

testRunner();

module.exports = {
  testRunner : testRunner
}
