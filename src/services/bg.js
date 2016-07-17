'use strict';

export default class BG {
    constructor($q) {
        this.promise = $q;
    }

    copyPassword(password) {
        return this.getBackgroundPage()
            .then(bg => bg.copyPassword(password));
    }

    getBackgroundPage() {
        return this.promise(function(resolve, reject) {
            chrome.runtime.getBackgroundPage((bg) => {
                if (chrome.runtime.lastError) {
                    return reject(chrome.runtime.lastError);
                }
                return resolve(bg);
            });
        });
    }

    getMasterPassword() {
        return this.getBackgroundPage()
            .then(bg => bg.getPassword());
    }
}

BG.$injects = ['$q'];
