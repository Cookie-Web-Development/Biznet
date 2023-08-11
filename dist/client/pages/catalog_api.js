'use strict';

require("core-js/modules/es.array.slice.js");
require("core-js/modules/es.regexp.to-string.js");
require("core-js/modules/es.function.name.js");
require("core-js/modules/es.regexp.exec.js");
require("core-js/modules/es.symbol.js");
require("core-js/modules/es.symbol.description.js");
require("core-js/modules/es.symbol.iterator.js");
require("core-js/modules/es.object.keys.js");
require("core-js/modules/es.array.from.js");
require("core-js/modules/es.string.iterator.js");
require("core-js/modules/es.object.to-string.js");
require("core-js/modules/web.dom-collections.for-each.js");
require("core-js/modules/es.array.iterator.js");
require("core-js/modules/web.dom-collections.iterator.js");
require("core-js/modules/es.array.find-index.js");
var _moduleDisplayResults = require("../modules/moduleDisplayResults.js");
var _moduleDisplayPagination = require("../modules/moduleDisplayPagination.js");
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
//Session_variables: this is to save current session values such as language, search values, pagination page, etc

var save_session = true; //save_session es para evitar guardar quick_querry en search_session storage

//Checks if applying either quick_query or search_session
if (Object.keys(quick_query).length >= 1) {
  search_query = quick_query;
  save_session = false;
  if (JSON.parse(sessionStorage.getItem('search_session')).sort_option) {
    search_query.sort_option = JSON.parse(sessionStorage.getItem('search_session')).sort_option;
  }
  ;
  if (search_query.selected_tags) {
    search_query.selected_tags = [search_query.selected_tags];
  }
} else {
  search_query = JSON.parse(sessionStorage.getItem('search_session')) || {};
}
;

//search_fields information populate
var _loop = function _loop(key) {
  if (search_query.hasOwnProperty(key)) {
    switch (key) {
      case 'name':
        document.querySelector("input[name='".concat(key, "']")).value = search_query[key];
        break;
      case 'sort_option':
      case 'category':
      case 'brand':
        var selectElem = document.querySelector("select[name='".concat(key, "']"));
        var selectionIndex = Array.from(selectElem.options).findIndex(function (option) {
          return option.value === search_query[key];
        });
        selectElem.selectedIndex = selectionIndex;
        break;
      case 'discount':
      case 'featured':
        document.querySelector("input[name='".concat(key, "']")).checked = search_query[[key]];
        break;
    }
  }
};
for (var key in search_query) {
  _loop(key);
}
;

//### API ENDPOINT ##
var search_form = document.getElementById('catalog_search_form');
var input_fields = Array.from(search_form.querySelectorAll('input[name], select'));
var product_results_container = document.getElementById('product_result');
var pagination_container = document.getElementById('pagination');
var debounce_delay = 500; //ms
var eventAPI = 'sendToAPI'; //Custom event for API Endpoint
var eventDispatcherCheck = false; //helps debounce when events are fired multiple times
var resultAutoScroll = false; //triggers autoscroll when using pagination
var active_page;
var items_per_page = 12; //Goes hand-in-hand with CSS filter-and-results.css #product_result grid-tempalet. Must change according to window width.

input_fields.forEach(function (input) {
  input.addEventListener(eventAPI, debounce(sendToServer, debounce_delay));
  input.addEventListener('input', function () {
    if (eventDispatcherCheck) {
      return;
    }
    eventDispatcherCheck = true;
    input.dispatchEvent(new Event(eventAPI));
  });
});
pagination_container.addEventListener('click', function (event) {
  if (event.target.matches('.button_pagination')) {
    if (!active_page) {
      return;
    }
    ;
    switch (event.target.dataset.pageValue) {
      case "prev":
        if (active_page <= 1) {
          return;
        }
        active_page--;
        break;
      case "next":
        active_page++;
        break;
      default:
        active_page = +event.target.dataset.pageValue;
    }
    debounce(sendToServer(active_page), debounce_delay);
    resultAutoScroll = true;
  }
});
document.addEventListener("DOMContentLoaded", debounce(sendToServer, debounce_delay));

//functions declarations below;
function sendToServer() {
  var set_active_page = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
  var formData = new FormData(search_form);
  var data = {};
  var _iterator = _createForOfIteratorHelper(formData.entries()),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var _step$value = _slicedToArray(_step.value, 2),
        _key = _step$value[0],
        value = _step$value[1];
      switch (_key) {
        case 'price_range_min':
          value != search_fields.price_range.min ? data[_key] = value : undefined;
          break;
        case 'price_range_max':
          value != search_fields.price_range.max ? data[_key] = value : undefined;
          break;
        case 'selected_tags':
          data[_key] ? data[_key].push(value) : data[_key] = [value];
          break;
        default:
          value != "" ? data[_key] = value : undefined;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  ;
  data.items_per_page = items_per_page;
  if (typeof set_active_page == 'number') {
    active_page = set_active_page;
    data.active_page = set_active_page;
  } else {
    active_page = 1;
  }
  ;
  apiCall(data);
}
;
function apiCall(data) {
  var xhr = new XMLHttpRequest();
  var endpoint = '/catalog';
  xhr.open("POST", endpoint);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.onload = function () {
    if (xhr.status === 200) {
      //Diferenciar entre quick_querie y search_query
      if (save_session) {
        sessionStorage.removeItem('search_session');
        sessionStorage.setItem('search_session', JSON.stringify(data));
      } else {
        save_session = true;
      }
      var response = JSON.parse(xhr.responseText);
      var pagination_pages = Math.ceil(response.api_results[0].results_total / items_per_page) || 1;
      (0, _moduleDisplayResults.display_results)(response.api_results[0].results_arr, lang, product_results_container);
      (0, _moduleDisplayPagination.display_pagination)(active_page, pagination_pages, pagination_container);

      //auto scrolling trigger
      if (resultAutoScroll) {
        product_results_container.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        resultAutoScroll = false; //back to default
      }
    } else {
      console.error(xhr.statusText);
    }
  };
  xhr.onerror = function () {
    console.error(xhr.statusText);
  };
  xhr.send(JSON.stringify(data));
}
;
function debounce(func, delay) {
  var timeout;
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key2 = 0; _key2 < _len; _key2++) {
      args[_key2] = arguments[_key2];
    }
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      func.apply(void 0, args);
      eventDispatcherCheck = false; //reverts the checker after debounce does its thing
    }, delay);
  };
}
;