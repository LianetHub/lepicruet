export class Tabs {
    constructor() {
        this.tabpanels = [];
        this.tabs = [];
        this.firstTab = null;
        this.lastTab = null;
        this.#init();
    }

    #init() {
        this.tabs = Array.from(document.querySelectorAll('[role="tab"]'));

        this.tabpanels = this.tabs.map((tab) => {
            const tabpanel = document.getElementById(tab.getAttribute('aria-controls'));
            tab.tabIndex = -1;
            tab.setAttribute('aria-selected', 'false');
            tab.addEventListener('keydown', (e) => this.onKeydown(e));
            tab.addEventListener('click', (e) => this.onClick(e));

            if (!this.firstTab) {
                this.firstTab = tab;
            }

            this.lastTab = tab;

            return tabpanel;
        })
        this.setSelectedTab(this.firstTab, false);
    }

    onKeydown(event) {
        const target = event.currentTarget;
        let flag = false;

        switch (event.key) {
            case 'ArrowLeft':
                this.setSelectedToPreviousTab(target);
                flag = true;
                break;
            case 'ArrowRight':
                this.setSelectedToNextTab(target);
                flag = true;
                break;
            default:
                break;
        }

        if (flag) {
            event.stopPropagation()
            event.preventDefault()
        }
    }

    onClick(event) {
        this.setSelectedTab(event.currentTarget)
    }

    setSelectedTab(currentTab, setFocus = true) {
        this.tabs.forEach((tab, i) => {
            if (currentTab === tab) {
                tab.setAttribute('aria-selected', 'true');
                tab.removeAttribute('tabindex');
                this.tabpanels[i].classList.remove('tabpanel-hidden');

                if (setFocus) {
                    tab.focus();
                }
            }

            else {
                tab.setAttribute('aria-selected', 'false');
                tab.tabIndex = -1;
                this.tabpanels[i].classList.add('tabpanel-hidden');
            }
        })
    }

    setSelectedToPreviousTab(currentTab) {
        const index = this.tabs.indexOf(currentTab);
        this.setSelectedTab(index === 0 ? this.lastTab : this.tabs[index - 1]);
    }

    setSelectedToNextTab(currentTab) {
        const index = this.tabs.indexOf(currentTab);
        this.setSelectedTab(index === this.tabs.length - 1 ? this.firstTab : this.tabs[index + 1]);
    }


}