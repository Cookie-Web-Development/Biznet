"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
//(from api) 
// lang = !{JSON.stringify(lang)}
// search_fields = !{JSON.stringify(search_fields)}
// quick_query = !{JSON.stringify(quick_query)}

//### PRICE RANGE ###
var min_slider = document.getElementById('min_range_slider');
var max_slider = document.getElementById('max_range_slider');
var price_range_display = document.getElementById('price_range_display');
var range_slider_visual = document.getElementById('range_slider_visual');
var price_range_db = search_fields.price_range;
[min_slider, max_slider].forEach(function (input) {
  Object.assign(input, {
    min: price_range_db.min,
    max: price_range_db.max,
    value: input === min_slider ? search_query.price_range_min || price_range_db.min : search_query.price_range_max || price_range_db.max
  });
});
displayPriceRange();
min_slider.addEventListener('input', function () {
  if (+min_slider.value > +max_slider.value) {
    min_slider.value = max_slider.value;
  }
  ;
  displayPriceRange();
});
max_slider.addEventListener('input', function () {
  if (+max_slider.value < +min_slider.value) {
    max_slider.value = min_slider.value;
  }
  ;
  displayPriceRange();
});
function displayPriceRange() {
  var minRange = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : min_slider.value;
  var maxRange = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : max_slider.value;
  var blue = 'hsl(238, 83%, 62%)',
    grey = 'hsl(360, 0%, 35%)';
  var minCalc = minRange / price_range_db.max * 100,
    maxCalc = maxRange / price_range_db.max * 100;
  range_slider_visual.style.background = "linear-gradient(to right, ".concat(grey, " 0%, ").concat(grey, " ").concat(minCalc, "%, ").concat(blue, " ").concat(minCalc, "%, ").concat(blue, " ").concat(maxCalc, "%, ").concat(grey, " ").concat(maxCalc, "%, ").concat(grey, " 100%)");
  price_range_display.textContent = "$ ".concat(minRange, " - $ ").concat(maxRange);
}
;

//### TAGS FILTER ###
var tags_db = search_fields.tags;
var tags_select_container = document.getElementById('selected_tags');
var tags_dropdown = document.getElementById('tags_dropdown');
var tags_text_filter = document.getElementById('tags_filter_input');
var unselectedTags = _toConsumableArray(tags_db);
var tags_selected;
if (search_query.selected_tags) {
  search_query.selected_tags.forEach(function (entry) {
    var _tags_selected;
    //Si hay seach_session, agrega a tags_selected
    tags_selected ? (_tags_selected = tags_selected).push.apply(_tags_selected, _toConsumableArray(tags_db.filter(function (tag) {
      return tag.tag_id == entry;
    }))) : tags_selected = tags_db.filter(function (tag) {
      return tag.tag_id == entry;
    });
  });
  tags_selected.forEach(function (tagId_selected) {
    //Si hay seach_session, elimina de unselectedTags
    unselectedTags = unselectedTags.filter(function (tag_unselected) {
      return tag_unselected.tag_id != tagId_selected.tag_id;
    });
  });
} else {
  tags_selected = [];
}
tagListCreator();
tags_text_filter.addEventListener('input', function () {
  var input = tags_text_filter.value.toLowerCase();
  var options = tags_dropdown.options;
  if (input != '') {
    for (var i = 0; i < options.length; i++) {
      var tag = options[i];
      var tagText = tag.text.toLowerCase();
      if (tagText.includes(input)) {
        tag.style.display = '';
      } else {
        tag.style.display = 'none';
      }
    }
  } else {
    for (var _i = 0; _i < options.length; _i++) {
      var _tag = options[_i];
      _tag.style.display = '';
    }
  }
});
tags_dropdown.addEventListener('click', function (e) {
  //adding tags
  var target = tags_dropdown.selectedOptions[0];
  if (target.dataset.tag) {
    //Arrays updater
    unselectedTags = unselectedTags.filter(function (tag) {
      return tag.tag_id != target.dataset.tag;
    });
    tags_selected = [].concat(_toConsumableArray(tags_selected), _toConsumableArray(tags_db.filter(function (tag) {
      return tag.tag_id == target.dataset.tag;
    })));
    tagListCreator();

    //Clear elements after selection
    var container = Array.from(document.getElementById('tags_input_dropdown_container').children);
    container.forEach(function (elem) {
      elem.blur();
    });
    tags_text_filter.value = '';
  }
  ;
});
tags_select_container.addEventListener('click', function (e) {
  //deleting tags

  if (e.target.dataset.tag) {
    var tag_target = tags_db.filter(function (tag) {
      return tag.tag_id == e.target.dataset.tag;
    });
    tags_selected = tags_selected.filter(function (tag) {
      return tag.tag_id != e.target.dataset.tag;
    });
    unselectedTags = [].concat(_toConsumableArray(unselectedTags), _toConsumableArray(tag_target));
    unselectedTags.sort(function (a, b) {
      if (a.name[lang] > b.name[lang]) {
        return 1;
      }
      if (a.name[lang] < b.name[lang]) {
        return -1;
      }
      return 0;
    });
    tagListCreator();
    tags_dropdown.dispatchEvent(new Event(eventAPI));
  }
});
function tagListCreator() {
  var dropdown_children = Array.from(tags_dropdown.querySelectorAll('[data-tag]'));
  var tag_select_children = Array.from(tags_select_container.children);

  //Elements remover
  dropdown_children.forEach(function (child) {
    child.remove();
  });
  tag_select_children.forEach(function (child) {
    child.remove();
  });

  //Elements creator
  if (unselectedTags.length > 0) {
    unselectedTags.forEach(function (tag_unselected) {
      var option = document.createElement('option');
      option.value = tag_unselected.tag_id;
      option.text = tag_unselected.name[lang];
      option.dataset.tag = tag_unselected.tag_id;
      tags_dropdown.appendChild(option);
    });
  }
  if (tags_selected.length > 0) {
    tags_selected.forEach(function (tag) {
      var selection_item = document.createElement('li');
      var selection_label = document.createElement('label');
      var selection_checkbox = document.createElement('input');
      var selection_text = document.createElement('span');
      selection_item.classList.add('selected_tag');
      selection_checkbox.type = 'checkbox';
      selection_checkbox.setAttribute('checked', true);
      selection_checkbox.value = tag.tag_id;
      selection_checkbox.dataset.tag = tag.tag_id;
      selection_checkbox.name = 'selected_tags';
      selection_text.textContent = tag.name[lang];
      selection_label.appendChild(selection_checkbox);
      selection_label.appendChild(selection_text);
      selection_item.appendChild(selection_label);
      tags_select_container.appendChild(selection_item);
    });
  }
  ;
}
;

//### RESET SEARCH BUTTON ###
var resetBtn = document.getElementById('search_field_reset');
resetBtn.addEventListener('click', function () {
  var inputElements = Array.from(document.querySelectorAll('[data-reset]'));
  unselectedTags = _toConsumableArray(tags_db);
  tags_selected = [];
  tagListCreator();
  inputElements.forEach(function (input) {
    switch (input.dataset.reset) {
      case 'text':
        input.value = '';
        break;
      case 'select':
        input.selectedIndex = 0;
        break;
      case 'checkbox':
        input.checked = false;
        break;
      case 'range_min':
        input.value = price_range_db.min;
        displayPriceRange();
        break;
      case 'range_max':
        input.value = price_range_db.max;
        displayPriceRange();
        break;
      default:
        console.log('something wrong with resetBtn');
    }
    ;
    input.dispatchEvent(new Event('input'));
  });
});

//### SEARCH TOGGLE ###
var search_fields_toggle_target = document.getElementById('catalog_search_form');
var search_fields_toggle_btn = document.getElementById('search_fields_toggle');
search_fields_toggle_btn.addEventListener('click', function () {
  search_fields_toggle_btn.classList.toggle('active');
  search_fields_toggle_target.classList.toggle('active');
});