'use strict'

import langData from '../../lang/lang.json' assert { type: 'json' }
import { HTML_ELEM } from '../modules/moduleHTMLElemMaker.js'

//Table Functions
let table_rows = document.querySelectorAll('[data-table-row]');
let table_action_cell = document.querySelectorAll('[data-table-action-cell]');
let lang = document.documentElement.lang;
/* 
    Table action buttons must follow this structure:
    <-- td will be already in DOM -->
    td(class='row_center' data-table-action-cell=`${entry.brand_id}`) 
        button(class='table_inline_btn' type='button' title=`${langData.data_management.edit[lang]}`)
            i(class='fa-solid fa-pen-to-square fa-lg')
        span 
        button(class='table_inline_btn' type='button' title=`${langData.data_management.delete[lang]}`)
            i(class='fa-solid fa-trash fa-lg')
*/

Array.from(table_rows).forEach(row => {
    row.addEventListener('click', (e) => {
        Array.from(table_rows).forEach(elem => { elem.classList.remove('selected') })
        Array.from(table_action_cell).forEach(cell => {
            Array.from(cell.children).forEach(btn => btn.remove())
        });

        row.classList.add('selected');
        let target_cell = row.querySelector(`[data-table-action-cell="${row.dataset.tableRow}"]`);

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
    let match = key.match(/(\w+)\[(\w+)\]/);
    let mainKey = match[1], subKey = match[2];
    
    //field populate
    if(mainKey == 'search') {
        let search_type_selection = Array.from(table_search_type.children).findIndex(option => option.value == subKey)
        table_search.value = value;
        table_search_type.selectedIndex = search_type_selection
    }

    if(mainKey == 'sort') {
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

function table_text_search () {
    let search_type = table_search_type.value;
    let search_input = table_search.value;
    
    search_query.search = {} //clears old searches
    search_query.search[search_type] = search_input

    let redirect_query = url_query_constructor(search_query)
    return redirect_query;
    //return redirect with params
}

function table_sort (tableSort) {
    search_query.sort = search_query.sort || {};
    
    if(search_query.sort[tableSort] == 1) {
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
    let queryString = queryArr.join("&")
    let query_encoded = "?" + queryString
    return query_encoded
}


//Modal Functions

//Modal Function: close modal btn
let modal_close_btn = document.querySelectorAll('[data-close-modal]');

Array.from(modal_close_btn).forEach(btn => {
    btn.addEventListener('click', () => {
        let target = document.querySelector(`[data-table-modal=${btn.dataset.closeModal}]`)
        target.close();
    })
})

//API_SEND


//Functions
let action_edit_btn;
let action_del_btn;
function action_button_display(target_container) {
    //specifically for edit and delete buttons per row
    let edit_btn = new HTML_ELEM('button');
    edit_btn.addClass('table_inline_btn');
    edit_btn.addAttribute('type', 'button');
    edit_btn.addAttribute('title', langData.data_management.edit[lang]);
    edit_btn.addAttribute('data-action-type', 'edit')
    let edit_i = edit_btn.addElement('i')
    edit_i.addClass('fa-solid')
    edit_i.addClass('fa-pen-to-square')
    edit_i.addClass('fa-lg')
    let del_btn = new HTML_ELEM('button');
    del_btn.addClass('table_inline_btn');
    del_btn.addAttribute('type', 'button');
    del_btn.addAttribute('title', langData.data_management.delete[lang]);
    del_btn.addAttribute('data-action-type', 'delete')
    let del_i = del_btn.addElement('i')
    del_i.addClass('fa-solid')
    del_i.addClass('fa-trash')
    del_i.addClass('fa-lg')

    target_container.appendChild(edit_btn.getElement())
    target_container.appendChild(del_btn.getElement())

    //action_cell button functionality
    action_edit_btn = document.querySelector('[data-action-type="edit"]');
    // action_edit_btn.setAttribute('onclick', 'edit_modal_open;')
    action_edit_btn.onclick = function () { modal_open('edit'); };

    action_del_btn = document.querySelector('[data-action-type="delete"]');
    action_del_btn.onclick = function () { modal_open('delete'); }

}


function modal_open(action_type) {
    let modal = document.querySelector(`[data-table-modal="${action_type}"]`);
    let form_elem = modal.querySelector('[data-management-modal-form]');
    //form_elem reset
    Array.from(form_elem.children).forEach(child => child.remove())

    modal_form_creator(form_elem)

    modal.showModal();
}

function modal_form_creator(form_elem) {
    let row_selected = document.querySelector('.selected');
    let data_cells = row_selected.querySelectorAll('[data-row-key]');

    let data_array = Array.from(data_cells).map((cell) => ({
        [cell.dataset.rowKey]: cell.dataset.rowValue
    }));

    data_array.forEach((obj) => {
        for (let key in obj) {
            let label_elem = new HTML_ELEM('label');
            label_elem.addAttribute('for', key)
            label_elem.addText(langData.data_management[key][lang]);
            form_elem.appendChild(label_elem.getElement());
            let input_elem
            switch (key) {
                case 'brand_id':
                    input_elem = new HTML_ELEM('input');
                    input_elem.addClass('input_box')
                    input_elem.addAttribute('name', key);
                    input_elem.addAttribute('id', key);
                    input_elem.addAttribute('value', obj[key]);
                    input_elem.addAttribute('readonly');
                    if (form_elem.dataset.modalAction == 'edit') {
                        input_elem.addAttribute('title', langData.data_management.id_change[lang]);
                    }
                    break;
                default:
                    input_elem = new HTML_ELEM('input');
                    input_elem.addClass('input_box')
                    input_elem.addAttribute('name', key);
                    input_elem.addAttribute('id', key);
                    input_elem.addAttribute('value', obj[key]);
                    if (form_elem.dataset.modalAction == 'delete') {
                        input_elem.addAttribute('readonly')
                    }
            };
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
}
