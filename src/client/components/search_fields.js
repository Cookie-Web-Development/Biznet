//(from api) 
let search_fields_lang = document.documentElement.getAttribute('lang');
// search_fields = !{JSON.stringify(search_fields)}
// quick_query = !{JSON.stringify(quick_query)}

//### PRICE RANGE ###
let min_slider = document.getElementById('min_range_slider');
let max_slider = document.getElementById('max_range_slider');
let price_range_display = document.getElementById('price_range_display');
let range_slider_visual = document.getElementById('range_slider_visual');
let price_range_db = search_fields.price_range;

[min_slider, max_slider].forEach(input => {
    Object.assign(input, {
        min : price_range_db.min,
        max : price_range_db.max,
        value: input === min_slider ? search_query.price_range_min || price_range_db.min : search_query.price_range_max || price_range_db.max 
    })
});

displayPriceRange();

min_slider.addEventListener('input', () => {
    if(+min_slider.value > +max_slider.value) {
        min_slider.value = max_slider.value
    };
    displayPriceRange()
});

max_slider.addEventListener('input', () => {
    if(+max_slider.value < +min_slider.value) {
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

//### TAGS FILTER ###
let tags_db = search_fields.tags;
let tags_select_container = document.getElementById('selected_tags');
let tags_dropdown = document.getElementById('tags_dropdown');
let tags_text_filter = document.getElementById('tags_filter_input')
let unselectedTags = [...tags_db];
let tags_selected;
 
if (search_query.selected_tags) {
    search_query.selected_tags.forEach(entry => { //Si hay seach_session, agrega a tags_selected
        tags_selected ? tags_selected.push(...tags_db.filter((tag) => {return tag.tag_id == entry})) : tags_selected = tags_db.filter((tag) => {return tag.tag_id == entry});
    })

    tags_selected.forEach(tagId_selected => { //Si hay seach_session, elimina de unselectedTags
        unselectedTags = unselectedTags.filter((tag_unselected) => {return tag_unselected.tag_id != tagId_selected.tag_id});
    })
} else {
    tags_selected = [];
}

tagListCreator()

tags_text_filter.addEventListener('input', () => {
let input = tags_text_filter.value.toLowerCase();
let options = tags_dropdown.options;
if (input != ''){
    for (let i = 0; i < options.length; i++) {
        let tag = options[i];
        let tagText = tag.text.toLowerCase();   
        if (tagText.includes(input)){
            tag.style.display = ''
        } else {
            tag.style.display ='none'
        }
    }                    
} else {
    for(let i = 0; i < options.length; i++) {
        let tag = options[i];
        tag.style.display = '';
    }
}
})

tags_dropdown.addEventListener('click', (e) => { //adding tags
    let target = tags_dropdown.selectedOptions[0]
    if(target.dataset.tag) {

        //Arrays updater
        unselectedTags = unselectedTags.filter(tag => tag.tag_id != target.dataset.tag);

        tags_selected = [...tags_selected, ...tags_db.filter(tag =>tag.tag_id == target.dataset.tag)]

        tagListCreator();
        
        //Clear elements after selection
        let container = Array.from(document.getElementById('tags_input_dropdown_container').children);
        container.forEach(elem => {
            elem.blur()
        });
        tags_text_filter.value = '';
    };

});

tags_select_container.addEventListener('click', (e) => { //deleting tags
    
    if(e.target.dataset.tag) {
        let tag_target = tags_db.filter((tag) => {return tag.tag_id == e.target.dataset.tag});
        tags_selected = tags_selected.filter((tag) => {return tag.tag_id != e.target.dataset.tag});

        unselectedTags = [...unselectedTags, ...tag_target];

        unselectedTags.sort((a, b) => {
            if (a.name[search_fields_lang] > b.name[search_fields_lang]){
                return 1
            }
            if (a.name[search_fields_lang] < b.name[search_fields_lang]) {
                return -1
            }

            return 0
        });
        
        tagListCreator();
        tags_dropdown.dispatchEvent(new Event(eventAPI))
    }
    
})


function tagListCreator() {
    let dropdown_children = Array.from(tags_dropdown.querySelectorAll('[data-tag]'));
    let tag_select_children = Array.from(tags_select_container.children);

    //Elements remover
    dropdown_children.forEach(child => { child.remove() });
    tag_select_children.forEach(child => { child.remove() });

    //Elements creator
    if(unselectedTags.length > 0){

        unselectedTags.forEach(tag_unselected => {
            let option = document.createElement('option');
            option.value = tag_unselected.tag_id;
            option.text= tag_unselected.name[search_fields_lang];
            option.dataset.tag = tag_unselected.tag_id;
            tags_dropdown.appendChild(option);
        });
    }

    if(tags_selected.length > 0) {
        tags_selected.forEach(tag => {
            let selection_item = document.createElement('li');
            let selection_label = document.createElement('label');
            let selection_checkbox = document.createElement('input');
            let selection_text = document.createElement('span');
            
            selection_item.classList.add('selected_tag');
            selection_checkbox.type = 'checkbox';
            selection_checkbox.setAttribute('checked', true);
            selection_checkbox.value = tag.tag_id;
            selection_checkbox.dataset.tag = tag.tag_id;
            selection_checkbox.name = 'selected_tags';
            selection_text.textContent = tag.name[search_fields_lang];

            selection_label.appendChild(selection_checkbox);
            selection_label.appendChild(selection_text);
            selection_item.appendChild(selection_label);

            tags_select_container.appendChild(selection_item);
        });
    };
};

//### RESET SEARCH BUTTON ###
let resetBtn = document.getElementById('search_field_reset')
            
resetBtn.addEventListener('click', () => {
    let inputElements = Array.from(document.querySelectorAll('[data-reset]'))
    unselectedTags = [...tags_db];
    tags_selected = [];
    tagListCreator();
    inputElements.forEach(input => {
        switch(input.dataset.reset){
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

//### SEARCH EXPAND BTN FOR RESPONSIVE WEB DESIGN ###
let search_fields_toggle_target = document.getElementById('catalog_search_form');
let search_fields_toggle_btn = document.getElementById('search_fields_toggle');

search_fields_toggle_btn.addEventListener('click', () => {
    search_fields_toggle_btn.classList.toggle('active');
    search_fields_toggle_target.classList.toggle('active')
})

