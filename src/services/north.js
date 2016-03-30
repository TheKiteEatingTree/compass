'use strict';

import * as inject from './inject.js';
// import Random from './../utils/Random.js';

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


function loginBySettingValue(tabs, msg) {
    let user = '';
    let password = '';
    if (msg.password.user) {
        user = msg.password.user.replace(/\'/g, '\\\'');
    }
    if (msg.password.password) {
        password = msg.password.password.replace(/\'/g, '\\\'');
    }
    return tabs.executeScript({
        code: inject.getCode(user, password)
    });
}

export default class North {
    constructor($rootScope, tabs, bg) {
        this.port = chrome.runtime.connect('pnhaikohelnlfpmjgiajjlgliofccjdc');
        this.port.onMessage.addListener((msg) => {
            if (msg.cmd === 'foundPassword') {
                // loginByPasting(bg, tabs, msg);
                loginBySettingValue(tabs, msg);
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

    decrypt(name, password) {
        this.port.postMessage({
            name,
            password,
            cmd: 'decrypt'
        });
    }

    encrypt(name, content) {
        this.port.postMessage({
            name,
            content,
            cmd: 'encrypt'
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

North.$injects = ['$rootScope', 'tabs', 'bg'];
