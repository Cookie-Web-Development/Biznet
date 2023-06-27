let disclaimer = document.getElementById('disclaimer_modal');
let disclaimer_close = document.getElementById('disclaimer_close');
let disclaimer_lang_select = Array.from(document.querySelectorAll('[data-disclaimer-select]'));
let disclaimer_section = Array.from(document.querySelectorAll('[data-disclaimer]'));

disclaimer_lang_select.forEach(selector => {
    selector.addEventListener('click', () => {
        disclaimer_selection_function(selector.dataset.disclaimerSelect);
    })
})

disclaimer_close.addEventListener('click', () => {
    sessionStorage.setItem('disclaimerAgreed', true)
    disclaimer.close();
})

document.addEventListener('DOMContentLoaded', () => { 
    disclaimer_selection_function(disclaimer.dataset.disclaimerLang);
    let disclaimer_session = sessionStorage.getItem('disclaimerAgreed') || false;
    if(!disclaimer_session) {
        disclaimer.showModal();
    }
})

function disclaimer_selection_function (language) {

    disclaimer_lang_select.forEach(selector => {
        selector.classList.remove('active');
        if(selector.dataset.disclaimerSelect == language) {
            selector.classList.add('active')
        }
    });

    disclaimer_section.forEach(section => {
        section.classList.remove('active');
        if(section.dataset.disclaimer == language) {
            section.classList.add('active')
        }
    });

    //button text content
    switch (language) {
        case 'en' :
            disclaimer_close.textContent = 'I understand'
            break;
        default: 
            disclaimer_close.textContent = 'Entendido';
    }
}