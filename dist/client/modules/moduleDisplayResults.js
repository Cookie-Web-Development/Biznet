'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.display_results = display_results;
require("core-js/modules/es.object.to-string.js");
require("core-js/modules/web.dom-collections.for-each.js");
require("core-js/modules/es.array.from.js");
require("core-js/modules/es.string.iterator.js");
require("core-js/modules/es.function.name.js");
require("core-js/modules/es.symbol.js");
require("core-js/modules/es.symbol.description.js");
var _moduleHTMLElemMaker = require("./moduleHTMLElemMaker.js");
//result_container = html div element parent
function display_results(result_arr, lang, result_container) {
  //Element Remover
  Array.from(result_container.children).forEach(function (child) {
    child.remove();
  });
  if (result_arr.length === 0) {
    //PENDING HTML_ELEM
    var nothing_here = new _moduleHTMLElemMaker.HTML_ELEM('p');
    nothing_here.addText('Nothing Here');
    result_container.appendChild(nothing_here.getElement());
    return;
  }
  result_arr.forEach(function (product) {
    var product_card = new _moduleHTMLElemMaker.HTML_ELEM('article');
    product_card.addAttribute('data-product-card', 'small');
    var image_container = product_card.addElement('a');
    image_container.addClass('image_container');
    image_container.addAttribute('href', "/product/".concat(product._id));
    var image_elem = image_container.addElement('img');
    image_elem.addAttribute('src', "/public/img/products-images/".concat(product.listing[0].images[0]));
    var text_container = product_card.addElement('div');
    text_container.addClass('text_container');
    var text_header = text_container.addElement('p');
    text_header.addClass('text_container_header');
    var text_header_anchor_category = text_header.addElement('a');
    text_header_anchor_category.addAttribute('href', "/catalog?category=".concat(product.category_id));
    text_header_anchor_category.addText("".concat(product.category_name[lang]));
    text_header.getElement().appendChild(document.createTextNode(' / '));
    var text_header_anchor_brand = text_header.addElement('a');
    text_header_anchor_brand.addAttribute('href', "/catalog?brand=".concat(product.brand_id));
    text_header_anchor_brand.addText("".concat(product.brand_name));
    var text_name = text_container.addElement('h3');
    var text_name_link = text_name.addElement('a');
    text_name_link.addText("".concat(product.name[lang]));
    text_name_link.addAttribute('href', "/product/".concat(product._id));
    var price_container = text_container.addElement('a');
    price_container.addClass('product_card_price_tag');
    price_container.addAttribute('href', "/product/".concat(product._id));
    var price_value = price_container.addElement('p');
    price_value.addClass('price_sell');
    price_value.addText("".concat(product.listing[0].format_price_discounted));
    if (product.listing[0].discount_percent > 0) {
      var price_discount = price_container.addElement('p');
      price_discount.addClass('price_discount');
      var price_before = price_discount.addElement('span');
      price_before.addClass('price_before');
      price_before.addText("".concat(product.listing[0].format_price));
      var discount_percent = price_discount.addElement('span');
      discount_percent.addClass('discount_percent');
      discount_percent.addText("".concat(Math.round(product.listing[0].discount_percent * 100), "%"));
    }
    var text_description = text_container.addElement('p');
    text_description.addClass('product_card_description');
    text_description.addText("".concat(product.description[lang]));
    var tags_list = text_container.addElement('ul');
    tags_list.addClass('product_card_tags');
    product.tag_array.forEach(function (tag) {
      var text_tag = tags_list.addElement('li');
      var anchor_tag = text_tag.addElement('a');
      anchor_tag.addText(tag.name[lang]);
      anchor_tag.addAttribute('href', "/catalog?selected_tags=".concat(tag.tag_id));
    });
    result_container.appendChild(product_card.getElement());
  });
}
;