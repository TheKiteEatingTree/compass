'use strict';

import Random from './../../services/Random.js';

export default class HomeController {
    constructor($timeout, pgp) {
        this.timeout = $timeout;
        this.pgp = pgp;

        this.passwords = [];

        const port = chrome.runtime.connect('pnhaikohelnlfpmjgiajjlgliofccjdc');
        port.postMessage({cmd: 'sendFiles'});
        port.onMessage.addListener((msg) => {
            if (msg.cmd === 'sendFiles') {
                console.log(msg.files);
                this.passwords = msg.files;
            }
        });
    }

    decryptPassword(password) {
        this.pgp.decrypt(password).then((password) => {
            this.copy(password.password);
            this.timeout(() => this.copy(Random.generateString()), 60 * 1000);
        }).catch(err => console.error(err));
    }

    copy(txt) {
        const clipboard = document.createElement('textarea');
        clipboard.value = txt;
        document.body.appendChild(clipboard);
        clipboard.select();
        document.execCommand('cut');
        document.body.removeChild(clipboard);
    }
}

HomeController.$inject = ['$timeout', 'pgp'];
