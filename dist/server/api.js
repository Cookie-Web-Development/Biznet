'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
require("core-js/modules/es.symbol.js");
require("core-js/modules/es.symbol.description.js");
require("core-js/modules/es.symbol.iterator.js");
require("core-js/modules/es.array.iterator.js");
require("core-js/modules/es.string.iterator.js");
require("core-js/modules/web.dom-collections.iterator.js");
require("core-js/modules/es.symbol.async-iterator.js");
require("core-js/modules/es.symbol.to-string-tag.js");
require("core-js/modules/es.json.to-string-tag.js");
require("core-js/modules/es.math.to-string-tag.js");
require("core-js/modules/es.object.get-prototype-of.js");
require("core-js/modules/es.function.name.js");
require("core-js/modules/es.object.set-prototype-of.js");
require("core-js/modules/es.array.slice.js");
require("core-js/modules/es.symbol.to-primitive.js");
require("core-js/modules/es.date.to-primitive.js");
require("core-js/modules/es.number.constructor.js");
require("core-js/modules/es.object.keys.js");
require("core-js/modules/es.array.filter.js");
require("core-js/modules/es.object.get-own-property-descriptor.js");
require("core-js/modules/es.object.get-own-property-descriptors.js");
require("core-js/modules/es.array.from.js");
require("core-js/modules/es.regexp.to-string.js");
require("core-js/modules/es.regexp.exec.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("core-js/modules/es.object.to-string.js");
require("core-js/modules/web.dom-collections.for-each.js");
require("core-js/modules/es.promise.js");
var _mongoose = _interopRequireDefault(require("mongoose"));
var _lang2 = _interopRequireDefault(require("../../src/server/lang/lang.json"));
var _products_schema = require("./schema/products_schema.js");
var _brands_schema = require("./schema/brands_schema.js");
var _categories_schema = require("./schema/categories_schema.js");
var _reviews_schema = require("./schema/reviews_schema.js");
var _tags_schema = require("./schema/tags_schema.js");
var _users_schema = require("./schema/users_schema.js");
var _search_list = require("./pipeline/search_list.js");
var _search_query = _interopRequireDefault(require("./pipeline/search_query.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
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
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, catch: function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; } //import { product_variations_schema } from './schema/product_variations_schema.js';
//import { discount_pipeline } from './pipeline/discount.js'; //FLAGGED FOR DELETION!
//import { featured_pipeline } from './pipeline/featured.js'; //FLAGGED FOR DELETION!
//import crypto from 'crypto';

//const key = crypto.randomBytes(32).toString('hex');
//console.log(key);
//import product_variation from '../../../devTool/product_object';
/*DEV MODE END*/
var apiRoute = function apiRoute(app) {
  _mongoose.default.set('strictQuery', true);

  /*Mongoose Connections*/
  var connectionSettings = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  };
  var productsDB = _mongoose.default.createConnection(process.env.URI_PRODUCTS, connectionSettings);
  var usersDB = _mongoose.default.createConnection(process.env.URI_USERS, connectionSettings);

  /*pre-hooks for schemas: used to assign customs_ids before saving*/

  //brand
  _brands_schema.brands_schema.statics.createBrand = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(data) {
      var last_entry, indexTracker, i;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return this.findOne({}, {
              _id: 0,
              brand_id: 1
            }, {
              sort: {
                brand_id: -1
              }
            });
          case 2:
            _context.t0 = _context.sent;
            if (_context.t0) {
              _context.next = 5;
              break;
            }
            _context.t0 = {
              brand_id: 0
            };
          case 5:
            last_entry = _context.t0;
            indexTracker = 0; // one of the obj in the array contains brand_id
            for (i = 0; i < data.length; i++) {
              if (!data[i].hasOwnProperty('brand_id')) {
                data[i].brand_id = last_entry.brand_id + indexTracker + 1;
                indexTracker++;
              }
            }
            return _context.abrupt("return", this.create(data));
          case 9:
          case "end":
            return _context.stop();
        }
      }, _callee, this);
    }));
    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }();
  //category
  _categories_schema.categories_schema.statics.createCategory = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(data) {
      var last_entry, indexTracker, i;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return this.findOne({}, {
              _id: 0,
              category_id: 1
            }, {
              sort: {
                category_id: -1
              }
            });
          case 2:
            _context2.t0 = _context2.sent;
            if (_context2.t0) {
              _context2.next = 5;
              break;
            }
            _context2.t0 = {
              category_id: 0
            };
          case 5:
            last_entry = _context2.t0;
            indexTracker = 0;
            for (i = 0; i < data.length; i++) {
              if (!data[i].hasOwnProperty('category_id')) {
                data[i].category_id = last_entry.category_id + indexTracker + 1;
                indexTracker++;
              }
            }
            return _context2.abrupt("return", this.create(data));
          case 9:
          case "end":
            return _context2.stop();
        }
      }, _callee2, this);
    }));
    return function (_x2) {
      return _ref2.apply(this, arguments);
    };
  }();

  //tags
  _tags_schema.tags_schema.statics.createTag = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(data) {
      var last_entry, indexTracker, i;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return this.findOne({}, {
              _id: 0,
              tag_id: 1
            }, {
              sort: {
                tag_id: -1
              }
            });
          case 2:
            _context3.t0 = _context3.sent;
            if (_context3.t0) {
              _context3.next = 5;
              break;
            }
            _context3.t0 = {
              tag_id: 0
            };
          case 5:
            last_entry = _context3.t0;
            indexTracker = 0;
            for (i = 0; i < data.length; i++) {
              if (!data[i].hasOwnProperty('tag_id')) {
                data[i].tag_id = last_entry.tag_id + indexTracker + 1;
                indexTracker++;
              }
            }
            return _context3.abrupt("return", this.create(data));
          case 9:
          case "end":
            return _context3.stop();
        }
      }, _callee3, this);
    }));
    return function (_x3) {
      return _ref3.apply(this, arguments);
    };
  }();

  /*Models*/
  var Products = productsDB.model('products', _products_schema.products_schema),
    //Product_Variations = productsDB.model('variations', product_variations_schema),
    Brands = productsDB.model('brands', _brands_schema.brands_schema),
    Categories = productsDB.model('categories', _categories_schema.categories_schema),
    Reviews = productsDB.model('reviews', _reviews_schema.reviews_schema),
    Tags = productsDB.model('tags', _tags_schema.tags_schema);
  var Users = usersDB.model('users', _users_schema.users_schema);

  //format currency in USD with two decimal places
  var formatOptions = {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  };
  function priceFormatter(product) {
    product.forEach(function (item) {
      item.listing.forEach(function (entry) {
        entry.format_price = entry.price.toLocaleString('en-US', formatOptions);
        entry.format_price_discounted = entry.price_discounted.toLocaleString('en-US', formatOptions);
      });
    });
  }
  app.route(['/', '/home']).get( /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res) {
      var lang, discount_list, featured_list;
      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            //session lang is req.session.lang
            lang = req.session.lang || "es";
            _context4.next = 3;
            return Products.aggregate((0, _search_query.default)({
              discount: "true"
            }));
          case 3:
            discount_list = _context4.sent;
            _context4.next = 6;
            return Products.aggregate((0, _search_query.default)({
              featured: "true"
            }, {
              sample: 8
            }));
          case 6:
            featured_list = _context4.sent;
            priceFormatter(discount_list);
            priceFormatter(featured_list);
            res.render('home', {
              discount_list: discount_list,
              featured_list: featured_list,
              lang: lang,
              langData: _lang2.default
            });
          case 10:
          case "end":
            return _context4.stop();
        }
      }, _callee4);
    }));
    return function (_x4, _x5) {
      return _ref4.apply(this, arguments);
    };
  }());
  app.route('/catalog').get( /*#__PURE__*/function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(req, res) {
      var quick_query, lang, tags, categories, brands, price_range, search_fields;
      return _regeneratorRuntime().wrap(function _callee5$(_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            //if there is a URL param for quiick search, include iit in the reender section...
            quick_query = undefined;
            if (req.query) {
              quick_query = _objectSpread({}, req.query);
            }
            ;
            //URL PARAM /catalog?key=value <- ESTTO NO DEBE DE GUARDARSEE EN EEL SEARCH SESSION@!
            lang = req.session.lang || 'es';
            _context5.next = 6;
            return Tags.aggregate(_search_list.search_list.multi_lang(lang));
          case 6:
            tags = _context5.sent;
            _context5.next = 9;
            return Categories.aggregate(_search_list.search_list.multi_lang(lang));
          case 9:
            categories = _context5.sent;
            _context5.next = 12;
            return Brands.aggregate(_search_list.search_list.brand);
          case 12:
            brands = _context5.sent;
            _context5.next = 15;
            return Products.aggregate(_search_list.search_list.price_range);
          case 15:
            price_range = _context5.sent;
            // price_range returns [{max, min}]
            search_fields = {
              tags: _toConsumableArray(tags),
              categories: _toConsumableArray(categories),
              brands: _toConsumableArray(brands),
              price_range: price_range[0]
            };
            res.render('catalog', {
              search_fields: search_fields,
              lang: lang,
              langData: _lang2.default,
              quick_query: quick_query
            });
            //res.json(search_fields)
          case 18:
          case "end":
            return _context5.stop();
        }
      }, _callee5);
    }));
    return function (_x6, _x7) {
      return _ref5.apply(this, arguments);
    };
  }()).post( /*#__PURE__*/function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(req, res) {
      var active_page, items_per_page, results;
      return _regeneratorRuntime().wrap(function _callee6$(_context6) {
        while (1) switch (_context6.prev = _context6.next) {
          case 0:
            active_page = +req.body.active_page || 1;
            items_per_page = +req.body.items_per_page || 12;
            _context6.next = 4;
            return Products.aggregate((0, _search_query.default)(req.body, {
              skip: [active_page, items_per_page]
            }));
          case 4:
            results = _context6.sent;
            /*When used with pagination!!!
            paginasion tiene que oocurrir aqui!!!
            let active_page
                search_query(req.body, { skip: [page_number, limit_per_page] }),
                returns results = [ 
                    { results_arr: [{...}, {...}, ...], 
                    { results_total: total }
                }]
            */
            priceFormatter(results[0].results_arr);
            res.json({
              api_results: results
            });
          case 7:
          case "end":
            return _context6.stop();
        }
      }, _callee6);
    }));
    return function (_x8, _x9) {
      return _ref6.apply(this, arguments);
    };
  }());
  app.route('/product/:id').get( /*#__PURE__*/function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(req, res) {
      var lang, product_id, result, similar, _lang;
      return _regeneratorRuntime().wrap(function _callee7$(_context7) {
        while (1) switch (_context7.prev = _context7.next) {
          case 0:
            _context7.prev = 0;
            lang = req.session.lang || 'es';
            product_id = req.params.id;
            _context7.next = 5;
            return Products.aggregate((0, _search_query.default)({
              id: product_id
            }));
          case 5:
            result = _context7.sent;
            _context7.next = 8;
            return Products.aggregate((0, _search_query.default)({
              more_brand: [product_id, result[0].brand_id]
            }, {
              sample: 8
            }));
          case 8:
            _context7.t0 = _context7.sent;
            _context7.next = 11;
            return Products.aggregate((0, _search_query.default)({
              more_similar: [product_id, result[0].brand_id, result[0].category_id, _toConsumableArray(result[0].tag_id)]
            }, {
              sample: 8
            }));
          case 11:
            _context7.t1 = _context7.sent;
            similar = {
              by_brand: _context7.t0,
              by_other: _context7.t1
            };
            priceFormatter(result);
            if (similar.by_brand.length >= 1) {
              priceFormatter(similar.by_brand);
            }
            if (similar.by_other.length >= 1) {
              priceFormatter(similar.by_other);
            }
            if (!(similar.by_brand.length == 0 || similar.by_other.length == 0)) {
              _context7.next = 21;
              break;
            }
            _context7.next = 19;
            return Products.aggregate((0, _search_query.default)({
              more_product: product_id
            }, {
              sample: 10
            }));
          case 19:
            similar.more_products = _context7.sent;
            priceFormatter(similar.more_products);
          case 21:
            res.render('product', {
              api_results: result[0],
              similar: similar,
              lang: lang,
              langData: _lang2.default
            });
            //res.json({similar: {by_brand: more_brand, by_other: more_similar}})
            _context7.next = 29;
            break;
          case 24:
            _context7.prev = 24;
            _context7.t2 = _context7["catch"](0);
            _lang = req.session.lang || 'es';
            console.log(_context7.t2);
            res.render('product', {
              api_results: null,
              lang: _lang,
              langData: _lang2.default
            });
          case 29:
          case "end":
            return _context7.stop();
        }
      }, _callee7, null, [[0, 24]]);
    }));
    return function (_x10, _x11) {
      return _ref7.apply(this, arguments);
    };
  }());
  app.route('/lang_change').get(function (req, res) {
    if (req.session.lang == 'en') {
      req.session.lang = 'es';
    } else {
      req.session.lang = 'en';
    }
    var referer = req.headers.referer || '/';
    res.redirect(referer);
  });

  /*############
  DEV ROUTES
  #############*/
  /*
      app.route('/test').get(async (req, res) => {
          let lang = req.session.lang || 'es';
          let tags = await Tags.aggregate(search_list.multi_lang(lang)),
              categories = await Categories.aggregate(search_list.multi_lang(lang)),
              brands = await Brands.aggregate(search_list.brand),
              price_range = await Products.aggregate(search_list.price_range);
          // price_range returns [{max, min}]
  
          let search_fields = {
              tags: [...tags],
              categories: [...categories],
              brands: [...brands],
              price_range: price_range[0]
          }
          res.send(search_fields)
      });
  
      app.route('/test_db').get(async (req, res) => {
          let db = await Products.aggregate([{ $match: {} }, {$project: {listing: 1}}, {$sort: { "listing.price": -1} }])
          res.json(db)
      });
  
      app.route('/test_product').get(async (req, res) => {
          //let products = await Products.aggregate([{ $match: {} }])
          //res.json(products)
          let count_test = await Products.aggregate(search_query({ category: 9}, { skip: [1, 3]}));
          priceFormatter(count_test[0].results_arr)
          res.json(count_test)
      })*/
};
var _default = apiRoute;
exports.default = _default;