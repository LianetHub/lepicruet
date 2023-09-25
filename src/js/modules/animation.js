export class Animation {
    constructor() {
        this.animationItems = [];
    }

    init() {
        this.animationItems = document.querySelectorAll('[data-animate]');
        this.animationItems.forEach(animationItem => animationItem.classList.remove('visible'));

        this.animationItems.forEach(animationItem => {

            const callback = function (entries, observer) {
                if (entries[0].isIntersecting) {
                    animationItem.classList.add('visible');
                }
            };

            const companyObserver = new IntersectionObserver(callback);
            companyObserver.observe(animationItem);

        });


    }

}