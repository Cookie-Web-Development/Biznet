'use strict'

import langData from '../../lang/lang.json' assert { type: 'json' }
import { HTML_ELEM } from '../modules/moduleHTMLElemMaker.js'

let lang = document.documentElement.lang;


/*--------------------------------------------------------------------------*\
++ Tabel Row Selection
\*--------------------------------------------------------------------------*/

let table_rows = document.querySelectorAll('[data-table-row]');

Array.from(table_rows).forEach(row => {
    row.addEventListener('click', () => {
        Array.from(table_rows).forEach(elem => { elem.classList.remove('selected') })
        row.classList.add('selected');
    })
})


/*--------------------------------------------------------------------------*\
++ Table Search field
\*--------------------------------------------------------------------------*/
let catalog_search_container = document.querySelector('[data-catalog-search-container]');


/*########## 
multi_input 
############*/

catalog_search_container.addEventListener('change', (e) => {
    if(e.target.dataset.tableSearchType) {
        let select_elem = e.target
        multi_input_creator(select_elem)
    }
})

function multi_input_creator (select_elem, default_value = undefined) {
    // param_obj = { input_type: 'text' ; input_fill: 'placeholder_text'} default
    // param_obj = { input_type: 'select'; input_fill: [options_arr] }
    let param_obj = {};
    let selected_option = select_elem.options[select_elem.selectedIndex]

    param_obj.input_type = selected_option.dataset.inputType;
    param_obj.input_fill = selected_option.dataset.inputFill;
    
    //failsafe
    if(!param_obj.input_type || (param_obj.input_type != 'text' && param_obj.input_type != 'select')) {
        console.log('multi_input_creator invalid type')
        return;
    };

    let parent = select_elem.parentNode
    let multi_input_container = parent.querySelector('[data-multi-input]')

    Array.from(multi_input_container.children).forEach(child => child.remove())

    let input;

    switch(param_obj.input_type) {
        case 'text':
            input = new HTML_ELEM('input');
            input.addAttribute('type', 'text');
            input.addAttribute('placeholder', param_obj.input_fill || `${langData.main.search_filter.search[lang]}`);
            input.addAttribute('data-table-search');
            if (default_value) {
                input.addAttribute('value', default_value);
            }
            break; 
        case 'select':
            input = new HTML_ELEM('select');
            input.addAttribute('data-table-search');
            input.addClass('table_search_select');
            JSON.parse(param_obj.input_fill).forEach(entry => {
                let option = input.addElement('option');
                option.addAttribute('value', entry.value);
                option.addText(entry.text);
                if(default_value && entry.value == default_value) {
                    option.addAttribute('selected')
                }
            })
            break;
        default:
            return; /*failsafe*/
    }

    multi_input_container.appendChild(input.getElement())
}


/* ######## 
ADD SEARCH 
########### */

let add_search_btn = document.querySelector('[data-table-search-add]')

add_search_btn.addEventListener('click', () => {
    let node = document.querySelector('[data-search-pair]');
    let new_search = node.cloneNode(true);
    new_search.querySelector('[data-table-search-type]').selectedIndex = node.querySelector('[data-table-search-type]').selectedIndex
    catalog_search_container.appendChild(new_search)
})


/* ########### 
REMOVE SEARCH 
############## */

catalog_search_container.addEventListener('click', (e) => {
    if (e.target.dataset.tableSearchRemove) {
        let parent = e.target.parentElement;
        parent.remove();
    }
})


/*--------------------------------------------------------------------------*\
++ Table Search and Sort
\*--------------------------------------------------------------------------*/

let urlSearchParam = new URLSearchParams(window.location.search);

let table_search_btn = document.querySelector('[data-table-search-btn]');
let table_search_clear = document.querySelector('[data-table-clear-search]');

let table_sort_header = document.querySelectorAll('[data-table-sort]');

let search_query = {};


/* #################
query_params extract
#################### */

for (let [key, value] of urlSearchParam) {
    let match = key.match(/(\w+)\[([\w.]+)\]/);
    let mainKey = match[1], subKey = match[2];
    
    if (mainKey == 'sort') {
        let header_target = Array.from(table_sort_header).find(header => header.dataset.tableSort == subKey);
        let caret_i = new HTML_ELEM('i');
        caret_i.addClass('fa-solid');
        value == -1 ? caret_i.addClass('fa-angle-down') : caret_i.addClass('fa-angle-up');
        caret_i.addClass('sort_caret');
        header_target.appendChild(caret_i.getElement());
    }

    search_query[mainKey] = search_query[mainKey] || {};
    search_query[mainKey][subKey] = value;    
}


/* ###################
search_fields populate
###################### */

if (search_query.search && Object.keys(search_query.search).length > 0) {
    let index_catch = 0 //used for filling the first searchbar already in DOM
    for (let key in search_query.search) {
        if (index_catch === 0) {
            let select_elem = document.querySelector('[data-table-search-type]');
            let option = select_elem.querySelector(`option[value="${key}"]`)
            option.selected = true;
            multi_input_creator (select_elem, search_query.search[key])
            index_catch++
        } else {
            let node = document.querySelector('[data-search-pair]');
            let new_search = node.cloneNode(true);
            let new_type = new_search.querySelector('[data-table-search-type]')
            let type_selected = new_type.querySelector(`option[value="${key}"]`);
            catalog_search_container.appendChild(new_search)
            type_selected.selected = true;
            multi_input_creator (new_type, search_query.search[key])
        }
    }
}


/* ##########
BTN_functions
############# */

table_search_btn.addEventListener('click', () => {
    let query_url = table_search()
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


function table_search() {
    //reset search
    search_query.search = {};

    let table_search_pair = document.querySelectorAll('[data-search-pair]')

    Array.from(table_search_pair).forEach(pair => {
        let pair_type = pair.querySelector('[data-table-search-type]').value;
        let pair_value = pair.querySelector('[data-table-search]').value;

        if (pair_value.trim() != '') {
            search_query.search[pair_type] = pair_value
        }

    })

    let redirect_query = url_query_constructor(search_query);

    return redirect_query
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


/*--------------------------------------------------------------------------*\
++ URL QUERY CONSTRUCTOR
\*--------------------------------------------------------------------------*/

function url_query_constructor(query_obj) {
    // query_obj = { mainKey: {subKey: value }}
    // querystring: ?mainKey[subKey]=value
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
