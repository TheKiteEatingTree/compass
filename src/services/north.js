'use strict';

export default class North {
    constructor($q, $rootScope, tabs, bg, $mdToast) {
        this.promise = $q;
        this.toast = $mdToast;
        this.bg = bg;
        this.port = chrome.runtime.connect('pnhaikohelnlfpmjgiajjlgliofccjdc');

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
        this.port.postMessage({
            name,
            cmd: 'create'
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

    encrypt(name, content, password) {
        this.port.postMessage({
            name,
            content,
            password,
            cmd: 'encrypt'
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
