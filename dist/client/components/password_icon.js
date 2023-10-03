"use strict";

/*### Show password icon*/
var showPasswordCheckbox = Array.from(document.querySelectorAll('[data-password-show]'));
showPasswordCheckbox.forEach(function (checkbox) {
  checkbox.addEventListener('change', function () {
    var data_target = checkbox.dataset.passwordShow;
    var target_input = document.querySelector("[data-password-input=".concat(data_target, "]"));
    var icon_on = document.querySelector("[data-password-icon-on=".concat(data_target, "]"));
    var icon_off = document.querySelector("[data-password-icon-off=".concat(data_target, "]"));
    if (checkbox.checked) {
      target_input.type = 'text';
      icon_on.classList.remove('active');
      icon_off.classList.add('active');
    } else {
      target_input.type = 'password';
      icon_on.classList.add('active');
      icon_off.classList.remove('active');
    }
  });
});