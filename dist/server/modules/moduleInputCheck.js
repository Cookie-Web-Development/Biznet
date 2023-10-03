'use strict';

//input value checker constructor
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.INPUT_CHECK = INPUT_CHECK;
function INPUT_CHECK(input) {
  var value = input;
  this.checkLength = function (length) {
    return value.trim().length >= length ? true : false;
  };
  this.checkEmpty = function () {
    return value === '' || !value ? true : false;
  };
  this.checkSpace = function () {
    var regex = /\s/;
    return regex.test(value) ? true : false;
  };
  this.checkLetter = function () {
    var regex = /[A-Za-z]/;
    return regex.test(value) ? true : false;
  };
  this.checkNum = function () {
    var regex = /[0-9]/;
    return regex.test(value) ? true : false;
  };
  this.checkSpecial = function () {
    var regex = /^[a-zA-Z0-9_\-\.]+$/;
    return !regex.test(value) ? true : false;
  };
}