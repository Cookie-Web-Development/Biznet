"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.brands_schema = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var brands_schema = _mongoose["default"].Schema({
  brand_name: {
    type: String,
    "default": "Original"
  },
  brand_id: {
    type: Number,
    unique: true
  }
});
exports.brands_schema = brands_schema;