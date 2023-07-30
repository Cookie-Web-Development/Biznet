'use strict';

import { HTML_ELEM } from './moduleHTMLElemMaker.js';

export function display_pagination ( active_page, total_pages, pagination_container, pagination_type = undefined ) {

    //element remover
    Array.from(pagination_container.children).forEach(child => child.remove());

    let pagination_active_page = active_page || 1;

    let pagination_arr = [];

    if(pagination_active_page !== 1) {
        pagination_arr.push('prev')
    };

    pagination_arr.push(1);
    //console.log('active_page', active_page)

    for(let i = -3; i <= 3; i++ ) {
        let result = pagination_active_page + i;
        if ((i === -3 && result > 2) || ( i === 3 && result < total_pages - 1 )) {
            pagination_arr.push('...')
        } else {
            if (result >= 2 && result < total_pages) {
                pagination_arr.push(result)
            }
        }
    }

    pagination_arr.push(total_pages)
    
    if(pagination_active_page !== total_pages) {
        pagination_arr.push('next')
    }

    if (pagination_arr.length <= 1) {
        pagination_container.style.display = 'none';
        return;
    };

    pagination_arr.forEach(page => {
        let create_elem;
        switch(page){
            case pagination_active_page: //Plans for this, later
                create_elem = new HTML_ELEM('p');
                create_elem.addAttribute('id', 'page_current')
                create_elem.addText(page)
                break;
            case '...':
                create_elem = new HTML_ELEM('p');
                create_elem.addText(page);
                break;
            default: 
                create_elem = new HTML_ELEM('button');
                create_elem.addClass('button')
                create_elem.addClass('button_pagination');
                create_elem.addAttribute('type', 'button')
                create_elem.addAttribute('data-page-value', page);
                if (page == "prev" || page == "next") {
                    let arrow = create_elem.addElement('i');
                    arrow.addClass('fa-solid');
                    (page == 'prev') ? arrow.addClass('fa-chevron-left') : arrow.addClass('fa-chevron-right')
                } else {
                    create_elem.addText(page);
                }
        }
        pagination_container.appendChild(create_elem.getElement())
    });
}