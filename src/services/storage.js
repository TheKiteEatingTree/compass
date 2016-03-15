'use strict';

export default class Storage {
    constructor($rootScope, $q) {
        this.scope = $rootScope;
        this.promise = $q;
    }

    fetch(key) {
        return this.promise(function(resolve, reject) {
            chrome.storage.local.get(key, (value) => {
                if (chrome.runtime.lastError) {
                    return reject(chrome.runtime.lastError);
                }
                return resolve(value);
            });
        });
    }

    save(object) {
        return this.promise(function(resolve, reject) {
            chrome.storage.local.set(object, () => {
                if (chrome.runtime.lastError) {
                    return reject(chrome.runtime.lastError);
                }
                return resolve();
            });
        });
    }
}

Storage.$injects = ['$rootScope', '$q'];
