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
let btn_disabled = Array.from(document.querySelectorAll('button.disabled', 'select.disabled'));

btn_disabled.forEach(btn => {
    btn.setAttribute('type', 'button')

})

//DISABLES FORMS
let form_disabled = Array.from(document.querySelectorAll('form.disabled'));

form_disabled.forEach(form => {
    form.addEventListener('submit', (event) => {
        event.preventDefault()
    })
})