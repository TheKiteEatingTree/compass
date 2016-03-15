'use strict';

import Random from './../../services/Random.js';

export default class HomeController {
    constructor($timeout, pgp) {
        this.timeout = $timeout;
        this.pgp = pgp;

        this.root = {};
        this.current = {};

        const port = chrome.runtime.connect('pnhaikohelnlfpmjgiajjlgliofccjdc');
        port.postMessage({cmd: 'sendFiles'});
        port.onMessage.addListener((msg) => {
            if (msg.cmd === 'sendFiles') {
                this.root = msg.files;
                this.current = this.root;
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

    goUp() {
        this.current = this.current.up;
    }

    selectFile(file) {
        if (file.files) {
            const temp = this.current;
            this.current = file;
            this.current.up = temp;
        }
    }
}

HomeController.$inject = ['$timeout', 'pgp'];
