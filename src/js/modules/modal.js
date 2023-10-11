class Modal {
    constructor(options) {
        let defaultOptions = {
            isOpen: () => { },
            isClose: () => { },
        }
        this.options = Object.assign(defaultOptions, options);
        this.prevModal = null;
        this.modal = null;
        this.body = document.body;
        this.#events();
    }

    #events() {

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

            if (e.target.closest('[data-modal]')) {
                const modalName = e.target.closest('[data-modal]').getAttribute('href').replace("#", '');
                const currentModal = document.getElementById(modalName);
                e.preventDefault();
                this.openModal(currentModal);
            }

            if (e.target.closest('[data-modal-close]')) {
                this.closeModal(this.modal);
            }
        });
    }

    openModal(modalBlock) {

        let currentModal = this.modal;


        if (this.modal) {
            this.closeModal(this.modal);
        } else {
            this.body.classList.add('lock');
        }

        if (modalBlock.hasAttribute('data-modal-prev')) {
            this.prevModal = currentModal;
        }

        modalBlock.classList.add('open');
        this.modal = modalBlock;
    }

    closeModal(modalBlock) {


        modalBlock.classList.remove('open');
        this.body.classList.remove('lock');
        this.modal = null;

        if (this.prevModal) {
            this.openModal(this.prevModal);
            this.prevModal = null;
        }

    }

    getSucces() {
        this.closeModal(this.modal)
        this.openModal(document.getElementById('succes'))
    }



}

export const modal = new Modal;