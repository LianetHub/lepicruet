export class Modal {
    constructor(options) {
        let defaultOptions = {
            isOpen: () => { },
            isClose: () => { },
        }
        this.options = Object.assign(defaultOptions, options);
        this.modal = null;
        this.modalLinks = [];
        this.modalCloseBtns = [];
        this.body = document.body;
    }

    init() {
        this.modalLinks = document.querySelectorAll('[data-modal]');
        this.modalCloseBtns = document.querySelectorAll('[data-modal-close]');
        this.#events();
    }

    #events() {
        this.modalLinks.forEach(modalLink => {

            modalLink.addEventListener("click", (e) => {
                const modalName = e.target.closest('[data-modal]').getAttribute('href').replace("#", '');
                const currentModal = document.getElementById(modalName);
                e.preventDefault();
                this.openModal(currentModal);
            });
        });

        this.modalCloseBtns.forEach(modalCloseBtn => {
            modalCloseBtn.addEventListener('click', (e) => {
                this.closeModal(this.modal);
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === "Escape") {
                if (this.modal) {
                    this.closeModal(this.modal);
                }
            }
        });

        document.addEventListener('click', (e) => {
            if (e.target.classList.contains("popup")) {
                this.closeModal(this.modal);
            }
        });
    }

    openModal(modalBlock) {
        if (this.modal) {
            this.closeModal(this.modal);
        } else {
            this.body.classList.add('lock');
        }
        modalBlock.classList.add('open');
        this.modal = modalBlock;
    }

    closeModal(modalBlock) {
        modalBlock.classList.remove('open');
        this.body.classList.remove('lock');
        this.modal = null;
    }



}