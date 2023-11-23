'use strict';

import { HTML_ELEM } from '../modules/moduleHTMLElemMaker.js';
let lang = document.documentElement.getAttribute('lang');

/*------------------------------------------------------------------------*\
++ TAGS LIST
\*------------------------------------------------------------------------*/

let tag_list = document.querySelector('[data-tag-list]');
let tag_selected_container = document.querySelector('[data-tag-selected]');
let tag_search = document.querySelector('[data-tag-search]');

let selected_tags;

try {
   selected_tags = Array.from(JSON.parse(tag_selected_container.dataset.defaultValue))
} catch(err) {
    selected_tags = []
}

/*### Initial Tags load */
if (selected_tags.length > 0) {
    selected_tags_creator(selected_tags)
}

/*### Event Listeners */
tag_list.addEventListener('click', (e) => {
    selected_tags.push(+e.target.value);
    selected_tags_creator(selected_tags);
    tag_search.value = ''
    tag_search.dispatchEvent(new Event('input'))
    //hides select list
    tag_list.blur();
})

tag_selected_container.addEventListener('click', (e) => {
    if (e.target.dataset.tag) {
        selected_tags = selected_tags.filter(tag => {
            return tag != e.target.dataset.tag
        })
        selected_tags_creator(selected_tags)
    }
})

tag_search.addEventListener('input', () => {
    let input = tag_search.value.toLowerCase();
    let unselected_options = tag_list.querySelectorAll('[data-selected="false"]')
    let size = 0;
    if (input != '') {
        for (let i = 0; i < unselected_options.length; i++) {
            let tag = unselected_options[i];
            let tagText = tag.text.toLowerCase();
            if (tagText.includes(input)) {
                tag.style.display = ''
                size++
            } else {
                tag.style.display = 'none'
            }
        }
        if (size > 8) { size = 8};
        tag_list.size = size
    } else {
        for (let i = 0; i < unselected_options.length; i++) {
            let tag = unselected_options[i];
            tag.style.display = '';
        }
        tag_list.size = 8
    }
})

function selected_tags_creator(tag_arr) {
    //tags Reset
    Array.from(tag_list).forEach(child => child.dataset.selected = 'false')
    Array.from(tag_selected_container.children).forEach(child => child.remove());

    //selected_tag remove from list and map
    let selected_tags_map = tag_arr.map(tag => {
        let match = Array.from(tag_list).filter(list => list.value == tag)
        match[0].setAttribute('data-selected', 'true')
        return [match[0].value, match[0].innerText]
    })

    /* Tag create */
    selected_tags_map.forEach(tag => {
        let li_elem = new HTML_ELEM('li');
        li_elem.addClass('selected_tag');

        let li_label = li_elem.addElement('label');
        let li_checkbox = li_label.addElement('input');
        li_checkbox.addAttribute('type', 'checkbox');
        li_checkbox.addAttribute('checked', true);
        li_checkbox.addAttribute('value', tag[0]);
        li_checkbox.addAttribute('data-tag', tag[0])
        li_checkbox.name = 'selected_tags';
        let li_text = li_label.addElement('span');
        li_text.addText(tag[1]);

        tag_selected_container.appendChild(li_elem.getElement())
    })
}


/*------------------------------------------------------------------------*\
++ LISTING CONTAINER
\*------------------------------------------------------------------------*/

/*### DISCOUNT CALCULATOR */
let product_listing = document.querySelectorAll('[data-product-listing]');
let discount_checkbox = document.querySelectorAll('[data-discount-checkbox]');
let discount_value = document.querySelectorAll('[data-discount-input]');
let price_value = document.querySelectorAll('[data-listing-price]');
let formatStyle = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
})
// formatStyle.format(raw_input)

discount_value.forEach(elem => {
    elem.addEventListener('input', () => {
        if (elem.value > 1) { elem.value = 1 }
        if (elem.value < 0) { elem.value = 0 }
        let checkbox = document.querySelector(`[data-listing-filter=${listing_filter}][data-discount-checkbox]`);
        if (!checkbox.checked) { return; }
        discount_calculator(elem)
    })
})

price_value.forEach(elem => {
    elem.addEventListener('input', () => {
        let checkbox = document.querySelector(`[data-listing-filter=${listing_filter}][data-discount-checkbox]`);
        if (!checkbox.checked) { return; }
        discount_calculator(elem);
    })

})

discount_checkbox.forEach(elem => {
    elem.addEventListener('change', () => {
        discount_calculator(elem)
    })
})

if(Array.from(product_listing).length > 0) {
    console.log(Array.from(product_listing).length)
    product_listing.forEach(elem => {
        discount_calculator(elem)
    })
}

function discount_calculator(elem) {
    let listing_filter = elem.dataset.listingFilter
    let listing_discount_checkbox = document.querySelector(`[data-listing-filter=${listing_filter}][data-discount-checkbox]`);
    let listing_price_value = document.querySelector(`[data-listing-filter=${listing_filter}][data-listing-price]`)
    let listing_discount_result = document.querySelector(`[data-listing-filter=${listing_filter}][data-discount-calc]`);
    let listing_discount_percent = document.querySelector(`[data-listing-filter=${listing_filter}][data-discount-input]`)

    if (!listing_discount_checkbox.checked) {
        listing_discount_result.textContent = formatStyle.format(+listing_price_value.value);
        listing_discount_result.classList.add('grey_out');
        return;
    }

    let discount_total = listing_price_value.value * (1 - listing_discount_percent.value)
    listing_discount_result.textContent = formatStyle.format(discount_total)
    listing_discount_result.classList.remove('grey_out');
}

/*### IMAGE GALLERY */
let image_thumbnails = document.querySelectorAll('[data-image]')
let image_modal = document.querySelector('[data-image-modal]')
let image_modal_img = image_modal.querySelector('img');
let image_local_route = '/public/img/products-images/'

image_thumbnails.forEach(image => {
    image.addEventListener('click', (e) => {
        if (e.target.dataset.image) {
            image_modal_img.setAttribute('src', image_local_route + e.target.dataset.image)
            image_modal.showModal()
        }
    })
})

image_modal.addEventListener('click', () => {
    image_modal.close()
})

/*------------------------------------------------------------------------*\
++ API ENDPOINT
\*------------------------------------------------------------------------*/

let form = document.querySelector('[data-api-form]');

//preven raw form submit
form.addEventListener('submit', (e) => {
    e.preventDefault();
    return;
})

/*### payload constructor*/
let send_btn = document.querySelector('[data-api-button="save"]');
let data = { payload: {} };

send_btn.addEventListener('click', () => {
    console.log('payload constructor');
    payload_constructor()
})

function payload_constructor() {
    let payload_array = document.querySelectorAll('[data-type]');
    let token_input = document.querySelector('[data-form-input="token"]');
    let _id_input = document.querySelector('[data-form-input="_id"]');

    let arrayFilters = new Set()

    data.csrf = token_input.value || null;
    data.match = { _id: _id_input.value} || null;

    /*
    DEVNOTE: The following loop is a mess and reaaally redundant. Specially the 'switch case list' part where its parsing and stringifying multiple times. Need to optimize it in the future...
    Its this way cuz it needs to compare the info between two arrays (DB and input). Tried with sets, didnt work; and lets avoid making yet another loop inside this loop.

    ## default_value: The main redundancy lies with sorting and parsing. The data from server comes as a string. The order from DB is not garanteed, specially if the document has been created manually. Right now its parsing a string, ordering it and stringifying it for the comparison.

    ## current_value: Since the input is an actual <ul>, the data comes from an array of [data-tags] that has not been declared yet. Right now, its declaring the array of inputs, sorting it, stringifying it, and in case of a difference, sending it as a string, and parsing it in server for DB storage.

    */
    Array.from(payload_array).forEach(input => {
        //check for changed value. If true, run the following:
        let default_value;
        let current_value;

        switch (input.dataset.type) {
            case 'list':
                default_value = JSON.stringify(Array.from(JSON.parse(input.dataset.defaultValue)).sort((a, b) => { return a - b }))
                current_value = JSON.stringify(Array.from(input.querySelectorAll('[data-tag]')).map(tag => { return +tag.dataset.tag }).sort((a, b) => { return a - b }));
                break;
            case 'checkbox':
                default_value = JSON.parse(input.dataset.defaultValue)
                current_value = input.checked
                break;
            case 'number':
                default_value = +input.dataset.defaultValue
                current_value = +input.value;
                break;
            default:
                default_value = input.dataset.defaultValue
                current_value = input.value
        }

        if (current_value == default_value) { return; }

        if(input.dataset.type == 'list') {
            current_value = JSON.parse(current_value)
        }

        data.payload[input.dataset.formInput] = current_value

        //if part of listing, adds arrayFilters parameters for Mongoose
        if (input.dataset.listingFilter) {
            let sku = input.dataset.listingSku;
            let index = input.dataset.listingFilter;
            arrayFilters.add(`{"${index}.sku": "${sku}"}`)
        } 
    })

    //create data.arrayFilters if necessary
    if (arrayFilters.size > 0) {
        data.arrayFilters = Array.from(arrayFilters).map(entry => { return JSON.parse(entry) })
    }

    console.log('check data')
    console.log(data)

    //send to API
    if (Object.keys(data.payload).length == 0) { 
        console.log('nothing to update')
        return; 
    }
    send_to_api(data)
}

/*### send to API*/
let endpoint = form.getAttribute('action')
let method = form.getAttribute('method')

console.log('endpoint', endpoint, 'method', method)
function send_to_api(data) {
    fetch(endpoint, {
        method: method,
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(data),
    })
        .then(response => {
            window.location.href = response.url
        })
        .catch(err => { })
}
