'use strict'

import langData from '../../lang/lang.json' assert { type: 'json' }
import { HTML_ELEM } from '../modules/moduleHTMLElemMaker.js'
let eventDispatch = false;

/*--------------------------------------------------------------------------*\
++ Create New Entry Modal
\*--------------------------------------------------------------------------*/

let create_action_btn = document.querySelector('[data-action-type="create"]')
let create_modal = document.querySelector('[data-table-modal="create"]')
let lang = document.documentElement.lang;

create_action_btn.addEventListener('click', () => {
    create_modal.showModal()
})


/*--------------------------------------------------------------------------*\
++ Close Modals BTN
\*--------------------------------------------------------------------------*/

let modal_close_btn = document.querySelectorAll('[data-close-modal]');

Array.from(modal_close_btn).forEach(btn => {
    btn.addEventListener('click', () => {
        let target = document.querySelector(`[data-table-modal=${btn.dataset.closeModal}]`)
        target.close();
    })
})


/*--------------------------------------------------------------------------*\
++ Send form BTN
\*--------------------------------------------------------------------------*/

let form_submit_btn = document.querySelectorAll('[data-modal-action-btn]')

Array.from(form_submit_btn).forEach(btn => {
    btn.addEventListener('click', () => {
        let target_form = document.querySelector(`[data-modal-action-form="${btn.dataset.modalActionBtn}"]`);

        let target_action = btn.dataset.modalActionBtn;
        try {
            API_FORM(target_form, target_action);
        } catch (err) {
            notification_display(err.type, err.message)
        }
    })
})

/*--------------------------------------------------------------------------*\
++ Create FORM
\*--------------------------------------------------------------------------*/

function API_FORM(form_node, form_action) {
    let form_data = {
        payload: {}
    };
    let form_inputs = form_node.querySelectorAll('input');

    let endpoint = new URL(form_node.action).pathname;
    let id_regex = /^\/\w+\/([^_]+)/;
    let prefix_id = endpoint.match(id_regex);

    Array.from(form_inputs).forEach(input => {
        switch (input.name) {
            case `${prefix_id[1]}_id`:
                form_data.payload.payload_id = { [input.name]: input.value }
                break;
            case 'token':
                form_data.payload.validate = { _csrf: input.value }
                break;
            default:
                if (
                    form_action == 'update' &&
                    (
                        input.value.trim() === '' ||
                        input.value.trim() == input.dataset.defaultValue
                    )
                ) { break; } else if (input.value.trim() === '') {
                    let active_dialog = document.querySelector('dialog[open]')
                    active_dialog.close();
                    throw { type: 'error', message: 'empty_field' }
                }
                form_data.payload.payload_content = form_data.payload.payload_content || {};
                form_data.payload.payload_content[input.name] = input.value
                break;
        }
    });

    if (!form_data.payload.payload_content) {
        let active_dialog = document.querySelector('dialog[open]');
        active_dialog.close();
        throw { type: 'warning', message: 'no_change' }
    }

    Object.assign(form_data, {
        endpoint: endpoint,
        method: form_node.dataset.method,
    })


    if(eventDispatch) {
        return;
    } else {
        eventDispatch = true;
        API_SEND(form_data)
    }
};

/*
    form_data = {
        endpoint: '/brand_edit',
        method: 'PUT',
        payload: {
            validate: { _csrf: value },
            payload_id = { brand_id: 1 },
            payload_content = { //todos los inputs name : value que hayan cambiado}
        }
    }
Para los actions que sean update, no procesar inputs que no hayan cambiado
*/

/*--------------------------------------------------------------------------*\
++ Send to API
\*--------------------------------------------------------------------------*/

function API_SEND(formData) {
    fetch(formData.endpoint, {
        method: formData.method,
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(formData.payload),
    })
        .then(response => {
            window.location.href = response.url
        })
        .catch(err => { })
}


/*--------------------------------------------------------------------------*\
++ Edit Entry Modal
\*--------------------------------------------------------------------------*/

let btn_edit = document.querySelectorAll('[data-action-type="update"]')

Array.from(btn_edit).forEach(btn => {
    btn.addEventListener('click', (e) => {
        modal_open('update')
    })
})

function modal_open(action_type) {
    let modal = document.querySelector(`[data-table-modal="${action_type}"]`);
    let form_elem = modal.querySelector('form');
    //form_elem reset
    Array.from(form_elem.children).forEach(child => child.remove())

    modal_form_creator(form_elem)

    modal.showModal();
};

function modal_form_creator(form_elem) {
    let row_selected = document.querySelector('.selected');
    let data_obj = JSON.parse(row_selected.dataset.tableRow);
    
    Object.keys(data_obj).forEach(key => {
        if (Object(data_obj[key]) === data_obj[key]) { //for when lang is an issue

            //label and input of SELECTED lang
            let current_name_label = new HTML_ELEM('label');
            current_name_label.addAttribute('for', `${key}.${lang}`);
            current_name_label.addText(`${langData.data_management[key][lang]} (${langData.profile.language_sel[lang]})`)
            form_elem.appendChild(current_name_label.getElement());

            let current_name_input = new HTML_ELEM('input');
            current_name_input.addClass('input_box');
            current_name_input.addAttribute('name', `${key}.${lang}`);
            current_name_input.addAttribute('id', `${key}.${lang}`);
            current_name_input.addAttribute('value', data_obj[key][lang]);
            current_name_input.addAttribute('data-default-value', data_obj[key][lang]);
            if (form_elem.dataset.modalAction == 'delete') {
                current_name_input.addAttribute('readonly')
            };
            form_elem.appendChild(current_name_input.getElement())

            //label and input of NON SELECTED lang
            let unsel_lang = Object.keys(data_obj[key]).filter((lang_opts) => lang_opts != lang);

            unsel_lang.forEach(notLang => {
                let other_name_label = new HTML_ELEM('label')
                other_name_label.addAttribute('for', `${key}.${notLang}`);
                other_name_label.addText(`${langData.data_management[key][notLang]} (${langData.profile.language_sel[notLang]})`);
                form_elem.appendChild(other_name_label.getElement());

                let other_name_input = new HTML_ELEM('input');
                other_name_input.addClass('input_box');
                other_name_input.addAttribute('name', `${key}.${notLang}`);
                other_name_input.addAttribute('id', `${key}.${notLang}`);
                other_name_input.addAttribute('value', data_obj[key][notLang]);
                other_name_input.addAttribute('data-default-value', data_obj[key][notLang]);
                if (form_elem.dataset.modalAction == 'delete') {
                    other_name_input.addAttribute('readonly')
                };
                form_elem.appendChild(other_name_input.getElement());
            });

        } else { //for when lang is NOT an issue
            //label and input of EVERYTHING ELSE
            let label_elem = new HTML_ELEM('label');
            label_elem.addAttribute('for', key);
            label_elem.addText(langData.data_management[key][lang]);
            form_elem.appendChild(label_elem.getElement());

            let input_elem = new HTML_ELEM('input');
            input_elem.addClass('input_box');
            input_elem.addAttribute('name', key);
            input_elem.addAttribute('id', key);
            input_elem.addAttribute('value', data_obj[key])
            switch (key) {
                case 'brand_id':
                case 'category_id':
                case 'tag_id':
                    input_elem.addAttribute('readonly');
                    if (form_elem.dataset.modalAction == 'edit') {
                        input_elem.addAttribute('title', langData.data_management.id_change[lang]);
                    }
                    break;
                default:
                    input_elem.addAttribute('data-default-value', data_obj[key]);
                    if (form_elem.dataset.modalAction == 'delete') {
                        input_elem.addAttribute('readonly');
                    }
                    break;
            }
            form_elem.appendChild(input_elem.getElement());
        }
    })

    let csrf_token = form_elem.dataset.csrf;
    let csrf_input = new HTML_ELEM('input');
    csrf_input.addAttribute('type', 'hidden');
    csrf_input.addAttribute('name', 'token');
    csrf_input.addAttribute('readonly');
    csrf_input.addAttribute('value', csrf_token);
    form_elem.appendChild(csrf_input.getElement());
};

/*--------------------------------------------------------------------------*\
++ Notification bar
\*--------------------------------------------------------------------------*/

let noti_container = document.querySelector('[data-noti-container]');

function notification_display(type, message) {
    //creates a notification without reload. Only accepts one notification per call

    let new_noti = new HTML_ELEM('p');
    let noti_i

    switch (type) {
        case 'notification':
            new_noti.addClass('green');
            noti_i = new_noti.addElement('i');
            noti_i.addClass('fa-solid');
            noti_i.addClass('fa-check');
            break;
        case 'error':
            new_noti.addClass('red');
            noti_i = new_noti.addElement('i');
            noti_i.addClass('fa-solid');
            noti_i.addClass('fa-ban');
            break;
        case 'warning':
            new_noti.addClass('orange');
            noti_i = new_noti.addElement('i');
            noti_i.addClass('fa-solid');
            noti_i.addClass('fa-triangle-exclamation');
            break;
        default:
            return;
    };
    let noti_text = new_noti.addElement('span');
    noti_text.addText(` ${langData.error[message][lang]}`);
    noti_container.appendChild(new_noti.getElement())
};