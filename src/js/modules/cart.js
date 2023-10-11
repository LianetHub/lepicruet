import { modal } from "./modal";

export class Cart {
    constructor() {
        this.cart = document.querySelector('.cart');

        this.retail = new Set();
        this.partners = new Set();
        this.products = [];
        this.productsBtns = document.querySelectorAll('.product__btn');
        this.allProducts = [];
        this.totalPrice = document.querySelector('[data-total]');
        this.quantity = document.querySelector('.cart-btn__quantity');
        this.cartList = document.querySelector('.cart__list');
        this.getAllProducts();
        this.init();
        this.#events();
    }

    init() {

        if (window.location.pathname.includes('succes')) {
            if (localStorage.getItem('lepicruet')) {
                this.products = [{ "retail": Array.from(this.retail) }, { "partners": Array.from(this.partners) }];
                this.#updateStogare();
            }
        }
        if (!this.cart) return;
        if (!localStorage.getItem('lepicruet')) {
            this.products = [{ "retail": Array.from(this.retail) }, { "partners": Array.from(this.partners) }];
        } else {
            this.products = JSON.parse(localStorage.getItem('lepicruet'));
        }


        this.retail = new Set(this.products[0].retail);
        this.partners = new Set(this.products[1].partners);

        let pageStatus = this.getPageStaus();
        let currentSet = this[pageStatus];

        this.cartList.innerHTML = "";
        currentSet.forEach(item => {
            this.toggleProductToCart(item.articul, "add");
        });

        if (pageStatus == "partners") {
            this.cart.querySelector('.cart__btn').innerHTML = "Отправить в телеграмм";
        }


        if (pageStatus == "retail") {
            this.cart.querySelector('.cart__btn').innerHTML = "Оплатить";
        }

        this.#updateCart();
        this.updateBtns();
        this.#calcTotalPrice();

    }

    #events() {

        document.addEventListener('click', (e) => {

            const target = e.target;

            if (target.hasAttribute('data-articul')) {

                let articul = target.dataset.articul;

                if (target.classList.contains('added')) {
                    this.removeFromCart(articul);
                } else {
                    this.addToCart(articul);
                }
            }


            if (target.hasAttribute('data-remove')) {
                let articul = target.dataset.remove;
                this.removeFromCart(articul);
            }

            if (target.classList.contains('quantity__plus')) {
                const articul = target.closest('[data-id]').dataset.id;
                this.#calcProductQuantity(articul, "increment");
            }

            if (target.classList.contains('quantity__minus')) {
                const articul = target.closest('[data-id]').dataset.id;
                this.#calcProductQuantity(articul, "decrement");
            }


        });

        this.cart.addEventListener('submit', (e) => this.#submitForm(e));

        document.querySelectorAll('input[name="Доставка"]').forEach(deliveryInput => {
            deliveryInput.addEventListener('change', (e) => {
                if (e.target.value == "Самовывоз") {
                    this.removeAddressField()
                }
                if (e.target.value == "Доставка") {
                    this.addAddressField()
                }
            })
        });

    }

    updateBtns(articul = null) {
        if (articul) {
            document.querySelectorAll(`[data-articul="${articul}"]`).forEach(btn => {
                btn.classList.toggle('added');
            });
        } else {
            const pageStatus = this.getPageStaus();

            this.getAllProducts().then(() => {
                this[pageStatus].forEach(item => {
                    document.querySelectorAll(`[data-articul="${item.articul}"]`).forEach(btn => {
                        btn.classList.toggle('added');
                    });
                })
            })

        }

    }

    addToCart(articul) {

        const pageStatus = this.getPageStaus();
        let currentSet = this[pageStatus];
        const productData = this.allProducts.find(item => item.articul === articul);
        productData.quantity = 1;
        currentSet.add(productData);
        this.#updateProducts();
        this.#updateCart();
        this.toggleProductToCart(articul, "add");
        this.updateBtns(articul);
        this.#calcTotalPrice();
    }

    removeFromCart(articul) {
        const pageStatus = this.getPageStaus();
        let currentSet = this[pageStatus];
        const productData = this.allProducts.find(item => item.articul === articul);
        let newSet = Array.from(currentSet).filter(currentSetItem => {
            if (currentSetItem.articul !== productData.articul) {
                return currentSetItem;
            }
        });
        this[pageStatus] = new Set(newSet);
        this.#updateProducts();
        this.#updateCart();
        this.toggleProductToCart(articul, "remove");
        this.updateBtns(articul);
        this.#calcTotalPrice();
    }

    toggleProductToCart(articul, action) {
        const pageStatus = this.getPageStaus();
        let currentSet = this[pageStatus];
        const productData = Array.from(currentSet).find(item => item.articul === articul);

        if (action == "add") {

            let template = `<tr data-id=${productData.articul}>
                                <td>
                                    <div class="cart__table-main">
                                        <div class="cart__table-image">
                                            <img src="${productData.url}" alt="Изображение выпечки">
                                        </div>
                                        <div class="cart__table-text">${productData.name}</div>
                                    </div>
                                </td>
                                <td>
                                    <div class="cart__table-price">${productData.price}</div>
                                </td>
                                <td>
                                    <div class="quantity">
                                        <button type="button" class="quantity__minus"></button>
                                        <span class="quantity__value">${productData.quantity}</span>
                                        <button type="button" class="quantity__plus"></button>
                                    </div>
                                </td>
                                <td>
                                    <div class="cart__table-total">${productData.price * productData.quantity}</div>
                                </td>
                                <td>
                                    <button type="button" data-remove=${productData.articul} class="cart__table-delete"></button>
                                </td>
                            </tr>`;
            this.cartList.insertAdjacentHTML("beforeend", template);
        }

        if (action == 'remove') {
            document.querySelector(`[data-id="${articul}"]`).remove();
            document.querySelector(`.popup[data-id="${articul}"] .quantity__value`).innerHTML = 1;

            if (currentSet.size === 0) {
                if (document.getElementById('cart').classList.contains('open')) {
                    this.cart.querySelector('[data-modal-close]').click();
                }

            }
        }


    }

    async getAllProducts() {
        const pageStatus = document.body.dataset.status ? document.body.dataset.status : "retail";
        let urlProducts = `./json/${pageStatus}.json`;

        try {
            let response = await fetch(urlProducts);
            let responseData = await response.json();

            this.allProducts = responseData;

        } catch (err) {
            console.log(err)
        }
    }

    getPageStaus() {
        const pageStatus = document.body.dataset.status ? document.body.dataset.status : "retail";
        return pageStatus;
    }

    #updateCart() {
        const pageStatus = this.getPageStaus();
        const currentSet = this[pageStatus];
        this.#updateQuantity(currentSet.size);
        this.#updateStogare()

    }

    #updateProducts() {
        this.products = [{ "retail": Array.from(this.retail) }, { "partners": Array.from(this.partners) }];
    }

    #updateQuantity(setLenght) {
        this.quantity.innerHTML = setLenght;

        if (setLenght === 0) {
            document.querySelector('.cart-btn').classList.add('cart-btn-empty');
        } else {
            document.querySelector('.cart-btn').classList.remove('cart-btn-empty');
        }
    }

    #updateStogare() {
        let productJSON = JSON.stringify(this.products);
        localStorage.setItem('lepicruet', productJSON);
    }

    #calcTotalPrice() {
        const priceItems = document.querySelectorAll('.cart__table-total');
        let totalPriceValue = 0;
        priceItems.forEach(priceItem => {
            totalPriceValue += +priceItem.innerHTML;
        });
        this.totalPrice.innerHTML = totalPriceValue;
    }

    #calcTotalProduct(articul) {
        const currentProducts = document.querySelectorAll(`[data-id="${articul}"]`);
        currentProducts.forEach(currentProduct => {

            const totalProductPrice = currentProduct.querySelector('.cart__table-total');
            if (!totalProductPrice) return;
            const currentQuantity = +currentProduct.querySelector('.quantity__value').innerHTML;
            const productPrice = +currentProduct.querySelector('.cart__table-price').innerHTML;
            totalProductPrice.innerHTML = currentQuantity * productPrice;
        })

    }

    #calcProductQuantity(articul, action = "increment") {
        const currentProducts = document.querySelectorAll(`[data-id="${articul}"]`);
        const pageStatus = this.getPageStaus();
        let currentSet = this[pageStatus];
        const productData = Array.from(currentSet).find(item => item.articul === articul);

        if (action == 'increment') {
            productData.quantity++;
        }
        if (action == 'decrement') {
            if (productData.quantity <= 1) {
                productData.quantity = 1;
                return;
            }
            productData.quantity--;
        }

        currentProducts.forEach(currentProduct => {
            const currentQuantity = currentProduct.querySelector('.quantity__value');
            currentQuantity.innerHTML = productData.quantity;
        });


        this.#calcTotalProduct(articul);
        this.#calcTotalPrice();
        this.#updateStogare();

    }

    async #submitForm(event) {

        event.preventDefault();

        this.getLoader();
        const pageStatus = this.getPageStaus();


        if (pageStatus == "partners") {
            this.sendToTelegram();
        }


        if (pageStatus == "retail") {
            let formData = this.#getFormData();
            let SUBMIT_URL = '/payment.php';
            try {
                let response = await fetch(SUBMIT_URL, {
                    method: "POST",
                    body: formData,
                });

                if (response.ok) {
                    let result = await response.json();
                    this.#getPaymentForm(result);
                }

            } catch (err) {
                this.removeLoader()
                console.log(err);
            }
        }
    }

    async sendToTelegram() {
        let SUBMIT_URL = '/sendmail.php';
        let formData = this.#getFormData();
        try {
            let response = await fetch(SUBMIT_URL, {
                method: "POST",
                body: formData,
            });
            if (response.ok) {
                this.#getSucces();
                this.removeLoader()
            }
        } catch (err) {
            this.removeLoader()
            console.log(err);
        }
    }

    #getFormData() {
        const formData = new FormData(this.cart);

        const totalPrice = +this.totalPrice.innerHTML;
        formData.append('Цена', totalPrice);

        const pageStatus = this.getPageStaus();

        if (pageStatus == "partners") {
            formData.append('Cпособ', "Опт");
        }

        if (pageStatus == "retail") {
            formData.append('Cпособ', "Розница");
        }
        let currentCartArray = Array.from(this[pageStatus]);

        currentCartArray.forEach((currentArrayItem, index) => {
            let productObject = {
                name: currentArrayItem.name.replace(/( |<([^>]+)>)/ig, " "),
                price: currentArrayItem.price,
                quantity: currentArrayItem.quantity
            };
            formData.append(`Продукт-${index + 1}`, JSON.stringify(productObject));
        })

        // for (let [name, value] of formData) {
        //     console.log(`${name} = ${value}`);
        // }

        return formData;
    }

    #getPaymentForm(result) {
        const token = result.confirmation.confirmation_token;

        //Инициализация виджета. Все параметры обязательные.
        const checkoutWidget = new window.YooMoneyCheckoutWidget({
            confirmation_token: token, //Токен, который вы получили после создания платежа
            // return_url: 'https://lepicruet.ru/succes.html', //Ссылка на страницу завершения оплаты
            //Настройка виджета
            customization: {
                //Настройка способа отображения
                modal: true
            },
            error_callback: function (error) {
                console.log(error)
            }
        });

        checkoutWidget.on('complete', () => {
            this.sendToTelegram();
            checkoutWidget.destroy();
        });

        //Отображение платежной формы в контейнере
        checkoutWidget.render().finally(() => {
            this.removeLoader()
        });
    }

    getLoader() {
        let loader = document.createElement('div');
        loader.classList.add('payment-loader');
        let spinner = document.createElement('div');
        spinner.classList.add('lds-dual-ring');
        loader.appendChild(spinner);
        document.body.appendChild(loader);
    }

    removeLoader() {
        document.querySelector('.payment-loader').remove();
    }

    addAddressField() {
        let addressWrapper = document.createElement('div');
        addressWrapper.classList.add('cart__row-address');
        addressWrapper.classList.add('cart__row');
        let addressInput = document.createElement('input');
        addressInput.type = 'text';
        addressInput.name = 'Адрес';
        addressInput.classList.add('input');
        addressInput.placeholder = "Ваш адрес...";
        addressInput.required = true;
        addressWrapper.appendChild(addressInput);
        document.querySelector('.cart__rows').appendChild(addressWrapper);
    }

    removeAddressField() {
        document.querySelector('.cart__row-address').remove()
    }

    #getSucces() {
        modal.getSucces();
        this.#resetCart();
    }

    #resetCart() {
        this.retail = new Set();
        this.partners = new Set();
        this.products = [{ "retail": Array.from(this.retail) }, { "partners": Array.from(this.partners) }];
        this.cartList.innerHTML = "";
        document.querySelectorAll('[data-articul]').forEach(btn => btn.classList.remove('added'));
        this.#updateCart();
        this.#calcTotalPrice();
    }

}