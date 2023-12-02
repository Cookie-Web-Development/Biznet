"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.categories_schema = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var categories_schema = _mongoose["default"].Schema({
  category_name: {
    es: {
      type: String,
      required: true
    },
    en: {
      type: String,
      required: true
    }
  },
  category_id: {
    type: Number,
    unique: true
  },
  demo: {
    type: Boolean,
    "default": false
  },
  ttl: {
    type: Number,
    "default": null
  }
}, {
  timestamps: true
});
exports.categories_schema = categories_schema;