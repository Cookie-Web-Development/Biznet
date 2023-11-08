'use strict'

import langData from '../../lang/lang.json' assert { type: 'json' }
import { HTML_ELEM } from '../modules/moduleHTMLElemMaker.js'

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
++ Table Search and Sort
\*--------------------------------------------------------------------------*/

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


/*--------------------------------------------------------------------------*\
++ URL QUERY CONSTRUCTOR
\*--------------------------------------------------------------------------*/
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
