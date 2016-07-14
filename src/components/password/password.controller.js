'use strict';

export default class PasswordController {
    constructor($scope, $routeParams, style, north, bg, $location, $mdToast) {
        this.style = style;
        style.reset();
        style.addHeaderShadow();
        this.showBackButton();

        this.loading = true;
        this.scope = $scope;
        this.north = north;
        this.bg = bg;
        this.title = $routeParams.file.slice(0, -4);
        this.location = $location;
        this.toast = $mdToast;

        this.showPassword = false;

        this.scope.$on('decrypt', (event, msg) => {
            if (msg.error) {
                return this.toast.showSimple(msg.error);
            }
            this.password = msg.password;
            this.reset();
        });

        this.scope.$on('encrypt', (event, msg) => {
            if (msg.error) {
                return this.toast.showSimple(msg.error);
            }
            this.reset();
        });

        this.scope.$watch('passwordForm.$dirty', (dirty) => {
            if (dirty) {
                this.style.showLeftButton('Cancel', 'clear', () => {
                    this.loading = true;
                    this.decrypt($routeParams.file);
                });
                this.style.showRightButton('Save', 'check', () => {
                    this.loading = true;
                    this.bg.getBackgroundPage().then((bg) => {
                        const password = bg.getPassword();
                        this.north.encrypt($routeParams.file, this.password, password);
                    });
                });
            }
        });

        this.decrypt($routeParams.file);
    }

    copyPassword() {
        this.bg.getBackgroundPage().then((bg) => {
            bg.copyPassword(this.password.password);
        });
    }

    decrypt(name) {
        this.bg.getBackgroundPage().then((bg) => {
            const password = bg.getPassword();
            this.north.decrypt(name, password);
        });
    }

    reset() {
        this.scope.passwordForm.$setPristine();
        this.showBackButton();
        this.showMoreButton();
        this.loading = false;
    }

    showBackButton() {
        this.style.showLeftButton('Back', 'arrow_back', () => {
            this.location.path('/home');
        });
    }

    showMoreButton() {
        this.style.showRightButton('More', 'more_vert', () => {
            this.location.path('/home');
        });
    }
}

PasswordController.$inject = ['$scope', '$routeParams', 'style', 'north', 'bg', '$location', '$mdToast'];
