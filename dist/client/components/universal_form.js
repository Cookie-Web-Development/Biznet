'use strict';

var _lang = _interopRequireDefault(require("../../lang/lang.json"));
var _moduleHTMLElemMaker = require("../modules/moduleHTMLElemMaker.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
/*###################
Defaul <select> option
#####################*/
var select_elem = Array.from(document.querySelectorAll('[data-form-select]')) || [];
select_elem.forEach(function (elem) {
  var option = Array.from(elem.children) || [];
  option.forEach(function (child) {
    if (child.value === elem.dataset.defaultValue) {
      child.selected = true;
    }
  });
});

/*##########
FORM Handler
############*/
var form = document.querySelector('[data-universal-form]');
var form_container = document.querySelector('[data-universal-notification]');
var unique_trigger = false;
form.addEventListener('submit', function (event) {
  event.preventDefault();

  //notification reset
  Array.from(form_container.children).forEach(function (child) {
    return child.remove();
  });
  formCheck();
});
function formCheck() {
  //trigger check
  if (unique_trigger) {
    return;
  }
  unique_trigger = true;
  var form_data = new FormData(form);
  var submit_data = {
    target: {},
    validate: {},
    update: {}
  };

  //curate data
  form_data.forEach(function (value, key) {
    var default_val = document.querySelector("[name=".concat(key, "]")).dataset.defaultValue;
    if (key === 'target') {
      submit_data.target._id = value;
    }
    if (key === 'token') {
      submit_data.validate._csrf = value;
    }
    if (key !== 'token' && value !== default_val && value !== '') {
      switch (key) {
        case 'prefered_language':
          submit_data.update['user_preferences.lang'] = value;
          break;
        default:
          submit_data.update[key] = value;
      }
    }
  });
  if (Object.keys(submit_data.update).length < 1) {
    var notification_error = {
      error: 'no_change'
    };
    display_notification(notification_error);
    return;
  } else {
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
  for (var type in notification_object) {
    var noti_text = new _moduleHTMLElemMaker.HTML_ELEM('p');
    noti_text.addText(_lang["default"][type][notification_object[type]][lang]);
    switch (type) {
      case 'notification':
        noti_text.addClass('green');
        break;
      case 'error':
        noti_text.addClass('red');
        break;
      default:
        return;
    }
    form_container.appendChild(noti_text.getElement());
  }
}