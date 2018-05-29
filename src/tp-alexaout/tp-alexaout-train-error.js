'use strict';
var tpTrain = require("./../tp-train/tp-stationerror.js");

function getOneUndefinedOtherNotFoundError(from, to) {
  if (from.status === false && to.name === undefined) {
    throw new tpTrain.StationError (tpTrain.stop_type.BOTH_ERR, undefined, `I could not find your station ${from.name} for the beginning of your journey. And I could not hear your your destination station at all.`);
  }
  else if (from.name === undefined && to.status === false) {
    throw new tpTrain.StationError (tpTrain.stop_type.BOTH_ERR, undefined, `I could not find your destination station ${to.name} . And I could not hear your station for the beginning of your journey at all.`);
  }
  else { return false; }
}

function getOneUndefinedOneFoundError(from, to) {
  if (from.status === true && to.name === undefined) {
    throw new tpTrain.StationError (tpTrain.stop_type.TO, undefined, `I could understand your station ${from.name} for the beginning of your journey. But I could not hear your destination station at all.`);
  }
  else if (from.name === undefined && to.status === true) {
    throw new tpTrain.StationError (tpTrain.stop_type.FROM, undefined, `I could understand your destination station ${to.name} , but I could not hear your destination station at all.`);
  }
  else { return false; }
}

function getOneNotFundButBothDefinedError(from, to) {
  // from not found
  if((from.name != undefined && from.status === false) && (to.name != undefined && to.status === true)) {
    throw new tpTrain.StationError(tpTrain.stop_type.FROM, from.name, `I could not find your station ${from.name} for the beginning of your journey.`);
  }
  else if((from.name != undefined && from.status == true) && (to.name != undefined && to.status == false)) {
    throw new tpTrain.StationError(tpTrain.stop_type.TO, to.name, `I could not find your destination station ${to.name}.`);
  }
  else { return false; }
}

function getBothIdenticalButDefined(from, to) {
  if((from.name != undefined && from.status === true) &&
  (to.name != undefined && to.status === true) && (from.name === to.name)) {
    throw new tpTrain.StationError(tpTrain.stop_type.BOTH_ERR, [from.name, to.name], "Your start and destination stations seem to be the same. Please try it again.");
  }
  else { return false; }
}

function getBothNotFoundButDefinedError(from, to) {
  // error constructor(stopType, stationName, message) {
  if((from.name != undefined && from.status === false) && (to.name != undefined && to.status === false)) {
    throw new tpTrain.StationError(tpTrain.stop_type.BOTH_ERR, [from.name, to.name], `I could not understand either of your station names. They sounded like ${from.name} and like ${to.name}.`);
  }
  else { return false; }
 }

function getBothUndefinedError(from, to) {
  if ( (from === undefined & to === undefined) ||
    (from.name === undefined && to.name === undefined)) {
    throw new tpTrain.StationError (tpTrain.stop_type.BOTH_ERR, [from.name, to.name], "Sorry, I could not understand any of the station names. Please try it again.");
  }
  else { return false; }
}

function getErrorOutput (fromStation, toStation) {
  getBothUndefinedError(fromStation, toStation);              //2-undefined
  getOneUndefinedOtherNotFoundError(fromStation, toStation);  //1-undefined, 1-notFound
  getOneUndefinedOneFoundError(fromStation, toStation);       //1-undefined, 1-found
  getBothIdenticalButDefined(fromStation, toStation);         //2-deined, both the same
  getBothNotFoundButDefinedError(fromStation, toStation);     //2-notFound, 2-defined
  getOneNotFundButBothDefinedError(fromStation, toStation);  //1-notFound, 2-defined
  console.log('#tp-alexaout-train-error#getErrorOutput@noError');
  return false;
}

module.exports = {
  getErrorOutput: getErrorOutput
};
