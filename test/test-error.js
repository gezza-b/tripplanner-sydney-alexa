'use strict';
var tpErrOut = require("../src/tp-alexaout/tp-alexaout-train-error.js");
var tpTrain = require("../src/tp-train/tp-stationerror.js");
var objAsr = require("../src/tp-train/tp-obj-assembler.js");
var assert = require('assert');

function testHelper(from, to) {
  var fromStation = objAsr.getTrainStation(from, objAsr.stop_type.FROM);
  var toStation = objAsr.getTrainStation(to, objAsr.stop_type.TO);
  try {
    var bool = tpErrOut.getErrorOutput(fromStation, toStation);
  }
  catch(e) {
    assert(e instanceof tpTrain.StationError);
    assert(e.message != undefined);
    return e;
  }
}

function testUndefined() {
  var errBoth = testHelper(undefined, undefined);
  assert(errBoth.message === 'Sorry, I could not understand any of the station names. Please try it again.');

  var errFirst = testHelper(undefined, 'jannali');
  assert(errFirst.message === 'I could understand your destination station jannali , but I could not hear your destination station at all.');

  var errSecond = testHelper('como', undefined);
  assert(errSecond.message === 'I could understand your station como for the beginning of your journey. But I could not hear your destination station at all.');
}

function testNotFoundAndUndefined() {
  var errFirst = testHelper('comox', undefined);
  assert(errFirst.message === 'I could not find your station comox for the beginning of your journey. And I could not hear your your destination station at all.');

  var errSecond = testHelper(undefined, 'jannix');
  assert(errSecond.message === 'I could not find your destination station jannix . And I could not hear your station for the beginning of your journey at all.');
}

function testNotFound() {
  var errBoth = testHelper('comox', 'jannalix');
  assert(errBoth.message === 'I could not understand either of your station names. They sounded like comox and like jannalix.');

  var errFirst = testHelper('como', 'jannalix');
  assert(errFirst.message === 'I could not find your destination station jannalix.');


  var errSecond = testHelper('strathfieldx', 'centrax');
  assert(errSecond.message === 'I could not understand either of your station names. They sounded like strathfieldx and like centrax.');

}

function testRunner() {
  testUndefined();
  testNotFoundAndUndefined();
  testNotFound();
  console.log('unit-test: test-error: successful');
  setTimeout(status, 1055);
}

function status() {
  console.log('#test-station: OK');
}

testRunner();

module.exports = {
  testRunner : testRunner
}
