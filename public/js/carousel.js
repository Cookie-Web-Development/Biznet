/*###########
Carousel Code
#############*/
let carouselCards = document.querySelectorAll('[data-carousel]');
if (carouselCards.length > 1) { 
    let carousel_next = document.getElementById('carousel_next');
    let carousel_prev = document.getElementById('carousel_prev');
    let carousel_dot = document.querySelectorAll('.carousel_dot');

    let cardIndex = 0;
    carouselCurrent(cardIndex);
    
    carousel_next.addEventListener('click', () => {
        let newIndex = cardIndex + 1;
        if (newIndex >= carouselCards.length) {
            newIndex = 0
        };

        carouselAnimToggle(carouselCards, cardIndex, newIndex, 'anim_to_left');
        
        cardIndex = newIndex;
        carouselCurrent(cardIndex);
    });

    carousel_prev.addEventListener('click', () => {
        let newIndex = cardIndex - 1;
        if (newIndex < 0) {
            newIndex = carouselCards.length - 1
        }

        carouselAnimToggle(carouselCards, cardIndex, newIndex, 'anim_to_right');

        cardIndex = newIndex;
        carouselCurrent(cardIndex);
    })

    //Carousel dots
    let dotArr = Array.from(carousel_dot);

    carousel_dot.forEach(dot => {
        let dotIndex = dotArr.indexOf(dot);

        dot.addEventListener('click', () => {
            carouselAnimToggle(carouselCards, cardIndex, dotIndex, 'anim_to_top');
            cardIndex = dotIndex;
            carouselCurrent(cardIndex);
        })
    });

    // FUNCTIONS
    function carouselCurrent(index) {
        carouselCards.forEach(card => {
            card.classList.remove('current');
            card.classList.remove('next');
        });

        carousel_dot.forEach(dot => {
            dot.classList.remove('current')
        })
        carouselCards[index].classList.add('current');
        carousel_dot[index].classList.add('current')
    };

    function carouselAnimToggle(arr, index, new_index, animation_name) {
        if (document.getElementsByClassName('animation')) {
            arr.forEach(card => {
                card.classList.remove('animation')
            })};

        arr.forEach(card => {
            card.classList.remove('anim_to_left');
            card.classList.remove('anim_to_right');
            card.classList.remove('anim_to_top');
        })
        
        arr[new_index].classList.add('next');
        arr[index].classList.add(animation_name);
        arr[index].classList.add('animation');
        arr[index].addEventListener('animationend', () => {
            arr[index].classList.remove('animation');
        })
    };
};
