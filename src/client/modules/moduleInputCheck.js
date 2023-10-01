'use strict';

//input value checker constructor
export function INPUT_CHECK(input) {
    let value = input;

    this.checkLength = function (length) {
        return value.trim().length >= length ? true : false;
    }

    this.checkEmpty = function () {
        return value === '' || !value ? true : false;
    }

    this.checkSpace = function () {
        let regex = /\s/;
        return regex.test(value) ? true : false;
    }

    this.checkLetter = function () {
        let regex = /[A-Za-z]/;
        return regex.test(value) ? true : false;
    }

    this.checkNum = function () {
        let regex = /[0-9]/;
        return regex.test(value) ? true : false;
    }

    this.checkSpecial = function () {
        let regex = /^[a-zA-Z0-9_\-\.]+$/;
        return !regex.test(value) ? true : false;
    }
}