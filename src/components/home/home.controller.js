'use strict';

import angular from 'angular';
import * as inject from './../../services/inject.js';

export default class HomeController {
    constructor($scope, $location, data, style, north, bg, $mdDialog, tabs, $mdToast) {
        style.reset();
        style.addHeaderShadow();
        style.showRightButton('Refresh URLs', 'refresh', () => {
            this.bg.getBackgroundPage().then((bg) => {
                const password = bg.getPassword();
                this.north.refresh(password);
            });
        });

        this.scope = $scope;
        this.location = $location;
        this.data = data;
        this.north = north;
        this.bg = bg;
        this.dialog = $mdDialog;
        this.tabs = tabs;
        this.toast = $mdToast;

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

    // TODO: consider the usefulness of this being a setting
    // function loginByPasting(bg, tabs, msg) {
    //     return bg.getBackgroundPage().then((bg) => {
    //         bg.copyPassword(msg.password.password);

    //         return tabs.executeScript({
    //             file: 'injectPassword.js'
    //         }).then(() => {
    //             bg.copyPassword(msg.password.user);

    //             return tabs.executeScript({
    //                 file: 'injectUser.js'
    //             });
    //         }).then(() => bg.copyPassword(Random.generateString()));
    //     });
    // }
    autoLogin(match) {
        this.north.decrypt(match).then((password) => {
            let user = '';
            let pass = '';
            if (password.user) {
                user = password.user.replace(/\'/g, '\\\'');
            }
            if (password.password) {
                pass = password.password.replace(/\'/g, '\\\'');
            }
            return this.tabs.executeScript({
                code: inject.getCode(user, pass)
            });
        })
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

HomeController.$inject = ['$scope', '$location', 'data', 'style', 'north', 'bg', '$mdDialog', 'tabs', '$mdToast'];
