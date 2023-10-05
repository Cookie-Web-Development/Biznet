'use strict';

import langData from '../../lang/lang.json'assert { type: "json" };
import { HTML_ELEM } from '../modules/moduleHTMLElemMaker.js';
import { INPUT_CHECK } from '../modules/moduleInputCheck.js';

/*Input requirements function*/
let username_input = document.querySelector('input[name="username"]');
let password_input = document.querySelector('input[name="password"]');
let class_green = ['green', 'fa-circle-check'],
    class_red = ['red', 'fa-circle-xmark'];

username_input.addEventListener('input', () => {
    let input = new INPUT_CHECK(username_input.value);
    let targets = Array.from(document.querySelectorAll('[data-username-requirement]'));

    targets.forEach(elem => {
        elem.classList.remove('red', 'green')
        elem.querySelector('i').classList.remove('fa-circle-check', 'fa-circle-xmark');

        if(!input.checkEmpty()) {
            switch (elem.dataset.usernameRequirement) {
                case 'length':
                    if (input.checkLength(4)) {
                        checklist_update(elem, class_green);
                    } else { checklist_update(elem, class_red) }
                    break;
                case 'spaces':
                    if (!input.checkSpace()) {
                        checklist_update(elem, class_green);
                    } else { checklist_update(elem, class_red) };
                    break;
                case 'special':
                    if(!input.checkSpecial()) {
                        checklist_update(elem, class_green);
                    } else { checklist_update(elem, class_red )}
                    break;
            }
        }
    })
})

password_input.addEventListener('input', () => {
    let input = new INPUT_CHECK(password_input.value);
    let targets = Array.from(document.querySelectorAll('[data-password-requirement]'));

    targets.forEach(elem => {
        elem.classList.remove('red', 'green')
        elem.querySelector('i').classList.remove('fa-circle-check', 'fa-circle-xmark');

        if (!input.checkEmpty()) {
            switch (elem.dataset.passwordRequirement) {
                case 'length':
                    if (input.checkLength(6)) {
                        checklist_update(elem, class_green);
                    } else { checklist_update(elem, class_red) }
                    break;
                case 'spaces':
                    if (!input.checkSpace()) {
                        checklist_update(elem, class_green);
                    }else { checklist_update(elem, class_red) };
                    break;
                case 'letter':
                    if(input.checkLetter()) {
                        checklist_update(elem, class_green);
                    } else { checklist_update(elem, class_red) }
                    break;
                case 'number':
                    if(input.checkNum()) {
                        checklist_update(elem, class_green);
                    } else { checklist_update(elem, class_red )}
                    break;
            }
        }
    })
})

function checklist_update(elem, [color_class, i_class]) {
    elem.classList.add(color_class);
    elem.querySelector('i').classList.add(i_class)
}

/*Registration notification messages*/
let signUp_form = document.querySelector('[data-registration-form]');
let notification_container = document.querySelectorAll('[data-registration-notification]')

signUp_form.addEventListener('submit', (event) => {
    event.preventDefault();
    formCheck();
})

function formCheck() {
    //reset notification
    let notifications;
    let formData = new FormData(signUp_form);

    //check username
    let username_input = formData.get('username');
    let username_value = new INPUT_CHECK(username_input);
    let username_notification = [];

    if (username_value.checkEmpty()) { username_notification.push('required_field') }
    if (!username_value.checkLength(4)) { username_notification.push('username_length') }
    if (username_value.checkSpace()) { username_notification.push('username_space') }
    if (username_value.checkSpecial()) { username_notification.push('username_special') }

    if (username_notification.length > 0) {
        notifications = notifications || {};
        notifications.username = username_notification
    }

    //check password
    let password_input = formData.get('password');
    let password_value = new INPUT_CHECK(password_input);
    let password_notification = [];

    if (password_value.checkEmpty()) { password_notification.push('required_field') };
    if (!password_value.checkLength(6)) { password_notification.push( 'password_length') };
    if (!password_value.checkLetter()) { password_notification.push('password_letter') };
    if (!password_value.checkNum()) { password_notification.push('password_number') };
    if (password_value.checkSpace()) { password_notification.push('password_space') };


    if (password_notification.length > 0) {
        notifications = notifications || {};
        notifications.password = password_notification
    }

    //check confirm password
    let confirm_password_input = formData.get('confirm_password');
    let password_confirm_notification = [];

    if (!confirm_password_input || confirm_password_input.trim() === '') { password_confirm_notification.push('required_field') }
    if (password_input !== confirm_password_input) { password_confirm_notification.push('confirm_password') }

    if (password_confirm_notification.length > 0) {
        notifications = notifications || {};
        notifications.confirm_password = password_confirm_notification
    }

    if (notifications) {
        displayNotification(notifications);
        return;
    }
    signUp_form.submit();
}

function displayNotification(obj) {
    let lang = document.documentElement.getAttribute('lang')
    let containers = Array.from(notification_container)

    //notification reset
    containers.forEach(container => {
        let child = Array.from(container.children);

        if (child.length > 0) {
            child.forEach(elem => elem.remove());
        }
    })
    for (let section in obj) {
        let target = document.querySelector(`[data-registration-notification=${section}]`)

        obj[section].forEach(notification => {
            let noti_html = new HTML_ELEM('p');
            noti_html.addText(langData.error[notification][lang])
            noti_html.addClass('error_notification');

            target.appendChild(noti_html.getElement())
        })
    }
}