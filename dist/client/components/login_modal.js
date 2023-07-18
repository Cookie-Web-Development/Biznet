"use strict";

/*#######
LOGIN MODAL
#########*/
require("core-js/modules/es.object.to-string.js");
require("core-js/modules/web.dom-collections.for-each.js");
require("core-js/modules/es.array.from.js");
require("core-js/modules/es.string.iterator.js");
var loginModalBtn = document.getElementById('login_modal_btn');
var loginModal = document.getElementById('login_modal');
var loginModalClose = loginModal.querySelectorAll('.login_modal_close');
loginModalBtn.addEventListener('click', function () {
  loginModal.showModal();
});
loginModalClose.forEach(function (btn) {
  btn.addEventListener('click', function () {
    loginModal.close();
  });
});

/*### Show password icon*/
var passwordInput = loginModal.querySelector('#password');
var showPasswordCheckbox = loginModal.querySelector('#show_password_checkbox');
var showPasswordIconOff = document.querySelector('#show_password_off');
var showPasswordIconOn = document.querySelector('#show_password_on');
showPasswordCheckbox.addEventListener('change', function () {
  if (showPasswordCheckbox.checked) {
    {
      passwordInput.type = 'text';
      showPasswordIconOff.classList.remove('active');
      showPasswordIconOn.classList.add('active');
    }
  } else {
    passwordInput.type = 'password';
    showPasswordIconOff.classList.add('active');
    showPasswordIconOn.classList.remove('active');
  }
});

// FROM CHATGPT: Add click event listener to document
document.addEventListener('click', function (event) {
  // Check if the target element of the click event is outside the modal
  if (!loginModal.contains(event.target)) {
    // If the modal is open, prevent the default click behavior
    if (loginModal.classList.contains('open')) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
});

/*DEV ONLY*/
//DISABLES BUTTONS
var btn_disabled = Array.from(document.querySelectorAll('button.disabled', 'select.disabled'));
btn_disabled.forEach(function (btn) {
  btn.setAttribute('type', 'button');
});

//DISABLES FORMS
var form_disabled = Array.from(document.querySelectorAll('form.disabled'));
form_disabled.forEach(function (form) {
  form.addEventListener('submit', function (event) {
    event.preventDefault();
  });
});