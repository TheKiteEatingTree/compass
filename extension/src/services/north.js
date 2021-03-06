'use strict';

export default class North {
    constructor($q, $rootScope, tabs, bg, $mdToast) {
        this.promise = $q;
        this.toast = $mdToast;
        this.bg = bg;
        this.port = chrome.runtime.connect('hemodhgkkkemilkpbmifoohcncefnldl');

        this.port.onMessage.addListener((msg) => {
            if (msg.cmd === 'refresh') {
                if (msg.error) {
                    return this.toast.showSimple(msg.error);
                }
                return this.toast.showSimple('Auto Login URLs Refreshed');
            } else {
                $rootScope.$apply(() => $rootScope.$broadcast(msg.cmd, msg));
            }
        });
    }

    create(name) {
        return new this.promise((resolve, reject) => {
            const that = this;
            this.port.onMessage.addListener(function create(msg) {
                if (msg.cmd !== 'create') {
                    return;
                }

                that.port.onMessage.removeListener(create);

                if (msg.error) {
                    return reject(new Error(msg.error));
                }

                return resolve();
            });

            this.port.postMessage({
                name,
                cmd: 'create'
            });
        });
    }

    decrypt(name) {
        return this.bg.getMasterPassword().then((password) => {
            return new this.promise((resolve, reject) => {
                const that = this;
                this.port.onMessage.addListener(function decrypt(msg) {
                    if (msg.cmd !== 'decrypt') {
                        return;
                    }

                    that.port.onMessage.removeListener(decrypt);

                    if (msg.error) {
                        return reject(new Error(msg.error));
                    }

                    return resolve(msg.password);
                });

                this.port.postMessage({
                    name,
                    password,
                    cmd: 'decrypt'
                });
            });
        });
    }

    del(name) {
        return new this.promise((resolve, reject) => {
            const that = this;
            this.port.onMessage.addListener(function del(msg) {
                if (msg.cmd !== 'del') {
                    return;
                }
                that.port.onMessage.removeListener(del);

                if (msg.error) {
                    return reject(new Error(msg.error));
                }

                return resolve();
            });

            this.port.postMessage({
                name,
                cmd: 'del'
            });
        });
    }

    encrypt(name, content) {
        return this.bg.getMasterPassword().then((password) => {
            return new this.promise((resolve, reject) => {
                const that = this;
                this.port.onMessage.addListener(function encrypt(msg) {
                    if (msg.cmd !== 'encrypt') {
                        return;
                    }

                    that.port.onMessage.removeListener(encrypt);

                    if (msg.error) {
                        return reject(new Error(msg.error));
                    }

                    return resolve(msg);
                });

                this.port.postMessage({
                    name,
                    content,
                    password,
                    cmd: 'encrypt'
                });
            });
        });
    }

    refresh(password) {
        this.port.postMessage({
            password,
            cmd: 'refresh'
        });
    }
}

North.$injects = ['$q', '$rootScope', 'tabs', 'bg', '$mdToast'];
