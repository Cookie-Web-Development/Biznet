'use strict';

//html object constructor
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HTML_ELEM = HTML_ELEM;
function HTML_ELEM(html_tag) {
  var element = document.createElement(html_tag);
  this.addElement = function (childTag) {
    var childElement = new HTML_ELEM(childTag);
    element.appendChild(childElement.getElement());
    return childElement;
  };
  this.addClass = function (class_name) {
    element.classList.add(class_name);
  };
  this.addAttribute = function (attribute_name) {
    var attribute_value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
    if (attribute_value) {
      element.setAttribute(attribute_name, attribute_value);
    } else {
      element.setAttribute(attribute_name);
    }
  };
  this.addText = function (text_value) {
    element.textContent = text_value;
  };
  this.getElement = function () {
    return element;
  };
}