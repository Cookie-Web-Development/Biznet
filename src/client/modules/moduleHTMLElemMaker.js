'use strict'

//html object constructor
export function HTML_ELEM(html_tag) {
    const element = document.createElement(html_tag);
  
    this.addElement = function (childTag) {
      const childElement = new HTML_ELEM(childTag);
      element.appendChild(childElement.getElement());
      return childElement;
    };
  
    this.addClass = function (class_name) {
      element.classList.add(class_name);
    };
  
    this.addAttribute = function (attribute_name, attribute_value = undefined) {
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
