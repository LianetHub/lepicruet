import anime from 'animejs/lib/anime.js';


export class Preloader {

    constructor() {

        this.el = document.getElementById('loader');

        this.loaderImage = document.querySelector('.сroissant');
        this.loaderLetters = document.querySelectorAll('.letter');
        this.body = document.body;
        this.pageStatus = null;
    }

    show() {
        if (!this.el) return;
        this.pageStatus = this.body.dataset.status ? document.querySelector(`.loader-${this.body.dataset.status}`) : null;
        this.el.classList.remove('loader-start');
        this.el.classList.remove('hidden-loader');
        this.body.classList.add("loading");
        return this.#getAnimation()
    }

    #getAnimation() {
        let loaderTimeline = anime.timeline();
        loaderTimeline.add({
            targets: this.loaderImage,
            duration: 2000,
            delay: 200,
            easing: 'easeInOutExpo',
            strokeDashoffset: [anime.setDashoffset, 0]
        }).add({
            targets: this.loaderLetters,
            delay: 0,
            duration: 500,
            opacity: [0, 1],
            easing: 'easeInExpo',
        }, '-=750')
            .add({
                targets: this.pageStatus,
                delay: 0,
                duration: 1200,
                opacity: [0, 1],
                easing: 'easeInExpo',
                complete: (pageStatus) => {
                    this.#hideLoader();
                    pageStatus.reset();
                },

            }, '-=750');
        return loaderTimeline.finished;
    }

    #hideLoader() {
        this.el.classList.add('hidden-loader');
        this.body.classList.remove('loading');
    }

}