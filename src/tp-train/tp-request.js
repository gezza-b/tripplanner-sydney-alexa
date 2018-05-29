'use strict';
var request = require("request");
const objAsr = require("./tp-obj-assembler.js");
const tpTrain = require("./tp-stationerror.js");
var apiKey = process.env['TP_APIKEY'];

function runRequest(currency, myUrl, fromStation, toStation, callback) {
  request({
    url: myUrl,
    headers: {
      'Authorization': `apikey ${apiKey}`
    }}, (error, response, body) => {
      if (response) {
        try {
          var journey = getJourneyFromResponse(error, response, body, currency, fromStation, toStation);
          callback(null, journey);
        }
        catch(e) {
          // data errors go here
          console.log('#tp-request #runRequest @if@try@catch-e: (' + fromStation.name + '/' + toStation.name + '): ' + e.message);
          callback(e);
        }
      }
      else {
        console.log('#tp-request#runRequest@if-else: ' + error.message);
        callback(error);
      }
  });
}

function isDepartureInPast(departTime) {
  return new Date(departTime) < new Date()? true : false;
}

function isErrorInResponse(info, fromName, toName) {
  if(info.journeys === undefined) {
    console.log('#tp-request#isErrorInResponse@if-undefined');
    throw new tpTrain.StationError(objAsr.stop_type.BOTH, fromName + '/' + toName, 'I could not retrieve your requested journey. Please try it again.');
  }
}

function getJourneyFromResponse(error, response, body, currency, fromStation, toStation) {
  if (!error && response.statusCode == 200) {
    
      var info = JSON.parse(body);
      isErrorInResponse(info, fromStation.name, toStation.name);

      var departTime = info.journeys[currency].legs[0].origin.departureTimeEstimated;
      var info = JSON.parse(body);
      var length = info.journeys[currency].legs.length;
      var arrivalTime = info.journeys[currency].legs[length-1].destination.arrivalTimeEstimated;
      var duration = objAsr.getDurationInMin(departTime, arrivalTime);
      if(isDepartureInPast(departTime)) {
        // bug/feature in TfNSW-EFA API: negative time is called out:
        console.log('#tp-request: ----departure-in-past-issue: ' + fromStation.name + '/' + toStation.name);
        departTime = info.journeys[currency+1].legs[0].origin.departureTimeEstimated;
      }
      var msToDept = objAsr.getTimeDiffInMs(new Date(departTime));
      fromStation.departPlatform = objAsr.getPlatform(fromStation, info);
      toStation.arrivePlatform = objAsr.getPlatform(toStation, info);

      var myJourney = objAsr.getJourneyByAttributes(msToDept, duration, fromStation, toStation, undefined);
      return myJourney;

  }
  else {
    console.log('tp-request#getJourneyFromResponse@else ---');
    throw new tpTrain.StationError(errStation.stopType, undefined, 'I could not understand your request');
  }
}

module.exports = {
  runRequest: runRequest
};
