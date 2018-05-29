'use strict';
const objAsr = require("../src/tp-train/tp-obj-assembler.js");
var assert = require('assert');

function testRunner() {
  var t = objAsr.getDurationInMin('2017-08-19T05:20:00Z', '2017-08-19T05:22:00Z');
  assert(t === 2);
  setTimeout(status, 750);
}

function status() {
  console.log('#test-trip-interstate: OK');
}

testRunner();

module.exports = {
  testRunner: testRunner
};
