'use strict';

export default class HomeController {
    constructor($location, bg, data, style, tabs) {
        style.reset();
        style.cyanBg();

        this.location = $location;
        this.bg = bg;
        this.data = data;
        this.tabs = tabs;

        this.password = "";
        this.error = "";

        this.bg.getBackgroundPage().then((bg) => {
            this.password = bg.getPassword();
            if (this.password !== "") {
                this.submit();
            }
        });
    }

    submit() {
        this.error = "";
        this.tabs.getCurrent().catch(() => {})
            .then(tab => this.data.login(this.password, tab.url))
            .then(() => this.bg.getBackgroundPage())
            .then((bg) => {
                bg.savePassword(this.password);
                this.location.path('/home');
            })
            .catch(err => this.error = err.message);
    }
}

HomeController.$inject = ['$location', 'bg', 'data', 'style', 'tabs'];
