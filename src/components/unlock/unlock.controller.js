'use strict';

export default class HomeController {
    constructor($scope, $location, style, bg, north, tabs) {
        style.reset();
        style.cyanBg();
        this.location = $location;
        this.bg = bg;
        this.north = north;
        this.tabs = tabs;

        this.password = "";
        this.error = "";
        document.getElementById('password').focus();

        $scope.$on('testPassword', (event, msg) => this.testPasswordHandler(msg));

        this.bg.getBackgroundPage().then((bg) => {
            this.password = bg.getPassword();
            if (this.password !== "") {
                this.submit();
            }
        });
    }

    submit() {
        this.error = "";
        this.tabs.getCurrent()
            .then(tab => this.north.testPassword(this.password, tab.url))
            .catch(() => this.north.testPassword(this.password));
    }

    testPasswordHandler(msg) {
        if (msg.error) {
            this.error = msg.error;
            return;
        }

        this.bg.getBackgroundPage().then((bg) => {
            bg.savePassword(this.password);
            this.location.path('/home');
        }).catch((err) => {
            this.error = err.getMessage();
        });
    }
}

HomeController.$inject = ['$scope', '$location', 'style', 'bg', 'north', 'tabs'];
