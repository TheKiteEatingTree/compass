'use strict';

export default class Tabs {
    constructor($q) {
        this.promise = $q;
    }

    getCurrent() {
        return this.promise(function(resolve, reject) {
            chrome.tabs.query({
                active: true,
                currentWindow: true
            }, (tabs) => {
                if (chrome.runtime.lastError) {
                    return reject(chrome.runtime.lastError);
                }
                return resolve(tabs[0]);
            });
        });
    }

    executeScript(options) {
        return this.promise(function(resolve, reject) {
            chrome.tabs.executeScript(options, (results) => {
                if (chrome.runtime.lastError) {
                    return reject(chrome.runtime.lastError);
                }
                console.log(results);
                return resolve(results);
            });
        });
    }
}

Tabs.$injects = ['$q'];
