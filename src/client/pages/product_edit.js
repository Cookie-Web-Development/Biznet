'use strict';

import { HTML_ELEM } from '../modules/moduleHTMLElemMaker.js';
let lang = document.documentElement.getAttribute('lang');

/*------------------------------------------------------------------------*\
++ TAGS LIST
\*------------------------------------------------------------------------*/

let tag_list = document.querySelector('[data-tag-list]');
let tag_selected_container = document.querySelector('[data-tag-selected]');
let tag_search = document.querySelector('[data-tag-search]');

let selected_tags = Array.from(JSON.parse(tag_selected_container.dataset.defaultValue)) || []

/*### Initial Tags load */
if (selected_tags.length > 0) {
    selected_tags_creator(selected_tags)
}

/*### Event Listeners */
tag_list.addEventListener('click', (e) => {
    selected_tags.push(+e.target.value);
    selected_tags.sort((a, b) => a - b);
    selected_tags_creator(selected_tags);
    
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
    let unselected_options =  tag_list.querySelectorAll('[data-selected="false"]')
    if (input != ''){
        for (let i = 0; i < unselected_options.length; i++) {
            let tag = unselected_options[i];
            let tagText = tag.text.toLowerCase();   
            if (tagText.includes(input)){
                tag.style.display = ''
            } else {
                tag.style.display ='none'
            }
        }                    
    } else {
        for(let i = 0; i < unselected_options.length; i++) {
            let tag = unselected_options[i];
            tag.style.display = '';
        }
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
        return [ match[0].value, match[0].innerText]
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