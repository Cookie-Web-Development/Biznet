'use strict';

import { display_results } from '../modules/moduleDisplayResults.js';
import { display_pagination } from '../modules/moduleDisplayPagination.js';

//Session_variables: this is to save current session values such as language, search values, pagination page, etc

let save_session = true; //save_session es para evitar guardar quick_querry en search_session storage

//Checks if applying either quick_query or search_session
if (Object.keys(quick_query).length >= 1) {
                
    search_query = quick_query;
    save_session = false;

    if(JSON.parse(sessionStorage.getItem('search_session')).sort_option) {
        search_query.sort_option = JSON.parse(sessionStorage.getItem('search_session')).sort_option
    };

    if(search_query.selected_tags){
        search_query.selected_tags = [search_query.selected_tags]
    }
} else {
    search_query = JSON.parse(sessionStorage.getItem('search_session')) || {}
};

//search_fields information populate
for (let key in search_query) {
    if (search_query.hasOwnProperty(key)) {
        switch (key){
            case 'name': 
                document.querySelector(`input[name='${key}']`).value = search_query[key]
                break;
            case 'sort_option':
            case 'category': 
            case 'brand': 
                let selectElem = document.querySelector(`select[name='${key}']`);
                let selectionIndex = Array.from(selectElem.options).findIndex(option => option.value === search_query[key]);
                selectElem.selectedIndex = selectionIndex;
                break;
            case 'discount': 
            case 'featured':
                document.querySelector(`input[name='${key}']`).checked = search_query[[key]] 
                break;
        }
    }
};

//### API ENDPOINT ##
let lang = document.documentElement.getAttribute('lang');
let search_form = document.getElementById('catalog_search_form');
let input_fields = Array.from(search_form.querySelectorAll('input[name], select'));
let product_results_container = document.getElementById('product_result');
let pagination_container = document.getElementById('pagination');
let debounce_delay = 500; //ms
let eventAPI = 'sendToAPI'; //Custom event for API Endpoint
let eventDispatcherCheck = false; //helps debounce when events are fired multiple times
let resultAutoScroll = false; //triggers autoscroll when using pagination
let active_page;
let items_per_page = 12 ;//Goes hand-in-hand with CSS filter-and-results.css #product_result grid-tempalet. Must change according to window width.

input_fields.forEach(input => {
    input.addEventListener(eventAPI, debounce(sendToServer, debounce_delay));

    input.addEventListener('input', () => {
        if (eventDispatcherCheck) {
            return;
        }
        eventDispatcherCheck = true;
        input.dispatchEvent(new Event(eventAPI))
    })
});

pagination_container.addEventListener('click', (event) => {
    if (event.target.matches('.button_pagination')) {
        if(!active_page) { return };
        switch (event.target.dataset.pageValue) {
            case "prev":
                if (active_page <= 1) { return }
                active_page--;
                break;
            case "next":
                active_page++;
                break;
            default:
                active_page = +event.target.dataset.pageValue;
            }
        debounce(sendToServer(active_page), debounce_delay);
        resultAutoScroll = true
        
    }
})

document.addEventListener("DOMContentLoaded", debounce(sendToServer, debounce_delay));


//functions declarations below;
function sendToServer ( set_active_page = undefined ) {
    let formData = new FormData(search_form);
    let data = {}
    for (let [key, value] of formData.entries()) {
        switch(key) {
            case 'price_range_min':
                (value != search_fields.price_range.min) ? data[key] = value : undefined;
                break;
            case 'price_range_max':
                (value != search_fields.price_range.max) ? data[key] = value : undefined;
                break;
            case 'selected_tags':
                (data[key]) ? data[key].push(value) : data[key] = [value];
                break;
            default: 
                (value != "") ? data[key] = value : undefined;
        }
    };
    
    data.items_per_page = items_per_page;
    
    if(typeof set_active_page == 'number') {
        active_page = set_active_page
        data.active_page = set_active_page;
    } else {active_page = 1};
    
    apiCall(data);
};

function apiCall(data) {
    let xhr = new XMLHttpRequest();
    let endpoint = '/catalog';

    xhr.open("POST", endpoint);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onload = () => {
        if (xhr.status === 200) {
            //Diferenciar entre quick_querie y search_query
            if(save_session) {
                sessionStorage.removeItem('search_session');
                sessionStorage.setItem('search_session',  JSON.stringify(data));
            } else {
                save_session = true;
            }
            let response = JSON.parse(xhr.responseText);
            let pagination_pages = Math.ceil(response.api_results[0].results_total / items_per_page) || 1;

            display_results(response.api_results[0].results_arr, lang, product_results_container); 
            display_pagination (active_page, pagination_pages, pagination_container);

            //auto scrolling trigger
            if(resultAutoScroll) {
                product_results_container.scrollIntoView({ behavior: 'smooth', block: 'start'})
                resultAutoScroll = false; //back to default
            }
        } else {
            console.error(xhr.statusText);
        }
    };
    xhr.onerror = () => {
        console.error(xhr.statusText);
    };
    xhr.send(JSON.stringify(data));
};

function debounce (func, delay) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func(...args); 
            eventDispatcherCheck = false //reverts the checker after debounce does its thing
        }, delay);
    };
};
