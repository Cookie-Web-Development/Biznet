"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tags_schema = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var tags_schema = _mongoose["default"].Schema({
  tag_name: {
    es: {
      type: String,
      required: true
    },
    en: {
      type: String,
      required: true
    }
  },
  tag_id: {
    type: Number,
    unique: true
  }
});
exports.tags_schema = tags_schema;