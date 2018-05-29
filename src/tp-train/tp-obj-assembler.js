'use strict';

const tpStations = require("./tp-train-stations.js");
const tc = require("timezonecomplete");
const tpTrain = require("./tp-stationerror.js");
const stop_type = { FROM: "origin", TO: "destination", BOTH_ERR:"both", CHANGE: "change" };
//docu: https://opendata.transport.nsw.gov.au/node/601/exploreapi#!/Trip_Planner/tfnsw_trip_request2
const TRAIN_ONLY_MODE = '&inclMOT_1=on';
const EXCLUDE_NON_TRAINS = '&exclMOT_11=1&exclMOT_4=1&exclMOT_5=1&exclMOT_7=1&exclMOT_9=1&excludedMeans=checkbox';

function getJourneyByAttributes(msWait, durationInMin, fromStation, toStation, changes) {
  var journey = function(msWait, durationInMin, fromStation, toStation, changes) {
    this.msWait = msWait;
    this.duration = durationInMin;
    this.fromStation = fromStation;
    this.toStation = toStation;
    this.changes = changes;
  }
  return new journey(msWait, durationInMin, fromStation, toStation, changes);
}

function getTrainStation (name, stopType) {
  var station = function(name, stopType) {
    if(name === undefined) {
      this.name = undefined;
      this.id = undefined;
      this.stopType = stopType;
      this.arrivePlatform = undefined;
      this.departPlatform = undefined;
      this.status = false;
    }
    else {
      this.name = name.toLowerCase();
      this.id = getStationId(name, stopType); // if undefinded --> status is false.
      this.stopType = stopType;
      this.arrivePlatform = undefined;
      this.departPlatform = undefined;
      this.status = (this.id != undefined)? true : false;
    }
  }
  return new station(name, stopType);
}

function getStationId(stationName, stopType) {
  if (stationName != undefined) {
    for(var idx = 0; idx < tpStations.length; idx++) {
      if (tpStations[idx].alt.toLowerCase() === stationName.toLowerCase()) {
        return tpStations[idx].id;
      }
    }
  }
  return undefined;
}


// &exclMOT_11=1&exclMOT_4=1&exclMOT_5=1&exclMOT_7=1&exclMOT_9=1&excludedMeans=checkbox
function getTpURL (fromStation, toStation) {
  var currTcDate = getCurrSydDate();
  var str0 = 'https://api.transport.nsw.gov.au';
  var str1 = '/v1/tp/trip?TfNSWTR=true&outputFormat=rapidJSON&coordOutputFormat=EPSG%3A4326&depArrMacro=dep&';
  var month = currTcDate.month();
  month = (month < 10 ? "0" : "") + month;
  var day  = currTcDate.day();
  day = (day < 10 ? "0" : "") + day;
  var str2= 'itdDate=' + currTcDate.year() + month + day;
  var hour = currTcDate.hour();
  hour = (hour < 10 ? "0" : "") + hour;
  var min  = currTcDate.minute();
  min = (min < 10 ? "0" : "") + min;
  var str3 = '&itdTime=' + hour + min;
  var str4 = `${EXCLUDE_NON_TRAINS}&type_origin=any&name_origin=${fromStation.id}&type_destination=any&name_destination=${toStation.id}&calcNumberOfTrips=2&routeType=leastinterchange&version=10.2.2.48`;
// console.log('#tp-obj-assembler#getTpUrl: ' + str0 + str1 + str2 + str3 + str4);
  return (str0 + str1 + str2 + str3 + str4);
}

function getPlatform(station, info) {
  var platform;
  var pString;
  if (station.stopType === stop_type.FROM) {
    pString = info.journeys[0].legs[0].origin.parent.disassembledName;
  }
  else if (station.stopType === stop_type.TO) {
    pString = info.journeys[0].legs[0].destination.parent.disassembledName;
  }  //TODO improvement: find out how to do INTERCHANGE - and then return two platforms
  if (pString) {
    var pArr = pString.split(",");
    platform = (pArr.length ==2 )? pArr[1] : undefined;
  }
  return platform;
}

function getTimeDiffInMs(deptDate) {
  var currDate = getCurrSydDate();
  return (deptDate - currDate);
}

function getDurationInMin(start, end) {
  var s = new Date(start);
  var e = new Date(end);
  return ((e-s)/1000)/60;
}

function getCurrSydDate() {
  return tc.now(tc.zone("Australia/Sydney"));
}

module.exports = {
  getTrainStation: getTrainStation,
  getJourneyByAttributes: getJourneyByAttributes,
  getTpURL: getTpURL,
  getPlatform: getPlatform,
  getTimeDiffInMs: getTimeDiffInMs,
  getDurationInMin: getDurationInMin,
  stop_type: stop_type
};
