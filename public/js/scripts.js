"use strict";

/*#######
LOGIN MODAL
#########*/
let loginModalBtn = document.getElementById('login_modal_btn');
let loginModal = document.getElementById('login_modal');
let loginModalClose = loginModal.querySelectorAll('.login_modal_close');

loginModalBtn.addEventListener('click', () => {
    loginModal.showModal();
})

loginModalClose.forEach(btn => {
    btn.addEventListener('click', () => {
        loginModal.close();
    })

})

/*### Show password icon*/
let passwordInput = loginModal.querySelector('#password');
let showPasswordCheckbox = loginModal.querySelector('#show_password_checkbox');
let showPasswordIconOff = document.querySelector('#show_password_off');
let showPasswordIconOn = document.querySelector('#show_password_on');

showPasswordCheckbox.addEventListener('change', () => {
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
})

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