'use strict';

/*--------------------------------------------------------------------------*\
++ Notification bar
\*--------------------------------------------------------------------------*/
// remove notification when clicked
let noti_bar_container = document.querySelector('[data-noti-container]');

noti_bar_container.addEventListener('click', (e) => {
    //remove notifications on click
    if(Array.from(noti_bar_container.children).length > 0) {
        noti_bar_container.removeChild(e.target)
    }
})