'use strict';
var assert = require('assert');
var tp = require("../src");
var tpOut = require("../src/tp-alexaout/tp-alexaout-train.js");
var tpErrOut = require("../src/tp-alexaout/tp-alexaout-train-error.js");
var tpTrain = require("../src/tp-train/tp-stationerror.js");
var tpReq = require("../src/tp-train/tp-request.js");
var testLib = require("./shared/test-trip-util.js");
const tpStations = require("../src/tp-train/tp-train-stations.js");
var counter = 0;
var suspiciousCouples = [];
var safeCouples = [];
var troubles = [];
// docu: https://opendata.transport.nsw.gov.au/node/601/exploreapi

// function test



function testTrip(number, from, to) {
  try {
    var retVal = testLib.testTrip(0, from, to);
    assert(retVal === true);
    safeCouples.push(from);
  }
  catch(e) {
    suspiciousCouples.push(from);
    suspiciousCouples.push(to);
  }
}

function run() {
  var origin = true;
  var from;
  var to;

  // for(var idx = 0; idx < tpStations.length; idx++) {
  for(var idx = 199; idx < tpStations.length; idx++) {
    if (origin === true) {
      from = tpStations[idx].alt;
      origin = false;
    }
    else {
      to = tpStations[idx].alt;
      origin = true;
      testTrip(idx, from, to);
    }
  }
}

function cleanUp() {
  for(var idx = 0; idx < suspiciousCouples.length; idx++) {
    //TODO pair: one from suspicious with one of the healthy queue;
  }
}

function printIssues() {
  for(var idx = 0; idx < suspiciousCouples.length; idx++) {
    //TODO: MONDAY: build clean-up Queue
    cleanUp();
    console.log(suspiciousCouples); // replace with: print cleanUp
  }
}

function testRunner() {
  run();
  setTimeout(printIssues, 8500);
}

testRunner();

module.exports = {
  testRunner : testRunner
}
