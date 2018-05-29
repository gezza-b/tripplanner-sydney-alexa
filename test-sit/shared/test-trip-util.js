'use strict';
var assert = require('assert');
var tp = require("../../src");
var objAsr = require("../../src/tp-train/tp-obj-assembler.js");
var tpOut = require("../../src/tp-alexaout/tp-alexaout-train.js");
var tpErrOut = require("../../src/tp-alexaout/tp-alexaout-train-error.js");
var tpTrain = require("../../src/tp-train/tp-stationerror.js");
var tpReq = require("../../src/tp-train/tp-request.js");
const stop_type = { FROM: "origin", TO: "destination", BOTH_ERR: "both", CHANGE: "change" };


function testTrip(currency, from, to) {
  var fromStation = objAsr.getTrainStation(from, stop_type.FROM);
  var toStation = objAsr.getTrainStation(to, stop_type.TO);
  var self = this;
  try { // try block enables testing of errors
    var bool = tpErrOut.getErrorOutput(fromStation, toStation);
    var url = objAsr.getTpURL(fromStation, toStation);
      assert(url != undefined);
    tpReq.runRequest(currency, url, fromStation, toStation, (error, journey) => {
      if(error) {
        // console.log('#test-trip-util #testTrip @try@error: ', error);
        // console.log('#test-trip-util #testTrip @try@error.message: ', error.message);
        assert(error);
        assert(error instanceof tpTrain.StationError);
        assert(error.message != undefined);
        throw(error);
      } else {
        assert(journey != undefined);
        assert(journey.msWait != undefined);
        assert(journey.duration != undefined);
        assert(journey.fromStation != undefined);
        assert(journey.fromStation === fromStation);

        assert(journey.toStation === toStation);
        assert(journey.msWait > 0);
        if( ((fromStation.name != 'melbourne')) && (toStation.name != 'melbourne')
        && (fromStation.name != 'brisbane') && (toStation.name != 'melbourne') ) {
          assert(journey.msWait < 32400000); //8 hrs: 28,800,000; 9hrs: 32,400,000
          // 1hr=3,600,000; 12hr=43,200,000; 11.5hr=41,400,000
        }
        else {  // interstate
          assert(journey.msWait < 86400000)  //48 hours: 86,400,000
        }
        assert(journey.msWait > 0);
        assert(journey.fromStation.departPlatform != undefined);

        var out = tpOut.getAlexaOutput(currency, journey);
        assert(out.includes(' Platform ') === true);
      }
    })
  } catch (e) {
    console.log('#test-trip-util #testTrip @catch-error: ' + from + '/' + to + ':  ' + e.message);
    return e;
  }
  return true;
}

module.exports = {
  testTrip: testTrip,
  stop_type: stop_type
};
