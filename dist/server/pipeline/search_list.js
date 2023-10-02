"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.search_list = void 0;
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var search_list = {
  multi_lang: function multi_lang(lang) {
    var sort_lang = "name.".concat(lang);
    return [{
      $project: {
        _id: 0,
        __v: 0
      }
    }, {
      $sort: _defineProperty({}, sort_lang, 1)
    }];
  },
  brand: [{
    $project: {
      _id: 0,
      __v: 0
    }
  }],
  price_range: [{
    $project: {
      _id: 0,
      price_list: {
        $map: {
          input: "$listing",
          as: "entry",
          "in": {
            $round: [{
              $subtract: ["$$entry.price", {
                $multiply: ["$$entry.price", "$$entry.discount_percent"]
              }]
            }, 0]
          }
        }
      }
    }
  }, {
    $unwind: "$price_list"
  }, {
    $group: {
      _id: null,
      price_list: {
        $push: "$price_list"
      }
    }
  }, {
    $project: {
      _id: 0,
      max: {
        $add: [{
          $max: "$price_list"
        }, 1]
      },
      min: {
        $subtract: [{
          $min: "$price_list"
        }, 1]
      }
    }
  }]
};

/*
    price_range: [
        { $project: {
            price_discounted: { $subtract: [ '$price', { $multiply: [ '$price', '$discount_percent' ]}]}
        }},
        { $group: {
            _id: null,
            min: { $min: "$price_discounted" },
            max: { $max: "$price_discounted" }
        }},
        { $project: {
            _id: 0,
            min: { $floor: "$min" },
            max: { $ceil: "$max" }
        }}
    ]

*/
exports.search_list = search_list;