"use strict";

/*#######
LOGIN MODAL
#########*/
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