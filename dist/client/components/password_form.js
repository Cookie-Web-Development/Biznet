'use strict';

var _lang = _interopRequireDefault(require("../../lang/lang.json"));
var _moduleHTMLElemMaker = require("../modules/moduleHTMLElemMaker.js");
var _moduleInputCheck = require("../modules/moduleInputCheck.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
/*##########
FORM Handler
############*/
var form = document.querySelector('[data-universal-form]');
var notification_containers = document.querySelectorAll('[data-form-notification]');
var unique_trigger = false;
form.addEventListener('submit', function (event) {
  event.preventDefault();

  //notification reset
  notification_containers.forEach(function (container) {
    Array.from(container.children).forEach(function (child) {
      return child.remove();
    });
  });
  formCheck(form);
});
function formCheck(data) {
  //trigger check
  if (unique_trigger) {
    return;
  }
  unique_trigger = true;

  //curate data
  var form_data = new FormData(data);
  var notifications;

  //current password
  var password_current = form_data.get('password_current');
  var pwCurrent_value = new _moduleInputCheck.INPUT_CHECK(password_current);
  var password_current_noti = [];
  if (pwCurrent_value.checkEmpty()) {
    password_current_noti.push('required_field');
  }
  ;
  if (password_current_noti.length > 0) {
    notifications = notifications || {};
    notifications.password_current = password_current_noti;
  }
  ;

  //password new
  var password_new = form_data.get('password_new');
  var password_new_confirm = form_data.get('password_new_confirm');
  var pwNew_value = new _moduleInputCheck.INPUT_CHECK(password_new);
  var password_new_noti = [],
    password_new_confirm_noti = [];
  if (pwNew_value.checkEmpty()) {
    password_new_noti.push('required_field');
  }
  ;
  if (!pwNew_value.checkLength(6)) {
    password_new_noti.push('password_length');
  }
  ;
  if (!pwNew_value.checkLetter()) {
    password_new_noti.push('password_letter');
  }
  ;
  if (!pwNew_value.checkNum()) {
    password_new_noti.push('password_number');
  }
  ;
  if (pwNew_value.checkSpace()) {
    password_new_noti.push('password_space');
  }
  ;
  if (password_new_noti.length > 0) {
    notifications = notifications || {};
    notifications.password_new = password_new_noti;
  }
  ;
  if (password_new !== password_new_confirm) {
    password_new_confirm_noti.push('confirm_password');
  }
  ;
  if (password_new_confirm_noti.length > 0) {
    notifications = notifications || {};
    notifications.password_new_confirm = password_new_confirm_noti;
  }
  ;
  if (notifications) {
    display_notification(notifications);
    return;
  } else {
    var submit_data = {
      validate: {},
      update: {}
    };
    form_data.forEach(function (value, key) {
      switch (key) {
        case 'password_current':
          submit_data.validate.password = value;
          break;
        case 'token':
          submit_data.validate._csrf = value;
          break;
        case 'password_new':
          submit_data.update.password = value;
          break;
        case 'password_new_confirm':
          break;
        default:
          throw new Error('Submit Error');
      }
    });

    //send To API
    var endpoint = form.getAttribute('action');
    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(submit_data)
    }).then(function (response) {
      window.location.href = response.url;
    })["catch"](function (err) {});
  }
}
function display_notification(notification_object) {
  unique_trigger = false;
  var _loop = function _loop() {
    var target_container = document.querySelector("[data-form-notification=".concat(type, "]"));
    notification_object[type].forEach(function (notification) {
      var noti_html = new _moduleHTMLElemMaker.HTML_ELEM('p');
      noti_html.addText(_lang["default"].error[notification][lang]);
      noti_html.addClass('error_notification');
      target_container.appendChild(noti_html.getElement());
    });
  };
  for (var type in notification_object) {
    _loop();
  }
}