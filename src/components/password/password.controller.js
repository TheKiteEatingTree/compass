'use strict';

export default class PasswordController {
    constructor($scope, $routeParams, style, north, bg) {
        this.scope = $scope;
        this.north = north;
        this.bg = bg;

        style.body = "cyan darken-1";
        style.nav = "no-shadow";

        this.scope.$on('decrypt', (event, msg) => {
            if (!msg.error) {
                this.password = msg.password;
            }
        });
        this.decrypt($routeParams.file);
    }

    decrypt(name) {
        this.bg.getBackgroundPage().then((bg) => {
            const password = bg.getPassword();
            this.north.decrypt(name, password);
        });
    }
}

PasswordController.$inject = ['$scope', '$routeParams', 'style', 'north', 'bg'];
