'use strict';
var assert = require('assert');
var request = require("../src/node_modules/request");
var tp = require("../src");
var tpOut = require("../src/tp-alexaout/tp-alexaout-train.js");
var tpErrOut = require("../src/tp-alexaout/tp-alexaout-train-error.js");
var tpTrain = require("../src/tp-train/tp-stationerror.js");
var testLib = require("./shared/test-trip-util.js");
const tpStations = require("../src/tp-train/tp-train-stations.js");
var apiKey = 'TiyUFVNFito03JWTpVPE64fcHmTrbIbPFQ8d';
var url1 = 'https://api.transport.nsw.gov.au/v1/tp/stop_finder?TfNSWSF=true&outputFormat=rapidJSON&type_sf=any&name_sf=';
var url2 = '&coordOutputFormat=EPSG%3A4326&anyMaxSizeHitList=10&version=10.2.2.48';
var local_ids = [];
var local_names = [];
var remote_ids = [];

local_ids.length = tpStations.length;
local_names.length = tpStations.length;
remote_ids.length = tpStations.length;

function runRequest(idx, station, callback) {
  var myUrl =  url1 + station + url2;

  request({
    url: myUrl,
    headers: {
      'Authorization': `apikey ${apiKey}`
    }}, (error, response, body) => {
      if (response) {
        try {
          var id = getStationIdFromResponse(error, response, body, station);
          remote_ids[idx] = id;
          callback(id);
        }
        catch(e) {
          callback(e);
        }

      }
      else {
        console.log('#test-stationid#runRequest -else: ' + error.message);
        callback(error);
      }
  });
}

function getStationIdFromResponse(error, response, body, station) {
  if (!error && response.statusCode == 200) {
    var info = JSON.parse(body);
    return info.locations[0].id;
  }
  return new tpTrain.StationError(undefined, undefined, 'Station not found');  //stopType, stationName, message
}

function testStation(idx, name) {
  runRequest(idx, name, (stationId, error) => {
    if(error) {
      console.log('error: ', error);
      return -1;
    }
    else {
      return stationId;
    }
  })
}


function getEscapedName(name) {
  var esc = name.replace(' ', '%20');
  return esc;
}

function testRunner() {
  // for(var idx = 0; idx < tpStations.length; idx++) {
  for(var idx = 1; idx < 5; idx++) {

      var name = tpStations[idx].station;
      var id_local = tpStations[idx].id;
      var nameEscaped = getEscapedName(name);
      var id_remote =  testStation(idx, nameEscaped); //push to array in runRequest

      local_ids[idx] = id_local;
      local_names[idx] = name;

  }
}

function print() {
  for(var idx = 0; idx < tpStations.length; idx++) {
    if( local_ids[idx] != remote_ids[idx] ) {
      console.log(local_names[idx] + ' ' + local_ids[idx] + ' : ' + remote_ids[idx]);
    }
  }
}

testRunner();
// setTimeout(print, 8500);

module.exports = {
  testRunner : testRunner
}
