'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.session_schema = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var session_schema = _mongoose["default"].Schema({
  _id: {
    type: String,
    required: true
  },
  expires: Date,
  session: String
});
exports.session_schema = session_schema;