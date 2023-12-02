'use strict';

import { HTML_ELEM } from '../modules/moduleHTMLElemMaker.js';
import langData from '../../lang/lang.json' assert { type: 'json'};
let lang = document.documentElement.getAttribute('lang');
let debounce_delay = 500; //ms
let eventDispatcherCheck = false; //helps debounce when events are fired multiple times

/*------------------------------------------------------------------------*\
++ TAGS LIST
\*------------------------------------------------------------------------*/

let tag_list = document.querySelector('[data-tag-list]');
let tag_selected_container = document.querySelector('[data-tag-selected]');
let tag_search = document.querySelector('[data-tag-search]');

let selected_tags;

try {
    selected_tags = Array.from(JSON.parse(tag_selected_container.dataset.defaultValue))
} catch (err) {
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
        if (size > 8) { size = 8 };
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
        if(!match[0]) {return;} //filters out invalid value | tags
        match[0].setAttribute('data-selected', 'true')
        return [match[0].value, match[0].innerText]
    })

    /* Tag create */
    selected_tags_map.forEach(tag => {
        if(!tag) {return} //filters out invalid value | tags
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
    let listing_filter = elem.dataset.listingFilter;
    elem.addEventListener('input', () => {
        if (elem.value > 1) { elem.value = 1 }
        if (elem.value < 0) { elem.value = 0 }
        let checkbox = document.querySelector(`[data-listing-filter=${listing_filter}][data-discount-checkbox]`);
        if (!checkbox.checked) { return; }
        discount_calculator(elem)
    })
})

price_value.forEach(elem => {
    let listing_filter = elem.dataset.listingFilter;
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

if (Array.from(product_listing).length > 0) {
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

if (image_thumbnails.length > 0) {
    let image_modal = document.querySelector('[data-image-modal]')
    let image_modal_img = image_modal.querySelector('img')
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
}


/*------------------------------------------------------------------------*\
++ MAIN PAYLOAD: General product edit
\*------------------------------------------------------------------------*/

let edit_form = document.querySelector('[data-api-form]');

//preven raw form submit
edit_form.addEventListener('submit', (e) => {
    e.preventDefault();
    return;
})

/*### PAYLOAD: UPDATE PRODUCT*/
let send_btn = document.querySelector('[data-api-button="save"]');
let data = { payload: {} };

send_btn.addEventListener('click', () => {
    payload_constructor()
})

function payload_constructor() {
    let payload_array = document.querySelectorAll('[data-type]');
    let arrayFilters = new Set()

    //csrf Token
    let token_input = document.querySelector('[data-form-input="token"]');
    data.csrf = token_input.value || undefined;

    /*
    DEVNOTE: The following loop is a mess and reaaally redundant. Specially the 'switch case list' part where its parsing and stringifying multiple times. Need to optimize it in the future...
    Its this way cuz it needs to compare the info between two arrays (DB and input). Tried with sets, didnt work; and lets avoid making yet another loop inside this loop.

    ## default_value: The main redundancy lies with sorting and parsing. The data from server comes as a string. The order from DB is not garanteed, specially if the document has been created manually. Right now its parsing a string, ordering it and stringifying it for the comparison.

    ## current_value: Since the input is an actual <ul>, the data comes from an array of [data-tags] that has not been declared yet. Right now, its declaring the array of inputs, sorting it, stringifying it, and in case of a difference, sending it as a string, and parsing it in server for DB storage.

    */

    let noti_count = 0 //to check for emtpy input fields. Used for stopping request sending to API

    Array.from(payload_array).forEach(input => {
        //check for changed value. If true, run the following:
        let default_value;
        let current_value;


        //empty field check
        try {
            if (input.value === '') {
                throw new Error()
            }
        } catch (err) {
            noti_count++
            let label = document.querySelector(`label[for=${input.id}]`);
            label.style.color = 'red'
        }

        switch (input.dataset.type) {
            case 'list':
                (input.dataset.defaultValue) ? default_value = JSON.stringify(Array.from(JSON.parse(input.dataset.defaultValue)).sort((a, b) => { return a - b })) : undefined;
                current_value = JSON.stringify(Array.from(input.querySelectorAll('[data-tag]')).map(tag => { return +tag.dataset.tag }).sort((a, b) => { return a - b }));
                break;
            case 'checkbox':
                (input.dataset.defaultValue) ? default_value = JSON.parse(input.dataset.defaultValue) : undefined
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

        if (input.dataset.type == 'list') {
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

    //set match and $set if updating product
    let _id_input = document.querySelector('[data-form-input="_id"]');
    if (_id_input) {
        data.match = { _id: _id_input.value || undefined };
        let $set = data.payload;

        delete data.payload

        data.payload = { $set: $set }
    }

    //create data.arrayFilters if necessary
    if (arrayFilters.size > 0) {
        data.arrayFilters = Array.from(arrayFilters).map(entry => { return JSON.parse(entry) })
    }

    //Stop request send if any notification or no change
    if (Object.keys(data.payload).length == 0 || noti_count > 0) {

        if (Object.keys(data.payload).length == 0 && noti_count == 0) {
            notification_creator(langData.error.no_change[lang])
        } else {
            notification_creator(langData.error.empty_field[lang])
        }

        return;
    }

    //send to API
    if (eventDispatcherCheck) {return}
    eventDispatcherCheck = true;
    debounce(send_to_api(edit_form, data), debounce_delay)
}


/*------------------------------------------------------------------------*\
++ MAIN PAYLOAD: product delete
\*------------------------------------------------------------------------*/

let delete_product_btn = document.querySelector('[data-api-button="product_delete"]')

if (delete_product_btn) {

    let modal = document.querySelector(`[data-product-modal='${delete_product_btn.dataset.apiButton}']`)

    delete_product_btn.addEventListener('click', () => {
        modal.showModal()
    })

    let close_modal_btn = modal.querySelector('[data-modal-close]') 

    close_modal_btn.addEventListener('click', () => {
        modal.close()
    })

    let send_modal_btn = modal.querySelector('[data-modal-send]')

    send_modal_btn.addEventListener('click', () => {
        let form = modal.querySelector('[data-modal-form]')
        delete_request(form)
    })
    
}

function delete_request(form) {
    let token = form.querySelector('input[name="token"]');
    let _id = form.querySelector('input[name="_id"]')
    let delete_data = {
        csrf: token.value,
        _id: _id.value
    };

    //send to API
    if (eventDispatcherCheck) {return}
    eventDispatcherCheck = true;
    debounce(send_to_api(form, delete_data), debounce_delay)

}
/*------------------------------------------------------------------------*\
++ LISTING PAYLOAD: Listing management
\*------------------------------------------------------------------------*/

//### Open and Close modal
let add_listing_btn = document.querySelector('[data-api-button="listing_create"]');
let delete_listing_btn = document.querySelectorAll('[data-api-button="listing_delete"]');
let close_listing_modal_btn = document.querySelectorAll('[data-listing-modal-close]')

if (add_listing_btn) {
    add_listing_btn.addEventListener('click', () => {
        let target = document.querySelector(`[data-listing-modal=${add_listing_btn.dataset.apiButton}]`)

        target.showModal()
    })

}

delete_listing_btn.forEach(btn => {
    btn.addEventListener('click', () => {
        let target = document.querySelector(`[data-listing-modal=${btn.dataset.apiButton}]`);
        let sku_field_update = target.querySelector('input[name="sku"]')

        sku_field_update.value = btn.dataset.sku

        target.showModal()
    })
})

close_listing_modal_btn.forEach(btn => {
    btn.addEventListener('click', () => {
        let target = document.querySelector(`[data-listing-modal=${btn.dataset.listingModalClose}]`)

        target.close()
    })
})

/*### form submit*/
let listing_form = document.querySelectorAll('[data-listing-form]')

////disable default form submit
listing_form.forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        return;
    })
})

/*### form process */
let listing_form_submit_btn = document.querySelectorAll('[data-listing-modal-send]');

listing_form_submit_btn.forEach(btn => {
    btn.addEventListener('click', () => {
        let target_form = document.querySelector(`[data-listing-form=${btn.dataset.listingModalSend}]`);
        listing_request(target_form)
    })
})

function listing_request(form_node) {
    let input_arr = form_node.querySelectorAll('input');
    let listing_data = {};

    let payload_template = {
        token: (input) => {
            listing_data.csrf = input.value
        },
        _id: (input) => {
            listing_data.match = { [input.name]: input.value }
        },
        listing_create: (input) => {
            listing_data.payload = {
                $push: { listing: { [input.name]: input.value } }
            };
            listing_data.validate_sku = input.value
        },
        listing_delete: (input) => {
            listing_data.payload = { $pull: { listing: { [input.name]: input.value } } }
        }
    }

    Array.from(input_arr).forEach(input => {
        payload_template[input.dataset.formInput](input)
    })

    //send to API
    if (eventDispatcherCheck) {return}
    eventDispatcherCheck = true;
    debounce(send_to_api(form_node, listing_data), debounce_delay)
}

/*------------------------------------------------------------------------*\
++ API ENDPOINT
\*------------------------------------------------------------------------*/

/*### send to API*/
function send_to_api(form, data) {
    let xhr = new XMLHttpRequest();
    let endpoint = form.getAttribute('action');
    let method = form.getAttribute('method');

    xhr.open(method, endpoint);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onload = () => {
        if (xhr.status === 200 ) {
            let response = JSON.parse(xhr.responseText)
            if (response.redirect_url) {
                window.location.href = response.redirect_url
            }
        }
    }
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
            eventDispatcherCheck = false;
        }, delay);
    };
};

/*------------------------------------------------------------------------*\
++ NOTIFICATIONS
\*------------------------------------------------------------------------*/

/*### Notificiation creator*/
function notification_creator(err_msg) {
    let noti_container = document.querySelector('[data-noti-container]');
    let noti_msg = new HTML_ELEM('p');

    noti_msg.addClass('orange');

    let noti_i = noti_msg.addElement('i');
    noti_i.addClass('fa-solid');
    noti_i.addClass('fa-triangle-exclamation');

    let noti_text = noti_msg.addElement('span');
    noti_text.addText(` ${err_msg}`);

    noti_container.appendChild(noti_msg.getElement());
}
