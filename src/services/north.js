'use strict';

import * as inject from './inject.js';

export default class North {
    constructor($rootScope, tabs) {
        this.port = chrome.runtime.connect('pnhaikohelnlfpmjgiajjlgliofccjdc');
        this.port.onMessage.addListener((msg) => {
            if (msg.cmd === 'foundPassword') {
                let user = '';
                let password = '';
                if (msg.user) {
                    user = msg.user.replace(/\'/g, '\\\'');
                }
                if (msg.password) {
                    password = msg.password.replace(/\'/g, '\\\'');
                }

                tabs.executeScript({
                    code: inject.getCode(user, password)
                });
            } else {
                $rootScope.$apply(() => $rootScope.$broadcast(msg.cmd, msg));
            }
        });
    }

    decrypt(name, password) {
        this.port.postMessage({
            cmd: 'decrypt',
            name: name,
            password: password
        });
    }

    sendFiles() {
        this.port.postMessage({cmd: 'sendFiles'});
    }

    testPassword(password, url) {
        this.port.postMessage({
            cmd: 'testPassword',
            password: password,
            url: url
        });
    }
}

North.$injects = ['$rootScope', 'tabs'];
