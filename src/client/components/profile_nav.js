let path = window.location.pathname;
let route_regex = /^\/[^?]+/
let route = path.match(route_regex);

let active_li = route[0];

let active_menu = document.querySelector(`[data-profile-active='${active_li}']`)
active_menu.classList.add('active')