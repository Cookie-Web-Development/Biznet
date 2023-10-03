'use strict';

var _lang = _interopRequireDefault(require("../../lang/lang.json"));
var _moduleHTMLElemMaker = require("../modules/moduleHTMLElemMaker.js");
var _moduleInputCheck = require("../modules/moduleInputCheck.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
/*Input requirements function*/
var username_input = document.querySelector('input[name="username"]');
var password_input = document.querySelector('input[name="password"]');
var class_green = ['green', 'fa-circle-check'],
  class_red = ['red', 'fa-circle-xmark'];
username_input.addEventListener('input', function () {
  var input = new _moduleInputCheck.INPUT_CHECK(username_input.value);
  var targets = Array.from(document.querySelectorAll('[data-username-requirement]'));
  targets.forEach(function (elem) {
    elem.classList.remove('red', 'green');
    elem.querySelector('i').classList.remove('fa-circle-check', 'fa-circle-xmark');
    if (!input.checkEmpty()) {
      switch (elem.dataset.usernameRequirement) {
        case 'length':
          if (input.checkLength(4)) {
            checklist_update(elem, class_green);
          } else {
            checklist_update(elem, class_red);
          }
          break;
        case 'spaces':
          if (!input.checkSpace()) {
            checklist_update(elem, class_green);
          } else {
            checklist_update(elem, class_red);
          }
          ;
          break;
        case 'special':
          if (!input.checkSpecial()) {
            checklist_update(elem, class_green);
          } else {
            checklist_update(elem, class_red);
          }
          break;
      }
    }
  });
});
password_input.addEventListener('input', function () {
  var input = new _moduleInputCheck.INPUT_CHECK(password_input.value);
  var targets = Array.from(document.querySelectorAll('[data-password-requirement]'));
  targets.forEach(function (elem) {
    elem.classList.remove('red', 'green');
    elem.querySelector('i').classList.remove('fa-circle-check', 'fa-circle-xmark');
    if (!input.checkEmpty()) {
      switch (elem.dataset.passwordRequirement) {
        case 'length':
          if (input.checkLength(6)) {
            checklist_update(elem, class_green);
          } else {
            checklist_update(elem, class_red);
          }
          break;
        case 'spaces':
          if (!input.checkSpace()) {
            checklist_update(elem, class_green);
          } else {
            checklist_update(elem, class_red);
          }
          ;
          break;
        case 'letter':
          if (input.checkLetter()) {
            checklist_update(elem, class_green);
          } else {
            checklist_update(elem, class_red);
          }
          break;
        case 'number':
          if (input.checkNum()) {
            checklist_update(elem, class_green);
          } else {
            checklist_update(elem, class_red);
          }
          break;
      }
    }
  });
});
function checklist_update(elem, _ref) {
  var _ref2 = _slicedToArray(_ref, 2),
    color_class = _ref2[0],
    i_class = _ref2[1];
  elem.classList.add(color_class);
  elem.querySelector('i').classList.add(i_class);
}

/*Registration notification messages*/
var signUp_form = document.querySelector('[data-registration-form]');
var notification_container = document.querySelectorAll('[data-registration-notification]');
signUp_form.addEventListener('submit', function (event) {
  event.preventDefault();
  formCheck();
});
function formCheck() {
  //reset notification
  var notifications;
  var formData = new FormData(signUp_form);

  //check username
  var username_input = formData.get('username');
  var username_value = new _moduleInputCheck.INPUT_CHECK(username_input);
  var username_notification = [];
  if (username_value.checkEmpty()) {
    username_notification.push('required_field');
  }
  if (!username_value.checkLength(4)) {
    username_notification.push('username_length');
  }
  if (username_value.checkSpace()) {
    username_notification.push('username_space');
  }
  if (username_value.checkSpecial()) {
    username_notification.push('username_special');
  }
  if (username_notification.length > 0) {
    notifications = notifications || {};
    notifications.username = username_notification;
  }

  //check password
  var password_input = formData.get('password');
  var password_value = new _moduleInputCheck.INPUT_CHECK(password_input);
  var password_notification = [];
  if (password_value.checkEmpty()) {
    password_notification.push('required_field');
  }
  ;
  if (!password_value.checkLength(6)) {
    password_notification.push('password_length');
  }
  ;
  if (!password_value.checkLetter()) {
    password_notification.push('password_letter');
  }
  ;
  if (!password_value.checkNum()) {
    password_notification.push('password_number');
  }
  ;
  if (password_value.checkSpace()) {
    password_notification.push('password_space');
  }
  ;
  if (password_notification.length > 0) {
    notifications = notifications || {};
    notifications.password = password_notification;
  }

  //check confirm password
  var confirm_password_input = formData.get('confirm_password');
  var password_confirm_notification = [];
  if (!confirm_password_input || confirm_password_input.trim() === '') {
    password_confirm_notification.push('required_field');
  }
  if (password_input !== confirm_password_input) {
    password_confirm_notification.push('confirm_password');
  }
  if (password_confirm_notification.length > 0) {
    notifications = notifications || {};
    notifications.confirm_password = password_confirm_notification;
  }
  if (notifications) {
    displayNotification(notifications);
    return;
  }
  signUp_form.submit();
}
function displayNotification(obj) {
  var containers = Array.from(notification_container);

  //notification reset
  containers.forEach(function (container) {
    var child = Array.from(container.children);
    if (child.length > 0) {
      child.forEach(function (elem) {
        return elem.remove();
      });
    }
  });
  var _loop = function _loop() {
    var target = document.querySelector("[data-registration-notification=".concat(section, "]"));
    obj[section].forEach(function (notification) {
      var noti_html = new _moduleHTMLElemMaker.HTML_ELEM('p');
      noti_html.addText(_lang["default"].error[notification][lang]);
      noti_html.addClass('error_notification');
      target.appendChild(noti_html.getElement());
    });
  };
  for (var section in obj) {
    _loop();
  }
}