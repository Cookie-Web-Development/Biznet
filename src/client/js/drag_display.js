/*DRAG DISPLAY*/
let drag_btn = Array.from(document.querySelectorAll('[data-drag-btn]'));
let drag_active = false; //touch-click-drag: ensures that the dragging event fires and stops when required


drag_btn.forEach(button => {
    let display_target = document.querySelector(`[data-drag-display=${button.dataset.dragBtn}]`);
    let max_distance_travel = display_target.scrollWidth;
    let visible_window = display_target.clientWidth;
    //return if not enough items present.
    if (max_distance_travel <= visible_window) { return };

    button.classList.add('active');

    //Slider indicator
    let slider_indicator = document.querySelector(`[data-drag-indicator=${button.dataset.dragBtn}]`);

    let indicator_width = ((visible_window / max_distance_travel) * 100);  
    slider_indicator.parentNode.classList.add('active')
    slider_indicator.style.width = `${indicator_width}%`;


    button.addEventListener('click', () => {
        draggingFunction(display_target, button, slider_indicator, visible_window, max_distance_travel)
    })
})


function draggingFunction (target, button, slider, distance_to_travel, max_distance) {
    if (!(typeof max_distance === 'number' || typeof distance_to_travel === 'number')) { return };

    //currernt_x MUST NOT be higher than 0
    let current_x = getComputedTransformX(target);
    let travel, steps, progress;

    //this compensates the gap between elements into the dragging distance.
    let gap_between = parseFloat(window.getComputedStyle(target).gap) || 0;
    let distance_with_gap = distance_to_travel + (gap_between / 4);
   
    let slider_current_x = parseFloat(slider.style.left) || 0;
    let slider_travel = parseFloat(slider.style.width), slider_steps = 1.5;

    switch(button.dataset.function) {
        case "next":
            //distance validator: checks if there is enough. Else, set to distance_to_travel - max_distance
            current_x - (distance_with_gap * 2) < -max_distance 
            ? (travel = distance_with_gap - max_distance - (gap_between / 2), 
            slider_travel = 100 - parseFloat(slider.style.width))
            : (travel = current_x - distance_with_gap,
            slider_travel = slider_current_x + parseFloat(slider.style.width));

            steps = -100;
            break;
        case "previous":
            //distance validator: checks if there is enough. Else, set to 0. No idea why this has to be 1.9 but it works as is.
            current_x + (distance_with_gap * 1.9) > 0 
            ? (travel = 0 + (gap_between / 4), slider_travel = 0)
            : (travel = current_x + distance_with_gap, slider_travel = slider_current_x -(parseFloat(slider.style.width)) );

            steps = 100;
            slider_steps = -slider_steps;
            break;
        default: 
            return;
    }

    progress = Math.abs(current_x - travel);

    function animation () {
        current_x = current_x + steps;
        progress = progress - (Math.abs(steps));
        
        let transform_value = `translateX(${current_x}px)`;
        target.style.transform = transform_value;        

        slider_current_x = slider_current_x + slider_steps;
        slider.style.left = `${slider_current_x}%`

        if(progress > 0) {
            requestAnimationFrame(animation)
        } else {
            transform_value = `translateX(${travel}px)`;
            target.style.transform = transform_value;

            slider.style.left = `${slider_travel}%`
        }
    }

    requestAnimationFrame(animation)

};

function getComputedTransformX (target) {
    /*This function extract the specific placement of the element inside the website. The result "matrix" is literally a matrix with an bunch of values (about 6 of them). The most importat value to us is the fifth one (i.e. 'matrix.e') which represent the position in a X-axis or vertical axis.*/
    let matrix = new DOMMatrix(window.getComputedStyle(target).transform);
    return matrix.e;
};