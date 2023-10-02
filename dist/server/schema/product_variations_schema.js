"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.product_variations_schema = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var product_variations_schema = _mongoose["default"].Schema({
  variation_type: {
    type: String,
    required: true
  },
  variation_name: {
    type: String,
    required: true
  },
  product_id: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "products"
  },
  variation_price: Number,
  variation_discount_percent: {
    type: Number,
    "default": 0
  },
  variation_discount: {
    type: Boolean,
    "default": false
  },
  variation_featured: {
    type: Boolean,
    "default": false
  },
  variation_images: [String],
  variation_sku: {
    type: String,
    "default": function _default() {
      return this.product_id ? this.product_id.sku : "";
    }
  }
});
exports.product_variations_schema = product_variations_schema;