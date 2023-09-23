/*### Show password icon*/
let showPasswordCheckbox = Array.from(document.querySelectorAll('[data-password-show]'));

showPasswordCheckbox.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        let data_target = checkbox.dataset.passwordShow
        let target_input = document.querySelector(`[data-password-input=${data_target}]`);
        let icon_on = document.querySelector(`[data-password-icon-on=${data_target}]`);
        let icon_off = document.querySelector(`[data-password-icon-off=${data_target}]`);
        if (checkbox.checked) {
            target_input.type = 'text';
            icon_on.classList.remove('active');
            icon_off.classList.add('active');
        } else {
            target_input.type = 'password';
            icon_on.classList.add('active');
            icon_off.classList.remove('active');
        }
    })
})