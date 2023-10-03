"use strict";

/*###########
Carousel Code
#############*/
var carouselCards = document.querySelectorAll('[data-carousel]');
if (carouselCards.length > 1) {
  // FUNCTIONS
  var carouselCurrent = function carouselCurrent(index) {
    carouselCards.forEach(function (card) {
      card.classList.remove('current');
      card.classList.remove('next');
    });
    carousel_dot.forEach(function (dot) {
      dot.classList.remove('current');
    });
    carouselCards[index].classList.add('current');
    carousel_dot[index].classList.add('current');
  };
  var carouselAnimToggle = function carouselAnimToggle(arr, index, new_index, animation_name) {
    if (document.getElementsByClassName('animation')) {
      arr.forEach(function (card) {
        card.classList.remove('animation');
      });
    }
    ;
    arr.forEach(function (card) {
      card.classList.remove('anim_to_left');
      card.classList.remove('anim_to_right');
      card.classList.remove('anim_to_top');
    });
    arr[new_index].classList.add('next');
    arr[index].classList.add(animation_name);
    arr[index].classList.add('animation');
    arr[index].addEventListener('animationend', function () {
      arr[index].classList.remove('animation');
    });
  };
  var carousel_next = document.getElementById('carousel_next');
  var carousel_prev = document.getElementById('carousel_prev');
  var carousel_dot = document.querySelectorAll('.carousel_dot');
  var cardIndex = 0;
  carouselCurrent(cardIndex);
  carousel_next.addEventListener('click', function () {
    var newIndex = cardIndex + 1;
    if (newIndex >= carouselCards.length) {
      newIndex = 0;
    }
    ;
    carouselAnimToggle(carouselCards, cardIndex, newIndex, 'anim_to_left');
    cardIndex = newIndex;
    carouselCurrent(cardIndex);
  });
  carousel_prev.addEventListener('click', function () {
    var newIndex = cardIndex - 1;
    if (newIndex < 0) {
      newIndex = carouselCards.length - 1;
    }
    carouselAnimToggle(carouselCards, cardIndex, newIndex, 'anim_to_right');
    cardIndex = newIndex;
    carouselCurrent(cardIndex);
  });

  //Carousel dots
  var dotArr = Array.from(carousel_dot);
  carousel_dot.forEach(function (dot) {
    var dotIndex = dotArr.indexOf(dot);
    dot.addEventListener('click', function () {
      carouselAnimToggle(carouselCards, cardIndex, dotIndex, 'anim_to_top');
      cardIndex = dotIndex;
      carouselCurrent(cardIndex);
    });
  });
  ;
  ;
}
;