'use strict';
const tp = require("./../index.js");
const undefinedIntent = 'You can ask me for your next train. For example:  When is my next train from Wynyard to Central? ';
const missingSlots = 'I could not understand your train stations for the start end end of your journey. ';
const anotherReq = 'Can I help you with another trip request? ';
const undefinedSlots = 'Sorry, I could not understand any of the station names. Please tell me your start and destination station. ';
const helpIntent = 'Try saying: Alexa, ask my trip for the next train from Central to Cronulla';
const unhandledIntent = 'Try saying: Alexa, ask my trip for the next train from Town Hall to Cronulla';
const askFollowingTrain = 'Would you like to know the departure time of the following train as well?';
const generalError = "Sorry, I had a problem understanding your request. Please ask me for a train trip within New South Wales.";

function getWaitingTime(ms) {
  var MyWait = function (ms) {
    this.hrs = Math.floor((ms % 86400000) / 3600000); // hours
    this.mins = Math.floor((ms % 3600000) / 60000); // minutes
    this.secs = Math.floor (ms/1000) % 60; // seconds
  }
  return new MyWait(ms);
}

var getAlexaOutput = function(currency, journey) {
  var wTime = getWaitingTime(journey.msWait);
  var descriptor = (currency === 0)? 'next' : 'following';
  var outStr = `Your ${descriptor} train from ${journey.fromStation.name} to ${journey.toStation.name} departs in `;
  var hrsFormatted = '';
  switch(wTime.hrs) {
    case 0:
      hrsFormatted = '';
      break;
    case 1:
      hrsFormatted = '1 hour and ';
      break;
    default:
      hrsFormatted = wTime.hrs + ' hours and ';
  }
  var minFormatted = '';
  switch(wTime.mins) {
    case 1:
      minFormatted = '1 minute and ';
      break;
    default:
      minFormatted = wTime.mins + ' minutes and ';
  }
  var secFormatted = '';
  switch(wTime.secs) {
    case 1:
      secFormatted = '1 second';
      break;
    default:
      secFormatted = wTime.secs + ' seconds';
  }
  var aResp = outStr + hrsFormatted + minFormatted + secFormatted + getFromPlatformOutput(journey.fromStation) + getDurationOutput(journey.duration);
  return aResp;
};

function getFromPlatformOutput(station) {
  if(station.departPlatform) {
    return `  at ${station.departPlatform}. `;
  }
  else {
    console.log('#tp-alexaout-train#getFromPltformOutput-platform: ' + JSON.stringify(station, undefined, 2));
  }
  return "";
}

function getDurationOutput(duration) {
  if (duration != undefined) {
    return ` Your journey will take ${duration} minutes. `
  }
  return "";
}

function getWaitingTime(ms) {
  var MyWait = function (ms) {
    this.hrs = Math.floor((ms % 86400000) / 3600000); // hours
    this.mins = Math.floor((ms % 3600000) / 60000); // minutes
    this.secs = Math.floor (ms/1000) % 60; // seconds
  }
  return new MyWait(ms);
}

module.exports = {
  getAlexaOutput: getAlexaOutput,
  undefinedIntent: undefinedIntent,
  missingSlots: missingSlots,
  anotherReq: anotherReq,
  undefinedSlots: undefinedSlots,
  helpIntent: helpIntent,
  unhandledIntent: unhandledIntent,
  askFollowingTrain: askFollowingTrain,
  generalError : generalError
};
