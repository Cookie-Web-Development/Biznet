"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.products_schema = exports.listing_schema = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var listing_schema = _mongoose["default"].Schema({
  variation_options: {
    en: Object,
    es: Object
  },
  price: {
    type: Number,
    required: true
  },
  discount: {
    type: Boolean,
    "default": false
  },
  discount_percent: {
    type: Number,
    "default": 0
  },
  featured: {
    type: Boolean,
    "default": false
  },
  images: [String],
  sku: {
    type: String,
    required: true
  }
});
exports.listing_schema = listing_schema;
var products_schema = _mongoose["default"].Schema({
  product_name: {
    es: {
      type: String,
      required: true
    },
    en: {
      type: String,
      required: true
    }
  },
  description: {
    en: {
      type: String,
      "default": ''
    },
    es: {
      type: String,
      "default": ''
    }
  },
  category_id: {
    type: Number,
    ref: "categories"
  },
  brand_id: {
    type: Number,
    ref: "brands"
  },
  tag_id: {
    type: [Number],
    ref: "tags"
  },
  featured: Boolean,
  variation_type: {
    en: [String],
    es: [String]
  },
  listing: {
    type: [listing_schema],
    required: true
  }
});
exports.products_schema = products_schema;