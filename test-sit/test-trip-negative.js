'use strict';
var assert = require('assert');
var tp = require("../src");
var tpOut = require("../src/tp-alexaout/tp-alexaout-train.js");
var tpErrOut = require("../src/tp-alexaout/tp-alexaout-train-error.js");
var tpTrain = require("../src/tp-train/tp-stationerror.js");
var testLib = require("./shared/test-trip-util.js");


function negativeCases1Slot() {
  var err1 = testLib.testTrip(0, undefined);
  assert(err1 instanceof tpTrain.StationError);
  assert(err1.message === 'Sorry, I could not understand any of the station names. Please try it again.');
}

function negativeCases2Slots() {
  var err1 = testLib.testTrip(0, undefined, undefined);
  assert(err1.stopType === testLib.stop_type.BOTH_ERR);
  assert(err1.stationName[0] === undefined);
  assert(err1.stationName[1] === undefined);
  assert(err1 instanceof tpTrain.StationError);
  assert(err1.message === 'Sorry, I could not understand any of the station names. Please try it again.');

  var err2 = testLib.testTrip(0, 'jannali', undefined);
  assert(err2.stopType === testLib.stop_type.TO);
  assert(err2.stationName === undefined);
  assert(err2.message === 'I could understand your station jannali for the beginning of your journey. But I could not hear your destination station at all.');

  var err3 = testLib.testTrip(0, undefined, "jannali");
  assert(err3.stopType === testLib.stop_type.FROM);
  assert(err3.stationName === undefined);
  assert(err3.message === 'I could understand your destination station jannali , but I could not hear your destination station at all.');

  var err4 = testLib.testTrip(0, "laptop", "central");
  assert(err4.stopType === testLib.stop_type.FROM);
  assert(err4.stationName === "laptop");
  assert(err4.message === 'I could not find your station laptop for the beginning of your journey.');

  var err5 = testLib.testTrip(0, "central", "bla");
  assert(err5 instanceof tpTrain.StationError);
  assert(err5.stopType === testLib.stop_type.TO);
  assert(err5.stationName === "bla");
  assert(err5.message ===  'I could not find your destination station bla.');

  var err6 = testLib.testTrip(0, "bla", "blub");
  assert(err6.stopType === testLib.stop_type.BOTH_ERR);
  assert(err6.message === 'I could not understand either of your station names. They sounded like bla and like blub.');
  assert(err6.stationName[0] === "bla");
  assert(err6.stationName[1] === "blub");
  assert(err6.message === 'I could not understand either of your station names. They sounded like bla and like blub.');
  assert(err6 instanceof tpTrain.StationError);

}

function negativeCases2SlotsNonsense() {
  var err1 = testLib.testTrip(0, "jannali", "jannali");
  assert(err1.stopType === testLib.stop_type.BOTH_ERR);
  assert(err1.message === "Your start and destination stations seem to be the same. Please try it again.");
}

function errorInDataSet2Slots() {
  try {
    var err2 = testLib.testTrip(0, "jannali", "dummy-station-1a");
  }
  catch(e) {
    console.log('-TEST-NEG: ', err2);
  }
  // assert(err2 instanceof tpTrain.StationError);
  // console.log('test-trip-neg: ', err2.message);
  // assert(err2.message === "I could not retrieve your requested journey. Please try it again.");

  // var err3 = testLib.testTrip(0, "dummy-station-1a", "jannali");
  // assert(err3.message === "I could not receive your requested journey. Please try it again.");

}

function negativeCases3Slots() {
  var err1 = testLib.testTrip(0, "melbournex", "centralx", "town hall");
  assert(err1.stopType === testLib.stop_type.BOTH_ERR);
  assert(err1.stationName[0] === "melbournex");
  assert(err1.stationName[1] === "centralx");
  assert(err1.stationName.length === 2);
  assert(err1 instanceof tpTrain.StationError);
  assert(err1.message === 'I could not understand either of your station names. They sounded like melbournex and like centralx.');
}

function status() {
  console.log('#test-trip-interstate: OK');
}

function testRunner()  {
  negativeCases1Slot();
  // setTimeout(negativeCases2Slots, 375);
  // setTimeout(negativeCases3Slots, 650);
  // setTimeout(negativeCases2SlotsNonsense, 950);
  setTimeout(errorInDataSet2Slots, 1250);
  setTimeout(status, 3055);
}

testRunner();

module.exports = {
  testRunner : testRunner
}
