'use strict';
var Alexa = require("alexa-sdk");
var tpErrOut = require("./tp-alexaout/tp-alexaout-train-error.js");
var tpOut = require("./tp-alexaout/tp-alexaout-train.js");
var tpTrain = require("./tp-train/tp-stationerror.js");
var tpReq = require("./tp-train/tp-request.js");
var objAsr = require("./tp-train/tp-obj-assembler.js");
const APP_ID = 'amzn1.ask.skill.da531c1c-2999-494f-92ca-94517cff07a8';

function tellResponse(self, out) {
  if (self === undefined) {
    console.log(out);
  }
  else { self.emit(':tell', out); }
}

function askResponse(self, out) {
  if (self === undefined) {
    console.log(out);
  }
  else { self.emit(':ask', out); }
}

function getIntentResponse(currency, self, fromStation, toStation) {
  try {
    var bool = tpErrOut.getErrorOutput(fromStation, toStation);
    var url = objAsr.getTpURL(fromStation, toStation);
    tpReq.runRequest(currency, url, fromStation, toStation, (error, journey) => {
      if(error) {
        var out = 'I could not retrieve the information for your jorney from: ' + fromStation.name + ' to ' + toStation.name + '. Please try it again.';
        tellResponse(self, out);
      } else if (currency === 0) {    // first possible journey
        var out = tpOut.getAlexaOutput(currency, journey) + ' ' + tpOut.askFollowingTrain;
        askResponse(self, out);
      }
      else {                          // next possible journey
        tellResponse(self, tpOut.getAlexaOutput(currency, journey)); // Yes intent
      }
    })
  } catch (e) {
    console.log('error (catch): ' + fromStation.name + ':' + toStation.name);
    tellResponse(self, e.message);
  }
}
//----------- interaction model

var index = {
  'AMAZON.StopIntent': function () {
      this.emit(':tell', "Bye!");
  },
  'GetTrainTripIntent' : function() {
    var from = this.event.request.intent.slots.from.value;
    var to = this.event.request.intent.slots.to.value;
    var fromStation = objAsr.getTrainStation(from, objAsr.stop_type.FROM);
    var toStation = objAsr.getTrainStation(to, objAsr.stop_type.TO);
    var self = this;
    this.attributes['fromStation'] = fromStation;
    this.attributes['toStation'] = toStation;
    getIntentResponse(0, this, fromStation, toStation);
  },
  'AMAZON.YesIntent' : function () {
    getIntentResponse(1, this, this.attributes['fromStation'], this.attributes['toStation']);
  },
  'AMAZON.NoIntent' : function () {
    this.attributes['fromStation'] = undefined;
    this.attributes['toStation'] = undefined;
     this.emit(':tell', 'Good bye.');
  },
  'AMAZON.HelpIntent' : function () {
    var self = this;
    askResponse(self, tpOut.helpIntent);
    this.emitWithState("GetTrainTripIntent");
  },
  'Unhandled' : function () {
    var self = this;
    askResponse(self, tpOut.unhandledIntent);
    this.emitWithState("GetTrainTripIntent");
  }
}

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(index);
    alexa.execute();
};

function test() {
  var from = objAsr.getTrainStation('jannali', objAsr.stop_type.FROM);
  var to = objAsr.getTrainStation('central', objAsr.stop_type.TO);
  getIntentResponse(0, undefined, from, to);
}

function testMsg() {
  console.log(tpOut.unhandledIntent);
  console.log(tpOut.helpIntent);
  console.log(tpOut.askFollowingTrain);
}

// test();
