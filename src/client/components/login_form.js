/*### Show password icon*/
let passwordInput = document.querySelector('#password');
let showPasswordCheckbox = document.querySelector('#show_password_checkbox');
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