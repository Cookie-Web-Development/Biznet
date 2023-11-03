let path = window.location.pathname;
let route_regex = /^\/[^?]+/
let route = path.match(route_regex);

let active_li = route[0];

if (active_li === '/profile/password') {
    active_li = '/profile'
}

let active_menu = document.querySelector(`[data-profile-active='${active_li}']`)
active_menu.classList.add('active')