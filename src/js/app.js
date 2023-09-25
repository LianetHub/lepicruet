"use strict";

import '../scss/style.scss';
import { Preloader } from "./modules/preloader.js";
import { Tabs } from "./modules/tabs.js";
import { Modal } from "./modules/modal.js";
import { updateStatusPage } from "./modules/updateStatusPage.js";
import { Cart } from "./modules/cart.js";
import { Video } from "./modules/video.js";
import { Animation } from "./modules/animation.js";
import SmoothScroll from "smooth-scroll";
// import Swiper from "swiper";
// import { Navigation, Pagination } from 'swiper/modules';


document.addEventListener("DOMContentLoaded", () => {

    const animation = new Animation();
    const preloader = new Preloader();
    const modal = new Modal();
    let preloaderPromise = preloader.show();

    preloaderPromise.then(() => {
        let renderProducts = updateStatusPage();
        renderProducts.then(() => {
            animation.init();
            modal.init();
        })
    });


    const tabs = new Tabs();
    const cart = new Cart();
    const video = new Video();
    const scroll = new SmoothScroll('a[href*="#"]:not([data-modal])', {
        speed: 1000,
        speedAsDuration: true,
        easing: "easeOutQuad",
    });





    document.addEventListener('click', (e) => {
        const target = e.target;

        if (target.classList.contains('header__tab')) {

            document.querySelectorAll('.header__tab').forEach(tab => {
                tab.classList.remove('active');
            });
            target.classList.add('active');

            let promise = preloader.show();
            promise.then(() => {
                scroll.animateScroll(document.getElementById('products'));
                let renderProducts = updateStatusPage();
                renderProducts.then(() => {
                    cart.getAllProducts();
                    cart.init();
                    animation.init();
                    modal.init();
                })
            });
        }

        if (target.classList.contains('header__menu-btn')) {
            getMenu()
        }

        if (target.classList.contains('header__menu-link') &&
            document.querySelector('.header__menu').classList.contains('active')) {
            getMenu()
        }
    });


    function getMenu() {
        document.querySelector('.header__menu').classList.toggle('active');
        document.querySelector('.header__menu-btn').classList.toggle('active');
        document.body.classList.toggle('lock');
    }


    const arrowTop = document.querySelector('[data-arrow-top]');
    const secondSection = document.querySelector('.products');

    const callback = function (entries, observer) {
        if (entries[0].isIntersecting || entries[0].boundingClientRect.y < 0) {
            arrowTop.classList.remove('arrow-hidden');
        } else {
            arrowTop.classList.add('arrow-hidden');
        }
    };

    const arrowObserver = new IntersectionObserver(callback);
    arrowObserver.observe(secondSection);



    if (document.querySelector('.gallery__slider')) {
        new Swiper('.gallery__slider', {
            // modules: [Navigation, Pagination],
            slidesPerView: 2,
            initialSlide: 1,
            watchSlidesProgress: true,
            navigation: {
                nextEl: ".gallery__next",
                prevEl: ".gallery__prev"
            },
            pagination: {
                el: ".gallery__pagination",
                type: "fraction",
                renderFraction: function (currentClass, totalClass) {
                    return `<span class="${currentClass}"></span>/<span class="${totalClass}"></span>`;
                }
            },
        })
    }


    document.querySelectorAll('input[name="delivery"]').forEach(deliveryInput => {
        deliveryInput.addEventListener('change', (e) => {
            if (e.target.value == "pickup") {
                document.querySelector('.cart__rows').classList.add('hidden')
            }
            if (e.target.value == "city") {
                document.querySelector('.cart__rows').classList.remove('hidden')
            }
        })
    })

});

