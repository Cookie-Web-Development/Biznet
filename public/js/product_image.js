//## Thumbnail selector
let image_route = '/public/img/products-images/'
let thumbnail_select = document.querySelectorAll('[data-thumbnail]');
let thumbnail_target = document.querySelector('[data-thumbnail-target]');

if (thumbnail_select.length > 0) {
    thumbnail_select[0].classList.add('active')
}

thumbnail_select.forEach(thumbnail => {
    thumbnail.addEventListener('click', (e) => {
        thumbnail_target.setAttribute('src', `${image_route}${e.target.dataset.thumbnail}`);
        thumbnail_select.forEach(select => {
            select.classList.remove('active')
        })
        e.target.classList.add('active')
    })
});

//## Image Modal
let image_display_modal = document.getElementById('image_display_modal');
let modal_image = document.getElementById('modal_image');

thumbnail_target.addEventListener('click', (e) => {
    modal_image.setAttribute('src', `${e.target.src}`);
    image_display_modal.showModal();
})

// close modal when clicking anywhere
image_display_modal.addEventListener('click', () => {
    image_display_modal.close()
})