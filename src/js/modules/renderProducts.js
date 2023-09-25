export async function getProducts(url) {

    try {
        let response = await fetch(url);
        let responseData = await response.json();

        const productList = document.querySelector('.products__list');
        productList.innerHTML = "";
        const productModals = document.querySelector('.product-modals__list');
        productModals.innerHTML = "";

        responseData.forEach(product => {
            renderProducts(product);
            renderProductsModals(product);
        })


    } catch (err) {
        console.log(err)
    }
}

function renderProducts(productData) {

    const list = document.querySelector('.products__list');
    const templateProduct = document.querySelector('#product');

    const productItem = templateProduct.content.cloneNode(true);

    const productWrapper = productItem.querySelector('.product');
    const productTitle = productItem.querySelector('.product__title');
    const productDesc = productItem.querySelector('.product__desc');
    const productImageWrapper = productItem.querySelector('.product__image');
    const productImage = productItem.querySelector('.product__image-item');
    const productPrice = productItem.querySelector('.product__price');
    const productWeight = productItem.querySelector('.product__weight');
    const productBtn = productItem.querySelector('.product__btn');

    productWrapper.setAttribute("id", productData.articul);
    productTitle.innerHTML = productData.name;
    productTitle.setAttribute('href', `#product-modal-${productData.articul}`);
    productDesc.innerHTML = productData.desc;
    productImageWrapper.setAttribute('href', `#product-modal-${productData.articul}`);
    productImage.setAttribute('src', productData.url);
    productImage.setAttribute('alt', `Изображение ${productData.name}`);
    productPrice.innerHTML = productData.price;
    productWeight.innerHTML = productData.weight;
    productBtn.setAttribute('data-articul', productData.articul);

    list.append(productItem);




}

function renderProductsModals(productData) {

    const productModals = document.querySelector('.product-modals__list');
    const templateProductModal = document.querySelector('#product-modal');

    const productModalItem = templateProductModal.content.cloneNode(true);

    const productPopup = productModalItem.querySelector('.popup');
    const modalTitle = productModalItem.querySelector('.product-modal__title');
    const modalDesc = productModalItem.querySelector('.product-modal__desc');
    const modalWeight = productModalItem.querySelector('.product-modal__weight');
    const modalPrice = productModalItem.querySelector('.product-modal__price');
    const modalQuantity = productModalItem.querySelector('.quantity__value');
    const modalBtn = productModalItem.querySelector('.product-modal__button');
    const modalSlider = productModalItem.querySelector('.product-modal__slider');
    const modalSliderWrapper = modalSlider.querySelector('.swiper-wrapper');
    const modalSliderPrev = productModalItem.querySelector('.product-modal__prev');
    const modalSliderNext = productModalItem.querySelector('.product-modal__next');
    const modalSliderPagination = productModalItem.querySelector(".product-modal__pagination");

    productData.slides.map(slideUrl => {
        let slide = document.createElement('div');
        slide.classList.add('swiper-slide');
        let image = document.createElement('img');
        image.setAttribute("src", slideUrl);
        image.setAttribute("alt", productData.name);
        slide.appendChild(image);
        modalSliderWrapper.appendChild(slide);
    })

    productPopup.setAttribute('id', `product-modal-${productData.articul}`);
    productPopup.setAttribute('data-id', `${productData.articul}`);
    modalTitle.innerHTML = productData.name;
    modalDesc.innerHTML = productData.desc;
    modalWeight.innerHTML = productData.weight;
    modalPrice.innerHTML = productData.price;

    modalQuantity.innerHTML = document.querySelector(`[data-id="${productData.articul}"] .quantity__value`) ? +document.querySelector(`[data-id="${productData.articul}"] .quantity__value`).innerHTML : 1;

    new Swiper(modalSlider, {
        slidesPerView: 1,
        navigation: {
            nextEl: modalSliderNext,
            prevEl: modalSliderPrev
        },
        pagination: {
            el: modalSliderPagination,
            clickable: true,
        }
    });

    modalBtn.setAttribute('data-articul', productData.articul);





    productModals.append(productModalItem);






}