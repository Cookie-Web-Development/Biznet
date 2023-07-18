"use strict";

require("core-js/modules/es.array.from.js");
require("core-js/modules/es.string.iterator.js");
require("core-js/modules/es.object.to-string.js");
require("core-js/modules/web.dom-collections.for-each.js");
var disclaimer = document.getElementById('disclaimer_modal');
var disclaimer_close = document.getElementById('disclaimer_close');
var disclaimer_lang_select = Array.from(document.querySelectorAll('[data-disclaimer-select]'));
var disclaimer_section = Array.from(document.querySelectorAll('[data-disclaimer]'));
disclaimer_lang_select.forEach(function (selector) {
  selector.addEventListener('click', function () {
    disclaimer_selection_function(selector.dataset.disclaimerSelect);
  });
});
disclaimer_close.addEventListener('click', function () {
  sessionStorage.setItem('disclaimerAgreed', true);
  disclaimer.close();
});
document.addEventListener('DOMContentLoaded', function () {
  disclaimer_selection_function(disclaimer.dataset.disclaimerLang);
  var disclaimer_session = sessionStorage.getItem('disclaimerAgreed') || false;
  if (!disclaimer_session) {
    disclaimer.showModal();
  }
});
function disclaimer_selection_function(language) {
  disclaimer_lang_select.forEach(function (selector) {
    selector.classList.remove('active');
    if (selector.dataset.disclaimerSelect == language) {
      selector.classList.add('active');
    }
  });
  disclaimer_section.forEach(function (section) {
    section.classList.remove('active');
    if (section.dataset.disclaimer == language) {
      section.classList.add('active');
    }
  });

  //button text content
  switch (language) {
    case 'en':
      disclaimer_close.textContent = 'I understand';
      break;
    default:
      disclaimer_close.textContent = 'Entendido';
  }
}