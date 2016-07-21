'use strict';

import Random from './../../shared/Random.js';

window.copyPassword = copyPassword;
window.getPassword = getPassword;
window.savePassword = savePassword;

let password = "";
let masterTimeout = null;
let copyTimeout = null;

const CLEAR_MASTER_INTERVAL = 60;

chrome.idle.setDetectionInterval(CLEAR_MASTER_INTERVAL);
chrome.idle.onStateChanged.addListener((idleState) => {
    if (idleState === 'locked' || idleState === 'idle') {
        const views = chrome.extension.getViews({type: 'popup'});
        views.forEach((view) => view.close());

        password = "";
        masterTimeout = null;
    }
});

function copy(txt) {
    const clipboard = document.createElement('textarea');
    clipboard.value = txt;
    document.body.appendChild(clipboard);
    clipboard.select();
    document.execCommand('cut');
    document.body.removeChild(clipboard);
}

function copyPassword(txt) {
    if (copyTimeout) {
        window.clearTimeout(copyTimeout);
    }
    copy(txt);
    copyTimeout = window.setTimeout(() => {
        copyTimeout = null;
        copy(Random.generateString());
    }, 30 * 1000);
}

function getPassword() {
    if (masterTimeout) {
        window.clearTimeout(masterTimeout);
        startTimeout();
    }
    return password;
}

function savePassword(_password) {
    password = _password;
    // if (masterTimeout) {
    //     window.clearTimeout(masterTimeout);
    // }
    // startTimeout();
}

function startTimeout() {
    masterTimeout = window.setTimeout(() => {
        const views = chrome.extension.getViews({type: 'popup'});
        if (views.length) {
            window.clearTimeout(masterTimeout);
            startTimeout();
        } else {
            password = "";
            masterTimeout = null;
        }
    }, CLEAR_MASTER_INTERVAL * 1000);
}
