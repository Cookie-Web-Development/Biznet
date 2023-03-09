/*#######
LOGIN MODAL
#########*/
let loginModalBtn = document.getElementById('login-modal-btn');
let loginModal = document.getElementById('login-modal');
let loginModalClose = loginModal.querySelector('#login-modal-close');

loginModalBtn.addEventListener('click', () => {
    loginModal.showModal(); 
})

loginModalClose.addEventListener('click', () => {
    loginModal.close();    
})

/*### Show password icon*/
let passwordInput = loginModal.querySelector('#password');
let showPasswordCheckbox = loginModal.querySelector('#show-password-checkbox');
let showPasswordIconOff = document.querySelector('#show-password-off');
let showPasswordIconOn = document.querySelector('#show-password-on');

showPasswordCheckbox.addEventListener('change', () => {
    if(showPasswordCheckbox.checked) {{
        passwordInput.type = 'text';
        showPasswordIconOff.classList.remove('active');
        showPasswordIconOn.classList.add('active');
    }} else {
        passwordInput.type = 'password';
        showPasswordIconOff.classList.add('active');
        showPasswordIconOn.classList.remove('active');
    }
})