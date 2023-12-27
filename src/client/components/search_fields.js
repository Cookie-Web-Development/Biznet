'use strict';

import { HTML_ELEM } from "../modules/moduleHTMLElemMaker.js"
/*------------------------------------------------------------*\
++ -FROM API
\*------------------------------------------------------------*/
let search_fields_lang = document.documentElement.getAttribute('lang');
let search_fields_section = document.querySelector('[data-search-fields]');
let search_fields = JSON.parse(search_fields_section.dataset.searchFields)
let quick_query = JSON.parse(search_fields_section.dataset.quickQuery)
let search_query = {};
//search_query is declared in /pages/catalog_api.js


/*------------------------------------------------------------*\
++ -PRICE RANGE
\*------------------------------------------------------------*/
let min_slider = document.getElementById('min_range_slider');
let max_slider = document.getElementById('max_range_slider');
let price_range_display = document.getElementById('price_range_display');
let range_slider_visual = document.getElementById('range_slider_visual');
let price_range_db = search_fields.price_range;

[min_slider, max_slider].forEach(input => {
    Object.assign(input, {
        min: price_range_db.min,
        max: price_range_db.max,
        value: input === min_slider ? search_query.price_range_min || price_range_db.min : search_query.price_range_max || price_range_db.max
    })
});

displayPriceRange();

min_slider.addEventListener('input', () => {
    if (+min_slider.value > +max_slider.value) {
        min_slider.value = max_slider.value
    };
    displayPriceRange()
});

max_slider.addEventListener('input', () => {
    if (+max_slider.value < +min_slider.value) {
        max_slider.value = min_slider.value
    };
    displayPriceRange()
});

function displayPriceRange(minRange = min_slider.value, maxRange = max_slider.value) {
    let blue = 'hsl(238, 83%, 62%)', grey = 'hsl(360, 0%, 35%)';
    let minCalc = (minRange / price_range_db.max) * 100,
        maxCalc = (maxRange / price_range_db.max) * 100;

    range_slider_visual.style.background = `linear-gradient(to right, ${grey} 0%, ${grey} ${minCalc}%, ${blue} ${minCalc}%, ${blue} ${maxCalc}%, ${grey} ${maxCalc}%, ${grey} 100%)`;

    price_range_display.textContent = `$ ${minRange} - $ ${maxRange}`
};


/*------------------------------------------------------------*\
++ -TAGS FILTER
\*------------------------------------------------------------*/
let tags_select_container = document.getElementById('selected_tags');
let tags_dropdown = document.getElementById('tags_dropdown').children;
let tags_text_filter = document.getElementById('tags_filter_input')
let tags_db = Array.from(tags_dropdown).map(child => { return { tag_id: child.dataset.tagId, tag_name_es: child.dataset.tagName_es, tag_name_en: child.dataset.tagName_en } })
let tags_selected;


if (search_query.selected_tags) {
    search_query.selected_tags.forEach(entry => { 
        //Si hay seach_session, agrega a tags_selected
        tags_selected ? tags_selected.push(...tags_db.filter((tag) => { return tag.tag_id == entry })) : tags_selected = tags_db.filter((tag) => { return tag.tag_id == entry });
    })

} else {
    tags_selected = [];
}

tagListCreator()

//++ FINDING/FILTERING TAGS ++//
tags_text_filter.addEventListener('input', () => {
    let input = tags_text_filter.value.toLowerCase();
    if (input != '') {
        //delete not found message
        let not_found_elem = document.querySelector('[data-filter]');
        if (not_found_elem) {
            not_found_elem.remove()
        }
        let result_index = 0
        
        //dropdown iteration
        Array.from(tags_dropdown).forEach(child => {
            let child_name_en = child.dataset.tagName_en.toLowerCase();
            let child_name_es = child.dataset.tagName_es.toLowerCase();

            if (!child_name_en.includes(input) && !child_name_es.includes(input)) {
                child.classList.add('hide')
            } else {
                child.classList.remove('hide')
                result_index++
            }
        })
        
        //not found message creator
        if (result_index == 0 ) {
            let not_found_msg = (search_fields_lang == 'es') ? 'Sin resultados' : 'No results' 
            let not_found = new HTML_ELEM('li')
            not_found.addText(not_found_msg)
            not_found.addAttribute('data-filter')
            document.getElementById('tags_dropdown').appendChild(not_found.getElement())
        }
    } else {
        //show all list
        Array.from(tags_dropdown).forEach(child => {
            child.classList.remove('hide')
        })
    }
})

//++ ADDING TAGS ++//
Array.from(tags_dropdown).forEach(tag => {
    tag.addEventListener('click', (e) => {
        let target_tag = { tag_id: e.target.dataset.tagId, tag_name: {en: e.target.dataset.tagName_en, es: e.target.dataset.tagName_es}}

        tags_selected.push(target_tag)        
        tags_selected.sort((a, b) => {
            if (a.tag_name[search_fields_lang] > b.tag_name[search_fields_lang]) {
                return 1
            }
            if (a.tag_name[search_fields_lang] < b.tag_name[search_fields_lang]) {
                return -1
            }
            return 0
        });

        e.target.classList.add('selected')

        tagListCreator()

        //Clear elements after selection
        Array.from(tags_dropdown).forEach(child => child.blur())
        tags_text_filter.value = '';
        tags_text_filter.dispatchEvent(new Event('input'))
    })
})

//++ REMOVING TAGS ++//
tags_select_container.addEventListener('click', (e) => {
    if (e.target.dataset.tag) {
        let dropdown_target = Array.from(tags_dropdown).find(tag => { return tag.dataset.tagId == e.target.dataset.tag})
        
        dropdown_target.classList.remove('selected')
        tags_selected = tags_selected.filter(tag => {return tag.tag_id != e.target.dataset.tag})

        tagListCreator();
    }
})

function tagListCreator() { //rename to selected_tagList_creator
    let tag_select_children = Array.from(tags_select_container.children);

    //Elements remover
    tag_select_children.forEach(child => { child.remove() });

    //Elements creator
    if (tags_selected.length > 0) {
        tags_selected.forEach(tag => {
            let selectedTag_li = new HTML_ELEM('li')
            selectedTag_li.addClass('selected_tag')
            //+label
            let selectedTag_label = selectedTag_li.addElement('label')
            //++checkbox
            let selectedTag_checkbox = selectedTag_label.addElement('input')
            selectedTag_checkbox.addAttribute('type', 'checkbox')
            selectedTag_checkbox.addAttribute('checked', true)
            selectedTag_checkbox.addAttribute('name', 'selected_tags')
            selectedTag_checkbox.addAttribute('value', tag.tag_id)
            selectedTag_checkbox.addAttribute('data-tag', tag.tag_id)
            //++text
            let selectedTag_span = selectedTag_label.addElement('span')
            selectedTag_span.addText(tag.tag_name[search_fields_lang])

            //append
            tags_select_container.appendChild(selectedTag_li.getElement())
        })
    };
    document.getElementById('tags_dropdown').dispatchEvent(new Event('input'))
};


/*------------------------------------------------------------*\
++ -RESET SEARCH BUTTON
\*------------------------------------------------------------*/
let resetBtn = document.getElementById('search_field_reset')

resetBtn.addEventListener('click', () => {
    let inputElements = Array.from(document.querySelectorAll('[data-reset]'))
    tags_selected = [];
    tagListCreator();
    inputElements.forEach(input => {
        switch (input.dataset.reset) {
            case 'text':
                input.value = '';
                break;
            case 'select':
                input.selectedIndex = 0;
                break;
            case 'checkbox':
                input.checked = false;
                break;
            case 'range_min':
                input.value = price_range_db.min;
                displayPriceRange();
                break;
            case 'range_max':
                input.value = price_range_db.max;
                displayPriceRange();
                break;
            default:
                console.log('something wrong with resetBtn')
        };

        input.dispatchEvent(new Event('input'))
    });
});


/*------------------------------------------------------------*\
++ -SEARCH EXPAND BTN FOR RESPONSIVE WEB DESIGN
\*------------------------------------------------------------*/
let search_fields_toggle_target = document.getElementById('catalog_search_form');
let search_fields_toggle_btn = document.getElementById('search_fields_toggle');

search_fields_toggle_btn.addEventListener('click', () => {
    search_fields_toggle_btn.classList.toggle('active');
    search_fields_toggle_target.classList.toggle('active')
})

