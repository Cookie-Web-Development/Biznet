"use strict";

require("core-js/modules/es.object.to-string.js");
require("core-js/modules/web.dom-collections.for-each.js");
//## Thumbnail selector
var image_route = '/public/img/products-images/';
var thumbnail_select = document.querySelectorAll('[data-thumbnail]');
var thumbnail_target = document.querySelector('[data-thumbnail-target]');
if (thumbnail_select.length > 0) {
  thumbnail_select[0].classList.add('active');
}
thumbnail_select.forEach(function (thumbnail) {
  thumbnail.addEventListener('click', function (e) {
    thumbnail_target.setAttribute('src', "".concat(image_route).concat(e.target.dataset.thumbnail));
    thumbnail_select.forEach(function (select) {
      select.classList.remove('active');
    });
    e.target.classList.add('active');
  });
});

//## Image Modal
var image_display_modal = document.getElementById('image_display_modal');
var modal_image = document.getElementById('modal_image');
thumbnail_target.addEventListener('click', function (e) {
  modal_image.setAttribute('src', "".concat(e.target.src));
  image_display_modal.showModal();
});

// close modal when clicking anywhere
image_display_modal.addEventListener('click', function () {
  image_display_modal.close();
});