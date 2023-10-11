export class ArrowTop {

    constructor() {
        this.arrow = document.querySelector('[data-arrow-top]');
        if (!this.arrow) return;
        this.triggerSection = document.querySelector('.products');
        this.init()
    }

    init() {
        const callback = (entries, observer) => {
            if (entries[0].isIntersecting || entries[0].boundingClientRect.y < 0) {
                this.arrow.classList.remove('arrow-hidden');
            } else {
                this.arrow.classList.add('arrow-hidden');
            }
        };

        const arrowObserver = new IntersectionObserver(callback);
        arrowObserver.observe(this.triggerSection);

    }
}