'use strict'

import { HTML_ELEM } from '../modules/moduleHTMLElemMaker.js';


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

    form_data.forEach((value, key) => {
        if (!value || value.trim() === '') {
            notifications = notifications || {};
            notifications[key] = notifications[key] || [];
            notifications[key].push('required_field');
        }
    })

    // let password_current = form_data.get('password_current');
    let password_new = form_data.get('password_new');
    let password_new_confirm = form_data.get('password_new_confirm');

    console.log('password_new_confirm', form_data.get('password_new_confirm'))

    if (/\s/.test(password_new)) {
        notifications = notifications || {};
        notifications.password_new = notifications.password_new || [];
        notifications.password_new.push('password_space')
    }

    if (password_new !== password_new_confirm) {
        notifications = notifications || {};
        notifications.password_new_confirm = notifications.password_new_confirm || [];
        notifications.password_new_confirm.push('confirm_password')
    }

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
        console.log('submit_data')
        console.log(JSON.stringify(submit_data))
        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(submit_data),
        })
            .then(response => {
                console.log(response)
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