'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.display_pagination = display_pagination;
require("core-js/modules/es.object.to-string.js");
require("core-js/modules/web.dom-collections.for-each.js");
require("core-js/modules/es.array.from.js");
require("core-js/modules/es.string.iterator.js");
var _moduleHTMLElemMaker = require("./moduleHTMLElemMaker.js");
function display_pagination(active_page, total_pages, pagination_container) {
  var pagination_type = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
  //element remover
  Array.from(pagination_container.children).forEach(function (child) {
    return child.remove();
  });
  var pagination_active_page = active_page || 1;
  var pagination_arr = [];
  if (pagination_active_page !== 1) {
    pagination_arr.push('prev');
  }
  ;
  pagination_arr.push(1);
  //console.log('active_page', active_page)

  for (var i = -3; i <= 3; i++) {
    var result = pagination_active_page + i;
    if (i === -3 && result > 2 || i === 3 && result < total_pages - 1) {
      pagination_arr.push('...');
    } else {
      if (result >= 2 && result < total_pages) {
        pagination_arr.push(result);
      }
    }
  }
  pagination_arr.push(total_pages);
  if (pagination_active_page !== total_pages) {
    pagination_arr.push('next');
  }
  if (pagination_arr.length <= 1) {
    pagination_container.style.display = 'none';
    return;
  }
  ;
  pagination_arr.forEach(function (page) {
    var create_elem;
    switch (page) {
      case pagination_active_page:
        //Plans for this, later
        create_elem = new _moduleHTMLElemMaker.HTML_ELEM('p');
        create_elem.addAttribute('id', 'page_current');
        create_elem.addText(page);
        var mobile_pagination_span = create_elem.addElement('span');
        mobile_pagination_span.addAttribute('data-pagination-responsive', 'mobile');
        mobile_pagination_span.addText("/".concat(total_pages));
        break;
      case '...':
        create_elem = new _moduleHTMLElemMaker.HTML_ELEM('p');
        create_elem.addAttribute('data-pagination-responsive', 'desktop');
        create_elem.addText(page);
        break;
      default:
        create_elem = new _moduleHTMLElemMaker.HTML_ELEM('button');
        create_elem.addClass('button');
        create_elem.addClass('button_pagination');
        create_elem.addAttribute('type', 'button');
        create_elem.addAttribute('data-page-value', page);
        if (page == "prev" || page == "next") {
          var arrow = create_elem.addElement('i');
          arrow.addClass('fa-solid');
          page == 'prev' ? arrow.addClass('fa-chevron-left') : arrow.addClass('fa-chevron-right');
        } else {
          create_elem.addText(page);
          create_elem.addAttribute('data-pagination-responsive', 'desktop');
        }
    }
    pagination_container.appendChild(create_elem.getElement());
  });
}