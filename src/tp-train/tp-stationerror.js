'use strict';
var assert = require('assert');
const stop_type = { FROM: "origin", TO: "destination", BOTH_ERR:"both", CHANGE: "change" };

class StationError extends Error {
    constructor(stopType, stationName, message) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
        this.stopType = stopType;
        this.stationName = stationName;
        this.message = message;
    }
    display() {
      console.log('#tp-stationerror#StationError: type/name/message: ' + this.stopType + '/' + this.stationName + '/' + this.message);
    }
}

module.exports = {
	StationError: StationError,
  stop_type: stop_type
};
