'use strict'

import langData from '../../lang/lang.json'assert { type: "json" };
import { HTML_ELEM } from '../modules/moduleHTMLElemMaker.js';

/*###################
Defaul <select> option
#####################*/
let select_elem = Array.from(document.querySelectorAll('[data-form-select]')) || []

select_elem.forEach((elem) => {
    let option = Array.from(elem.children) || []
    option.forEach((child) => {
        if(child.value === elem.dataset.defaultValue) {
            child.selected = true
        }
    })
})

/*##########
FORM Handler
############*/
let form = document.querySelector('[data-universal-form]');
let form_container = document.querySelector('[data-universal-notification]');
let unique_trigger = false;

form.addEventListener('submit', (event) => {
    event.preventDefault();

    //notification reset
    Array.from(form_container.children).forEach(child => child.remove());

    formCheck();
})

function formCheck() {
    //trigger check
    if (unique_trigger) {
        return;
    }
    unique_trigger = true;
    let form_data = new FormData(form);
    let submit_data = { target: {}, validate: {}, update: {}};

    //curate data
    form_data.forEach((value, key) => {
        let default_val = document.querySelector(`[name=${key}]`).dataset.defaultValue
        
        if (key === 'target') {
            submit_data.target._id = value
        }

        if(key === 'token') {
            submit_data.validate._csrf = value
        }

        if(key !== 'token' && value.trim() !== default_val && value.trim() !== '') {
            switch(key) {
                case 'prefered_language':
                    submit_data.update['user_preferences.lang'] = value.trim()
                    break;
                default:
                    submit_data.update[key] = value.trim()
            }
        }
    })

    if(Object.keys(submit_data.update).length < 1) {
        let notification_error = { error: 'no_change' }
        display_notification(notification_error)
        return;

    } else {
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
                // console.log(response)
                window.location.href = response.url
            })
            .catch(err => {})
    }
}

function display_notification(notification_object) {
    let lang = document.documentElement.lang;
    unique_trigger = false;
    for (let type in notification_object) {
        let noti_text = new HTML_ELEM('p')
        noti_text.addText(langData[type][notification_object[type]][lang]);
        switch (type) {
            case 'notification': 
                noti_text.addClass('green');
                break;
            case 'error': 
                noti_text.addClass('red');
                break;
            default: 
                return;
        }
        form_container.appendChild(noti_text.getElement());
    }

}