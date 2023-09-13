'use strict';

import { HTML_ELEM } from '../modules/moduleHTMLElemMaker.js';

/*Registration notification messages*/
let signUp_submit = document.querySelector('[data-registration-submit]');
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
    let username_notification = [];

    if (!username_input) { username_notification.push('required_field') }
    if (/\s/.test(username_input.trim())) { username_notification.push('username_space') }

    if (username_notification.length > 0) {
        notifications = notifications || {};
        notifications.username = username_notification
    }

    //check password
    let password_input = formData.get('password');
    let password_notification = [];

    if (!password_input) { password_notification.push('required_field') }
    if (/\s/.test(password_input)) { password_notification.push('password_space') }


    if (password_notification.length > 0) {
        notifications = notifications || {};
        notifications.password = password_notification
    }

    //check confirm password
    let confirm_password_input = formData.get('confirm_password');
    let password_confirm_notification = [];

    if (!confirm_password_input) { password_confirm_notification.push('required_field') }
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
        let noti_html = new HTML_ELEM('p');
        noti_html.addText(langData.error[obj[section]][lang])
        noti_html.addClass('error_notification');

        target.appendChild(noti_html.getElement())
    }
}