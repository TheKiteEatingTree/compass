'use strict';

export default class PasswordController {
    constructor($scope, $routeParams, style, north, bg, $location) {
        this.style = style;
        style.reset();
        style.addHeaderShadow();
        this.showBackButton();

        this.scope = $scope;
        this.north = north;
        this.bg = bg;
        this.title = $routeParams.file;
        this.location = $location;

        this.scope.$on('decrypt', (event, msg) => {
            if (!msg.error) {
                this.password = msg.password;
                this.scope.passwordForm.$setPristine();
                this.showBackButton();
            }
        });

        this.scope.$watch('passwordForm.$dirty', (dirty) => {
            if (dirty) {
                this.style.showLeftButton('clear', () => {
                    this.decrypt($routeParams.file);
                });
            }
        });

        this.decrypt($routeParams.file);
    }

    showBackButton() {
        this.style.showLeftButton('arrow_back', () => {
            this.location.path('/home');
        });
    }

    decrypt(name) {
        this.bg.getBackgroundPage().then((bg) => {
            const password = bg.getPassword();
            this.north.decrypt(name, password);
        });
    }
}

PasswordController.$inject = ['$scope', '$routeParams', 'style', 'north', 'bg', '$location'];
