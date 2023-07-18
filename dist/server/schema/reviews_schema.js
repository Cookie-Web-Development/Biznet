"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reviews_schema = void 0;
require("core-js/modules/es.number.constructor.js");
var _mongoose = _interopRequireDefault(require("mongoose"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var reviews_schema = _mongoose.default.Schema({
  user_id: {
    type: _mongoose.default.Schema.Types.ObjectId,
    required: true
  },
  product_id: {
    type: _mongoose.default.Schema.Types.ObjectId,
    required: true,
    ref: "products"
  },
  review_score: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  review_text: {
    type: String,
    default: ''
  }
});
exports.reviews_schema = reviews_schema;