'use strict';

export default class PasswordController {
    constructor($scope, $routeParams, style, north, bg) {
        style.reset();
        this.scope = $scope;
        this.north = north;
        this.bg = bg;

        this.scope.$on('decrypt', (event, msg) => {
            if (!msg.error) {
                this.password = msg.password;
            }
        });
        console.log($routeParams.file);
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
