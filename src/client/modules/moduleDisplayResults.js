'use strict';

import { HTML_ELEM } from './moduleHTMLElemMaker.js';


//result_container = html div element parent
export function display_results (result_arr, lang, result_container) {
    
    //Element Remover
    Array.from(result_container.children).forEach(child => {
        child.remove()
    });

    if(result_arr.length === 0) { //PENDING HTML_ELEM
        const nothing_here = new HTML_ELEM('p');
        nothing_here.addText('Nothing Here');
        result_container.appendChild(nothing_here.getElement())
        return;
    }

    result_arr.forEach(product => {       
        const product_card = new HTML_ELEM('article');
        product_card.addAttribute('data-product-card', 'small');

        const image_container = product_card.addElement('a');
        image_container.addClass('image_container');
        image_container.addAttribute('href', `/product/${product._id}`);
        
        const image_elem = image_container.addElement('img');
        image_elem.addAttribute('src', `/public/img/products-images/${product.listing[0].images[0]}`)

        const text_container = product_card.addElement('div');
        text_container.addClass('text_container');

        const text_header = text_container.addElement('p');
        text_header.addClass('text_container_header');
        
        const text_header_anchor_category = text_header.addElement('a');
        text_header_anchor_category.addAttribute('href', `/catalog?category=${product.category_id}`);
        text_header_anchor_category.addText(`${product.category_name[lang]}`);

        text_header.getElement().appendChild(document.createTextNode(' / '));
        
        const text_header_anchor_brand = text_header.addElement('a');
        text_header_anchor_brand.addAttribute('href', `/catalog?brand=${product.brand_id}`);
        text_header_anchor_brand.addText(`${product.brand_name}`);

        const text_name = text_container.addElement('h3');
        const text_name_link = text_name.addElement('a');
        text_name_link.addText(`${product.product_name[lang]}`);
        text_name_link.addAttribute('href', `/product/${product._id}`)

        const price_container = text_container.addElement('a');
        price_container.addClass('product_card_price_tag');
        price_container.addAttribute('href', `/product/${product._id}`);

        const price_value = price_container.addElement('p');
        price_value.addClass('price_sell');
        price_value.addText(`${product.listing[0].format_price_discounted}`);

        if (product.listing[0].discount_percent > 0) {
            const price_discount = price_container.addElement('p');
            price_discount.addClass('price_discount');

            const price_before = price_discount.addElement('span');
            price_before.addClass('price_before');
            price_before.addText(`${product.listing[0].format_price}`);
            
            const discount_percent = price_discount.addElement('span');
            discount_percent.addClass('discount_percent');
            discount_percent.addText(`${Math.round(product.listing[0].discount_percent * 100)}%`);
        }

        const text_description = text_container.addElement('p');
        text_description.addClass('product_card_description');
        text_description.addText(`${product.description[lang]}`);

        const tags_list = text_container.addElement('ul');
        tags_list.addClass('product_card_tags');

        product.tag_array.forEach(tag => {
            let text_tag = tags_list.addElement('li');
            let anchor_tag = text_tag.addElement('a');
            anchor_tag.addText(tag.tag_name[lang]);
            anchor_tag.addAttribute('href', `/catalog?selected_tags=${tag.tag_id}`);
        })

        result_container.appendChild(product_card.getElement());
    });


};

