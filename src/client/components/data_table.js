'use strict'

import langData from '../../lang/lang.json' assert { type: 'json' }
import { HTML_ELEM } from '../modules/moduleHTMLElemMaker.js'

//Table Functions
let table_rows = document.querySelectorAll('[data-table-row]');
let table_action_cell = document.querySelectorAll('[data-table-action-cell]');
let lang = document.documentElement.lang;

Array.from(table_rows).forEach(row => {
    row.addEventListener('click', (e) => {
        Array.from(table_rows).forEach(elem => { elem.classList.remove('selected') })
        Array.from(table_action_cell).forEach(cell => {
            Array.from(cell.children).forEach(btn => btn.remove())
        });

        row.classList.add('selected');
        let target_cell = row.querySelector(`[data-table-action-cell]`);

        action_button_display(target_cell);

    })
})

//Table Search & Sort
let table_search = document.querySelector('[data-table-search]');
let table_search_btn = document.querySelector('[data-table-search-btn]');
let table_search_clear = document.querySelector('[data-table-clear-search]');
let table_search_type = document.querySelector('[data-table-search-type]');
let table_sort_header = document.querySelectorAll('[data-table-sort]');
let urlSearchParam = new URLSearchParams(window.location.search);

let search_query = {};

for (let [key, value] of urlSearchParam) {
    let match = key.match(/(\w+)\[([\w.]+)\]/);
    let mainKey = match[1], subKey = match[2];

    //field populate
    if (mainKey == 'search') {
        let search_type_selection = Array.from(table_search_type.children).findIndex(option => option.value == subKey)
        table_search.value = value;
        table_search_type.selectedIndex = search_type_selection
    }

    if (mainKey == 'sort') {
        let header_target = Array.from(table_sort_header).find(header => header.dataset.tableSort == subKey);
        let caret_i = new HTML_ELEM('i');
        caret_i.addClass('fa-solid');
        value == -1 ? caret_i.addClass('fa-angle-down') : caret_i.addClass('fa-angle-up');
        caret_i.addClass('sort_caret');
        header_target.appendChild(caret_i.getElement());
    }

    search_query[mainKey] = {};
    search_query[mainKey][subKey] = value;
}


table_search_btn.addEventListener('click', () => {
    let query_url = table_text_search()
    return window.location.href = query_url
})

table_search_clear.addEventListener('click', () => {
    search_query.search = {}
    let query_url = url_query_constructor(search_query)
    return window.location.href = query_url
})

Array.from(table_sort_header).forEach(header => {
    header.addEventListener("click", () => {
        let query_url = table_sort(header.dataset.tableSort);
        return window.location.href = query_url
    })
})

function table_text_search() {
    let search_type = table_search_type.value;
    let search_input = table_search.value;

    search_query.search = {} //clears old searches
    search_query.search[search_type] = search_input

    let redirect_query = url_query_constructor(search_query)
    return redirect_query;
}

function table_sort(tableSort) {
    search_query.sort = search_query.sort || {};

    if (search_query.sort[tableSort] == 1) {
        search_query.sort[tableSort] = -1
    } else {
        search_query.sort = {} //clear sorts
        search_query.sort[tableSort] = 1
    }

    let redirect_query = url_query_constructor(search_query);
    return redirect_query;
}

function url_query_constructor(query_obj) {
    // query_obj = { mainKey: {subKey: value }}
    //querystring: ?mainKey[subKey]=value
    let queryArr = [];
    Object.keys(query_obj).forEach(mainKey => {
        Object.keys(query_obj[mainKey]).forEach(subKey => {
            let queryString = `${mainKey}[${subKey}]=${query_obj[mainKey][subKey]}`
            queryArr.push(queryString)
        })
    })
    let queryString = encodeURI(queryArr.join("&"))
    let query_encoded = "?" + queryString

    return query_encoded
}


//Modal Functions
//// create entry
let create_action_btn = document.querySelector('[data-action-type="create"]')
let create_modal = document.querySelector('[data-table-modal="create"]')

create_action_btn.addEventListener('click', () => {
    create_modal.showModal()
})


//Modal Function: close modal btn
let modal_close_btn = document.querySelectorAll('[data-close-modal]');

Array.from(modal_close_btn).forEach(btn => {
    btn.addEventListener('click', () => {
        let target = document.querySelector(`[data-table-modal=${btn.dataset.closeModal}]`)
        target.close();
    })
})

//Modal Function: form send BTN
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

    API_SEND(form_data)
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

//API_SEND
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

//Functions
let action_edit_btn;
let action_del_btn; //disabled delete button until further notice
function action_button_display(target_container) {
    //specifically for edit and delete buttons per row
    let edit_btn = new HTML_ELEM('button');
    edit_btn.addClass('table_inline_btn');
    edit_btn.addAttribute('type', 'button');
    edit_btn.addAttribute('title', langData.data_management.edit[lang]);
    edit_btn.addAttribute('data-action-type', 'update')
    let edit_i = edit_btn.addElement('i')
    edit_i.addClass('fa-solid')
    edit_i.addClass('fa-pen-to-square')
    edit_i.addClass('fa-lg')
    // let del_btn = new HTML_ELEM('button');
    // del_btn.addClass('table_inline_btn');
    // del_btn.addAttribute('type', 'button');
    // del_btn.addAttribute('title', langData.data_management.delete[lang]);
    // del_btn.addAttribute('data-action-type', 'delete')
    // let del_i = del_btn.addElement('i')
    // del_i.addClass('fa-solid')
    // del_i.addClass('fa-trash')
    // del_i.addClass('fa-lg')
    //disabled delete button until further notice


    target_container.appendChild(edit_btn.getElement())
    // target_container.appendChild(del_btn.getElement())

    //action_cell button functionality
    action_edit_btn = document.querySelector('[data-action-type="update"]');
    action_edit_btn.onclick = function () { modal_open('update'); };

    // action_del_btn = document.querySelector('[data-action-type="delete"]');
    // action_del_btn.onclick = function () { modal_open('delete'); }
    //disabled delete button until further notice
}

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

//functions: notification bar
let noti_container = document.querySelector('[data-noti-container]');

noti_container.addEventListener('click', (e) => {
    //remove notifications on click
    if(Array.from(noti_container.children).length > 0) {
        noti_container.removeChild(e.target)
    }
})

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