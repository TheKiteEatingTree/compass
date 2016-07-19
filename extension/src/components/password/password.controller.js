'use strict';

export default class PasswordController {
    constructor($location, $mdDialog, $mdToast, $routeParams, $scope, bg, north, style) {
        this.style = style;
        style.reset();
        style.addHeaderShadow();

        this.location = $location;
        this.dialog = $mdDialog;
        this.toast = $mdToast;
        this.scope = $scope;
        this.bg = bg;
        this.north = north;

        this.file = $routeParams.file;
        this.loading = true;
        this.showPassword = false;
        this.title = this.file.slice(0, -4);

        this.scope.$watch('passwordForm.$dirty', (dirty) => {
            if (!dirty) {
                return;
            }

            this.showSaveCancelButtons();
        });

        this.decrypt();
    }

    copyPassword() {
        this.bg.copyPassword(this.password.password)
            .then(() => this.toast.showSimple('Password copied'))
            .catch(err => this.toast.showSimple(err.message));
    }

    decrypt() {
        this.north.decrypt(this.file).then((password) => {
            this.password = password;
            this.reset();
        }).catch((err) => {
            this.toast.showSimple(err.message);
            this.location.path('/home');
        });
    }

    reset() {
        this.scope.passwordForm.$setPristine();
        this.showMenu();

        this.style.showLeftButton('Back', 'arrow_back', () => {
            this.location.path('/home');
        });

        this.loading = false;
    }

    showMenu() {
        this.style.showRightMenu([{
            icon: 'casino',
            title: 'Generate Password',
            click: () => {
                console.log('generate password');
            }
        }, {
            icon: 'delete',
            title: 'Delete',
            click: (ev) => {
                var confirm = this.dialog.confirm()
                    .title('Delete Password?')
                    .textContent(`Are you sure you want to delete ${this.title}?`)
                    .ariaLabel('Confirm Delete')
                    .targetEvent(ev)
                    .ok('Delete')
                    .cancel('Cancel');

                this.dialog.show(confirm).then(() => {
                    this.north.del(this.file).then(() => {
                        this.location.path('/home');
                        this.toast.showSimple('Password deleted');
                    })
                    .catch(err => this.toast.showSimple(err.message));
                });
            }
        }]);
    }

    showSaveCancelButtons() {
        this.style.showLeftButton('Cancel', 'clear', () => {
            this.loading = true;
            this.decrypt();
        });

        this.style.showRightButton('Save', 'check', () => {
            this.loading = true;
            this.north.encrypt(this.file, this.password).then(() => {
                this.toast.showSimple('Password saved');
                this.reset();
            })
            .catch(err => this.toast.showSimple(err.message));
        });
    }
}

PasswordController.$inject = ['$location', '$mdDialog', '$mdToast', '$routeParams', '$scope', 'bg', 'north', 'style'];
