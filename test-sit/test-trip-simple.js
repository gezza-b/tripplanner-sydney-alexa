'use strict';
var assert = require('assert');
var tp = require("../src");
var tpErrOut = require("../src/tp-alexaout/tp-alexaout-train-error.js");
var tpTrain = require("../src/tp-train/tp-stationerror.js");
var testLib = require("./shared/test-trip-util.js");


function positiveCasesSimpleT1_4() {
 //T1 ----
 var retVal1 = testLib.testTrip(0, "hornsby", "richmond");
 assert(retVal1 === true);

 // T2 ----
 var retVal2 = testLib.testTrip(0, "homebush", "town hall");
 assert(retVal2 === true);

 // T3 ----
 var retVal3 = testLib.testTrip(0, "warwick farm", "sefton");
 assert(retVal3 === true);

  // T4 ----
  var retVal4 = testLib.testTrip(0, "Jannali", "Redfern");
  assert(retVal4 === true);
}

function positiveCasesSimpleT5_8() {
  // T5 ----
  var retVal5 = testLib.testTrip(0, "schofields", "leumeah");
  assert(retVal5 === true);

  // T6 ----
  var retVal6 = testLib.testTrip(0, "carlingford", "clyde");
  assert(retVal6 === true);

  // T7 ----
  var retVal7 =  testLib.testTrip(0, "olympic park", "lidcombe");
  assert(retVal7 === true);

  // T8 ----
  // yet to come
}

function positiveCasesInterstate() {
  var retVal1 = testLib.testTrip(0, "melbourne", "central", "town hall");
  assert(retVal1 === true);
}


function status() {
  console.log('#test-trip-simple: OK');
}

function testRunner() {
  positiveCasesSimpleT1_4();
  setTimeout(positiveCasesInterstate, 750);
  setTimeout(positiveCasesSimpleT5_8, 1550);
  setTimeout(status, 2300);
}

testRunner();

module.exports = {
  testRunner : testRunner
}
