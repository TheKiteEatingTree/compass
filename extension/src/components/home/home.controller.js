'use strict';

import angular from 'angular';

export default class HomeController {
    constructor($location, $mdDialog, $mdToast, autoLogin, bg, data, north, style) {
        style.reset();
        style.addHeaderShadow();
        style.showRightButton('Refresh URLs', 'refresh', () => {
            this.bg.getBackgroundPage().then((bg) => {
                const password = bg.getPassword();
                this.north.refresh(password);
            });
        });

        this.location = $location;
        this.dialog = $mdDialog;
        this.toast = $mdToast;
        this.autoLogin = autoLogin;
        this.bg = bg;
        this.data = data;
        this.north = north;


        this.root = this.data.files;
        this.current = this.root;
    }

    addPassword(ev) {
        this.dialog.show({
            controller: 'NewPasswordController',
            controllerAs: 'vm',
            template: require('./../password/new-password.html'),
            parent: angular.element(document.body),
            targetEvent: ev,
            locals: {
                filename: this.prefixName(this.current)
            }
        }).then((name) => {
            this.location.path('/password').search('file', `${name}.gpg`);
        });
    }


    login(match) {
        this.autoLogin.login(match)
            .then(() => window.close())
            .catch(err => this.toast.showSimple(err.message));
    }

    copyPassword(evt, file) {
        evt.stopPropagation();
        const name = this.prefixName(this.current, file.name);

        this.north.decrypt(name)
            .then(password => this.bg.copyPassword(password.password))
            .then(() => window.close())
            .catch(err => this.toast.showSimple(err.message));
    }

    goUp() {
        this.current = this.current.up;
    }

    prefixName(current, name = '') {
        if (current.up) {
            return this.prefixName(current.up, `${current.name}/${name}`);
        }
        return name;
    }

    selectFile(file) {
        if (file.files) {
            const temp = this.current;
            this.current = file;
            this.current.up = temp;
        } else {
            const name = this.prefixName(this.current, file.name);
            this.location.path('/password').search('file', name);
        }
    }
}

HomeController.$inject = ['$location', '$mdDialog', '$mdToast', 'autoLogin', 'bg', 'data', 'north', 'style'];
