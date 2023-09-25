import { getProducts } from './renderProducts.js';

export const updateStatusPage = (url) => {
    const currentTab = document.querySelector('.header__tab.active');
    if (!currentTab) return;

    const pageStatus = currentTab.dataset.status;

    if (pageStatus == 'retail') {
        document.querySelector('.page-version').innerHTML = "Розница";
        document.body.setAttribute('data-status', 'retail');
        return getProducts("/json/retail.json");
    }

    if (pageStatus == 'partners') {
        document.querySelector('.page-version').innerHTML = "Для партнеров";
        document.body.setAttribute('data-status', 'partners');
        return getProducts("/json/partners.json");
    }

}