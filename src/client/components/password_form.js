'use strict'

import langData from '../../server/lang/lang.json'assert { type: "json" };
import { HTML_ELEM } from '../modules/moduleHTMLElemMaker.js';
import { INPUT_CHECK } from '../modules/moduleInputCheck.js';

/*##########
FORM Handler
############*/
let form = document.querySelector('[data-universal-form]');
let notification_containers = document.querySelectorAll('[data-form-notification]')
let unique_trigger = false;

form.addEventListener('submit', (event) => {
    event.preventDefault();

    //notification reset
    notification_containers.forEach(container => {
        Array.from(container.children).forEach(child => child.remove())
    })

    formCheck(form);
})

function formCheck(data) {
    //trigger check
    if (unique_trigger) {
        return;
    }
    unique_trigger = true;

    //curate data
    let form_data = new FormData(data);
    let notifications;

    //current password
    let password_current = form_data.get('password_current');
    let pwCurrent_value = new INPUT_CHECK(password_current);
    let password_current_noti = [];

    if (pwCurrent_value.checkEmpty()) { password_current_noti.push( 'required_field' )};

    if (password_current_noti.length > 0) {
        notifications = notifications || {};
        notifications.password_current = password_current_noti;
    };

    //password new
    let password_new = form_data.get('password_new');
    let password_new_confirm = form_data.get('password_new_confirm');
    let pwNew_value = new INPUT_CHECK(password_new);
    let password_new_noti = [], password_new_confirm_noti = [];

    if (pwNew_value.checkEmpty()) { password_new_noti.push( 'required_field' )};
    if (!pwNew_value.checkLength(6)) { password_new_noti.push( 'password_length' )};
    if (!pwNew_value.checkLetter()) { password_new_noti.push( 'password_letter' )};
    if (!pwNew_value.checkNum()) { password_new_noti.push( 'password_number' )};
    if (pwNew_value.checkSpace()) { password_new_noti.push( 'password_space' )};

    if (password_new_noti.length > 0 ) {
        notifications = notifications || {};
        notifications.password_new = password_new_noti;
    };

    if (password_new !== password_new_confirm) { password_new_confirm_noti.push('confirm_password') };

    if (password_new_confirm_noti.length > 0) {
        notifications = notifications || {};
        notifications.password_new_confirm = password_new_confirm_noti;
    };

    if (notifications) {
        display_notification(notifications)
        return;
    } else {
        let submit_data = { validate: {}, update: {} };

        form_data.forEach((value, key) => {
            switch(key){
                case 'password_current':
                    submit_data.validate.password = value;
                    break;
                case 'token':
                    submit_data.validate._csrf = value;
                    break;
                case 'password_new':
                    submit_data.update.password = value;
                    break;
                case 'password_new_confirm':
                    break;
                default:
                    throw new Error('Submit Error')
            }
        })

        //send To API
        let endpoint = form.getAttribute('action')
        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(submit_data),
        })
            .then(response => {
                window.location.href = response.url
            })
            .catch(err => { })
    }
}

function display_notification(notification_object) {
    unique_trigger = false;
    for (let type in notification_object) {
        let target_container = document.querySelector(`[data-form-notification=${type}]`)

        notification_object[type].forEach(notification => {
            let noti_html = new HTML_ELEM('p');
            noti_html.addText(langData.error[notification][lang])
            noti_html.addClass('error_notification');
            target_container.appendChild(noti_html.getElement())
        })
    }

}