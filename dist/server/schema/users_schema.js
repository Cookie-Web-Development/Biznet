'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.users_schema = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var users_schema = _mongoose["default"].Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  profile_name: String,
  profile_pic: {
    type: String,
    "default": 'default.jpg'
  },
  password: {
    type: String,
    required: true
  },
  user_preferences: {
    lang: String
  },
  account_settings: {
    role: {
      type: String,
      "default": 'user'
    }
  }
});
exports.users_schema = users_schema;