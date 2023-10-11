"use strict";

import '../scss/style.scss';
import { isWebp } from './modules/webp';
import { Preloader } from "./modules/preloader.js";
import { Tabs } from "./modules/tabs.js";
import { modal } from "./modules/modal.js";
import { updateStatusPage } from "./modules/updateStatusPage.js";
import { Cart } from "./modules/cart.js";
import { Video } from "./modules/video.js";
import { ArrowTop } from './modules/arrowTop';
import { Animation } from "./modules/animation.js";
import SmoothScroll from "smooth-scroll";


document.addEventListener("DOMContentLoaded", () => {

    isWebp();
    const animation = new Animation();
    const preloader = new Preloader();
    let preloaderPromise = preloader.show();

    if (typeof preloaderPromise == 'object') {
        preloaderPromise.then(() => {
            let renderProducts = updateStatusPage();
            renderProducts.then(() => {
                animation.init();
            })
        });
    }




    const tabs = new Tabs();
    const cart = new Cart();
    const video = new Video();
    const arrowTop = new ArrowTop();
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


    if (document.querySelector('.gallery__slider')) {
        new Swiper('.gallery__slider', {
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


});

