"use strict";

require("core-js/modules/es.symbol.to-primitive.js");
require("core-js/modules/es.date.to-primitive.js");
require("core-js/modules/es.symbol.js");
require("core-js/modules/es.symbol.description.js");
require("core-js/modules/es.object.to-string.js");
require("core-js/modules/es.number.constructor.js");
require("core-js/modules/es.object.keys.js");
require("core-js/modules/es.array.filter.js");
require("core-js/modules/es.object.get-own-property-descriptor.js");
require("core-js/modules/web.dom-collections.for-each.js");
require("core-js/modules/es.object.get-own-property-descriptors.js");
require("core-js/modules/es.symbol.iterator.js");
require("core-js/modules/es.array.iterator.js");
require("core-js/modules/es.string.iterator.js");
require("core-js/modules/web.dom-collections.iterator.js");
require("core-js/modules/es.array.from.js");
require("core-js/modules/es.array.slice.js");
require("core-js/modules/es.regexp.to-string.js");
require("core-js/modules/es.regexp.exec.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = search_query;
require("core-js/modules/es.function.name.js");
require("core-js/modules/es.array.map.js");
require("core-js/modules/es.object.entries.js");
var _mongoose = _interopRequireDefault(require("mongoose"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function search_query(query_input) {
  var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
  /*
  query_input: { //A.K.A req.body
    name: 'Batidora',
    price_range_min: '164',
    price_range_max: '785',
    category: '2',
    brand: '1',
    selected_tags: [ '5', '6' ],
    discount: 'true',
    featured: 'true',
    search_lang: 'es',
    sort_option: "0-9",
    more_brand: [ product_id, brand_id ]
    more_similar: [ product_id, result[0].brand_id, {category}, [...tags_id]]
  },
    option: {
      sample: sample_number || skip: [ page_number, limit_per_page ]
  }
    sample: only shows limited amount, randomly selectec from pool of documents.
  skip: only shows limit_per_page, from a specific number. Used for pagination.
    */
  var queryObj = {};
  //id

  if (query_input.id) {
    queryObj._id = new _mongoose.default.Types.ObjectId(query_input.id);
  }

  //name
  if (query_input.name) {
    queryObj.$or = [{
      "name.en": {
        $regex: query_input.name,
        $options: 'i'
      }
    }, {
      "name.es": {
        $regex: query_input.name,
        $options: 'i'
      }
    }];
  }

  //price_range_min
  //price_range_max
  if (query_input.price_range_min || query_input.price_range_max) {
    if (!queryObj.listing) {
      queryObj.listing = {};
    }
    if (query_input.price_range_min && query_input.price_range_max) {
      queryObj.listing = {
        $elemMatch: _objectSpread(_objectSpread({}, queryObj.listing.$elemMatch), {}, {
          price_discounted: {
            $gte: +query_input.price_range_min,
            $lte: +query_input.price_range_max
          }
        })
      };
    } else if (query_input.price_range_min) {
      queryObj.listing = {
        $elemMatch: _objectSpread(_objectSpread({}, queryObj.listing.$elemMatch), {}, {
          price_discounted: {
            $gte: +query_input.price_range_min
          }
        })
      };
    } else {
      queryObj.listing = {
        $elemMatch: _objectSpread(_objectSpread({}, queryObj.listing.$elemMatch), {}, {
          price_discounted: {
            $lte: +query_input.price_range_max
          }
        })
      };
    }
  }

  //category
  if (query_input.category) {
    queryObj.category_id = +query_input.category;
  }

  //brand
  if (query_input.brand) {
    queryObj.brand_id = +query_input.brand;
  }

  //selected_tags
  if (query_input.selected_tags) {
    //change all elements inside array from string to number
    query_input.selected_tags = query_input.selected_tags.map(function (entry) {
      return +entry;
    });
    queryObj.tag_id = {
      $all: _toConsumableArray(query_input.selected_tags)
    };
  }

  //discount
  if (query_input.discount) {
    if (!queryObj.listing) {
      queryObj.listing = {};
    }
    queryObj.listing = {
      $elemMatch: _objectSpread(_objectSpread({}, queryObj.listing.$elemMatch), {}, {
        discount: Boolean(query_input.discount)
      })
    };
  }
  //featured
  if (query_input.featured) {
    queryObj.featured = Boolean(query_input.featured);
  }
  ;

  // sorting option NEED FIIXING!
  var sort = {};
  switch (query_input.sort_option) {
    case '9-0':
      sort = {
        "listing[0].price_discounted": -1
      };
      break;
    case 'a-z':
      sort = {
        name: 1
      };
      break;
    case 'z-a':
      sort = {
        name: -1
      };
      break;
    default:
      sort = {
        "listing[0].price_discounted": 1
      };
  }
  ;

  /*##############################
  similar query: Only used in /product/:id. Should not be used anywhere else for now
  ##############################*/
  //{ more_brand: [product_id, brand_id] }
  if (query_input.more_brand) {
    queryObj.$and = [{
      _id: {
        $ne: new _mongoose.default.Types.ObjectId(query_input.more_brand[0])
      }
    }, {
      brand_id: query_input.more_brand[1]
    }];
  }
  //{ more_similar: [product_id, result[0].brand_id, category_id, [...tags_id]] }
  if (query_input.more_similar) {
    queryObj.$and = [{
      _id: {
        $ne: new _mongoose.default.Types.ObjectId(query_input.more_similar[0])
      }
    }, {
      brand_id: {
        $ne: query_input.more_similar[1]
      }
    } //avoid showing same items on main and more_brand
    ];

    queryObj.$and.push({
      $or: [{
        category_id: {
          $eq: query_input.more_similar[2]
        }
      }, {
        tag_id: {
          $elemMatch: {
            $in: _toConsumableArray(query_input.more_similar[3])
          }
        }
      }]
    });
  }

  //{ more_product: product_id }
  if (query_input.more_product) {
    queryObj._id = {
      $ne: query_input.more_product
    };
  }
  var pipeline = [{
    $addFields: {
      listing: {
        $map: {
          input: "$listing",
          as: "entry",
          in: {
            $mergeObjects: ["$$entry", {
              price_discounted: {
                $round: [{
                  $subtract: ["$$entry.price", {
                    $multiply: ["$$entry.price", "$$entry.discount_percent"]
                  }]
                }, 2]
              }
            }]
          }
        }
      }
    }
  }, {
    $match: queryObj
  }, {
    $lookup: {
      from: "categories",
      localField: "category_id",
      foreignField: "category_id",
      as: "category_name"
    }
  }, {
    $unwind: "$category_name"
  }, {
    $lookup: {
      from: "brands",
      localField: "brand_id",
      foreignField: "brand_id",
      as: "brand_name"
    }
  }, {
    $unwind: "$brand_name"
  }, {
    $lookup: {
      from: "tags",
      localField: "tag_id",
      foreignField: "tag_id",
      as: "tag_collection"
    }
  }, {
    $project: {
      _id: 1,
      name: 1,
      description: 1,
      reviews: 1,
      listing: 1,
      brand_id: 1,
      category_id: 1,
      featured: 1,
      category_name: "$category_name.name",
      brand_name: "$brand_name.name",
      tag_id: 1,
      tag_array: {
        $map: {
          input: "$tag_collection",
          as: "tag",
          in: {
            name: "$$tag.name",
            tag_id: "$$tag.tag_id"
          }
        }
      }
    }
  }, {
    $sort: sort
  }];

  //display and sample options
  if (option) {
    //only used in /product/:id route
    try {
      for (var _i = 0, _Object$entries = Object.entries(option); _i < _Object$entries.length; _i++) {
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
          key = _Object$entries$_i[0],
          value = _Object$entries$_i[1];
        switch (key) {
          case 'sample':
            // { sample: value }
            pipeline.push({
              $sample: {
                size: value
              }
            });
            break;
          case 'skip':
            // { skip: [pageNumber, limitPerPage] }
            pipeline.push({
              $facet: {
                results_arr: [{
                  $skip: (value[0] - 1) * value[1]
                }, {
                  $limit: value[1]
                }],
                results_total: [{
                  $count: 'total'
                }]
              }
            });
            pipeline.push({
              $project: {
                results_arr: 1,
                results_total: {
                  $arrayElemAt: ["$results_total.total", 0]
                }
              }
            });
            break;
        }
      }
    } catch (err) {
      return pipeline;
    }
  }
  return pipeline;
}