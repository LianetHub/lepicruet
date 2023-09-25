export class Cart {
    constructor() {
        this.retail = new Set();
        this.partners = new Set();
        this.products = [];
        this.productsBtns = document.querySelectorAll('.product__btn');
        this.allProducts = [];
        this.cart = document.querySelector('.cart');
        this.totalPrice = document.querySelector('[data-total]');
        this.quantity = document.querySelector('.cart-btn__quantity');
        this.cartList = document.querySelector('.cart__list');
        this.getAllProducts();
        this.init();
        this.#events();
    }

    init() {

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
        })

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

}