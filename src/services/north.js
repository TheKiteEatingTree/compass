'use strict';

export default class North {
    constructor($rootScope) {
        this.port = chrome.runtime.connect('pnhaikohelnlfpmjgiajjlgliofccjdc');
        this.port.onMessage.addListener((msg) => {
            $rootScope.$apply(() => $rootScope.$broadcast(msg.cmd, msg));
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

    testPassword(password) {
        this.port.postMessage({
            cmd: 'testPassword',
            password: password
        });
    }
}

North.$injects = ['$rootScope'];
