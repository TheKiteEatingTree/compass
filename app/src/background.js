'use strict';

import * as urls from './bg/urls.js';
import * as pgp from './bg/pgp.js';
import Password from './bg/Password.js';
import PrivateKey from './bg/PrivateKey.js';
import PublicKey from './bg/PublicKey.js';
import PassDirectory from './bg/PassDirectory.js';

window.passDir = PassDirectory.fetch();
window.privateKey = PrivateKey.fetch();
window.publicKey = PublicKey.fetch();
window.savePassDir = savePassDir;
window.savePrivateKey = savePrivateKey;
window.savePublicKey = savePublicKey;

chrome.app.runtime.onLaunched.addListener(() => {
    chrome.app.window.create('index.html', {
        'outerBounds': {
            'width': 500,
            'height': 400
        }
    });
});

chrome.runtime.onConnectExternal.addListener((port) => {
    port.onMessage.addListener((msg) => {
        if (msg.cmd === 'del') {
            del(msg.name, port);
        } else if (msg.cmd === 'login') {
            login(msg.password, msg.url, port);
        } else if (msg.cmd === 'decrypt') {
            decrypt(msg.name, msg.password, port);
        } else if (msg.cmd === 'encrypt') {
            encrypt(msg.name, msg.content, msg.password, port);
        } else if (msg.cmd === 'create') {
            create(msg.name, port);
        } else if (msg.cmd === 'refresh') {
            refresh(msg.password, port);
        }
    });
});

function create(name, port) {
    const msg = {cmd: 'create'};
    window.passDir.then((dir) => {
        return Promise.all([
            dir.createFile(`${name}.gpg`),
            window.publicKey
        ]);
    }).then((results) => {
        const file = results[0];
        const publicKey = results[1];

        const password = new Password();
        password.generatePassword();

        return pgp.encrypt(publicKey, file, password.toString());
    })
    .then(() => port.postMessage(msg))
    .catch((err) => {
        msg.error = err.message;
        port.postMessage(msg);
    });
}

function del(name, port) {
    const msg = {cmd: 'del'};
    window.passDir
        .then(dir => dir.deleteFile(name))
        .then(() => {
            port.postMessage(msg);
        })
        .catch((err) => {
            msg.error = err.message;
            port.postMessage(msg);
        });
}

function savePassDir(dir) {
    window.passDir = PassDirectory.save(dir);
    return window.passDir;
}

function savePrivateKey(key) {
    window.privateKey = PrivateKey.save(key);
    return window.privateKey;
}

function savePublicKey(key) {
    window.publicKey = PublicKey.save(key);
    return window.publicKey;
}

function decrypt(name, password, port) {
    const msg = {cmd: 'decrypt'};
    window.passDir.then((passDir) => {
        return Promise.all([
            passDir.findFile(name),
            window.privateKey
        ]);
    }).then((results) => {
        const file = results[0];
        const privateKey = results[1];

        return pgp.decrypt(privateKey, file, password);
    }).then((result) => {
        const password = new Password(result.data);
        msg.password = password.toJSON();
        port.postMessage(msg);
    }).catch((err) => {
        msg.error = err.message;
        port.postMessage(msg);
    });
}

function encrypt(name, content, masterPass, port) {
    const msg = {cmd: 'encrypt'};
    window.passDir.then((passDir) => {
        return Promise.all([
            passDir.findFile(name),
            window.publicKey
        ]);
    }).then((results) => {
        const file = results[0];
        const publicKey = results[1];

        const password = new Password(content);

        urls.editUrl(name, password.url, masterPass);
        return pgp.encrypt(publicKey, file, password.toString());
    }).then(() => {
        port.postMessage(msg);
    }).catch((err) => {
        msg.error = err.message;
        port.postMessage(msg);
    });
}

function refresh(password, port) {
    const msg = {cmd: 'refresh'};
    urls.refreshUrls(password)
        .then(() => port.postMessage(msg))
        .catch((err) => {
            msg.error = err.message;
            port.postMessage(msg);
        });
}

function login(password, url, port) {
    const msg = {cmd: 'login'};
    window.privateKey
        .then(privateKey => privateKey.testPassword(password))
        .then(() => window.passDir)
        .then((passDir) => {
            return Promise.all([
                passDir.getSimpleFiles(),
                urls.find(url, password)
            ]);
        }).then(([files, matches]) => {
            msg.files = files;
            msg.matches = matches;
            port.postMessage(msg);
        }).catch((err) => {
            msg.error = err.message;
            port.postMessage(msg);
        });
}
