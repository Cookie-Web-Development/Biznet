'use strict';

import { HTML_ELEM } from '../modules/moduleHTMLElemMaker.js';

/*Registration notification messages*/
let signUp_submit = document.querySelector('[data-registration-submit]');
let signUp_form = document.querySelector('[data-registration-form]');
let notification_container = document.querySelectorAll('[data-registration-notification]')

signUp_submit.addEventListener('click', () => {
    formCheck()
})

function formCheck() {
    //reset notification
    //Array.from(notification_container.children).forEach(child => child.remove());
    let notifications;
    let formData = new FormData(signUp_form);
    
    //check username
    let username_input = formData.get('username');
    let username_notification = [];

    if(!username_input) { username_notification.push('required_field') }
    if (/\s/.test(username_input.trim())) { username_notification.push('username_space') }

    if(username_notification.length > 0) { 
        notifications = notifications || {};
        notifications.username = username_notification
    }
    
    //check password
    let password_input = formData.get('password');
    let password_notification = [];

    if(!password_input) {password_notification.push('required_field')}
    if(/\s/.test(password_input)) { password_notification.push('password_space') }


    if(password_notification.length > 0) {
        notifications = notifications || {};
        notifications.password = password_notification
    }
    
    //check confirm password
    let confirm_password_input = formData.get('confirm_password');
    let password_confirm_notification = [];

    if(!confirm_password_input) {password_confirm_notification.push('required_field')}
    if(password_input !== confirm_password_input) { password_confirm_notification.push('confirm_password') }

    if(password_confirm_notification.length > 0) {
        notifications = notifications || {};
        notifications.confirm_password = password_confirm_notification
    }

    if (notifications) {
        displayNotification(notifications);
        return;
    }

    //send to server
    console.log('lets gooooooo')
    //formSubmit(formData)
}

function formSubmit (data) {
    let xhr = new XMLHttpRequest();
    let endpoint = '/register';
    
    xhr.open('POST', endpoint);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
    xhr.onload = () => {
        if (xhr.status === 200) {
            let notification_response = JSON.parse(xhr.responseText);
            displayNotification(notification_response);
        } else {
            console.error(xhr.statusText)
        }
    }
    xhr.onerror = () => {
        console.error(xhr.statusText);
    }
    xhr.send(JSON.stringify(data))

}

function displayNotification (obj) {
    let containers = Array.from(notification_container)
    
    //notification reset
    containers.forEach(container => {
        let child = Array.from(container.children);

        if(child.length > 0) {
            child.forEach(elem => elem.remove());
        }
    })

    for(let section in obj) {
        let target = document.querySelector(`[data-registration-notification=${section}]`)
        let noti_html = new HTML_ELEM('p');
        noti_html.addText(langData.error[obj[section]][lang])
        noti_html.addClass('error_notification');

        target.appendChild(noti_html.getElement())
    }
}