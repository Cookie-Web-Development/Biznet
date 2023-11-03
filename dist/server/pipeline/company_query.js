"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = company_query;
var _mongoose = _interopRequireDefault(require("mongoose"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function company_query(query_obj, route) {
  /*
  query structure will be
      { search: { key : value }, sort: { key: value } }
    anything outside this format must show empty list
    all values will be in string so values like _ids must be changed back to interger
    search query for products will be using the search_query.js pipeline
  */

  var query_match = query_obj.search || {};
  var query_sort = query_obj.sort || _defineProperty({}, "".concat(route, "_id"), 1);
  Object.keys(query_match).map(function (key) {
    var regex_id = /_?id$/;
    var regex_name = /_?name/;
    if (regex_id.test(key)) {
      return query_match[key] = parseInt(query_match[key]) || query_match[key];
    }
    if (regex_name.test(key)) {
      return query_match[key] = {
        $regex: query_match[key],
        $options: 'i'
      };
    }
  });
  Object.keys(query_sort).map(function (key) {
    // console.log(typeof(query_sort[key])) //string 1
    if (query_sort[key] != 1 && query_sort[key] != -1) {
      return query_sort[key] = 1;
    }
    return query_sort[key] = parseInt(query_sort[key]);
  });

  /*
  let pipeline = [
      { $match: { }},
      { $sort: { brand_id: 1 } }
  ];
  THIS IS MUST BE DE FALLBACK VALUE FOR PIPELINE IN CASE QUERY IS WRONG OR EMPTY
  */

  var pipeline = [{
    $match: query_match
  }, {
    $sort: query_sort
  }];
  return pipeline;
}