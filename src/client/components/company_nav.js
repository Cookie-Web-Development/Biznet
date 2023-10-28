'use strict'

let nav_title = document.querySelectorAll('[data-nav-title]')
let nav_list = document.querySelectorAll('[data-nav-list]')

nav_title.forEach(title => {
    title.addEventListener('click', () => {
        nav_list.forEach(list => {
            list.classList.toggle('expanded')
        })
    })
})