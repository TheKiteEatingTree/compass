'use strict';

export default class SettingsController {
    constructor(storage, passwordList, pgp, fileSystem, $q) {
        this.storage = storage;
        this.passwordList = passwordList;
        this.pgp = pgp;
        this.fileSystem = fileSystem;
        this.promise = $q;

        this.pgp.privateKey.then(entry => {
            if (entry !== null) {
                return this.fileSystem.getDisplayPath(entry);
            }
            return '';
        })
        .then(displayPath => this.keyPath = displayPath)
        .catch((err) => console.error(err));

        this.passwordList.passDir.then(entry => {
            if (entry !== null) {
                return this.fileSystem.getDisplayPath(entry);
            }
            return '';
        })
        .then(displayPath => this.passDir = displayPath)
        .catch((err) => console.error(err));
    }

    selectKey() {
        this.pgp.selectPrivateKey().then(entry => this.fileSystem.getDisplayPath(entry))
            .then(displayPath => this.keyPath = displayPath)
            .catch(err => console.error(err));
    }

    selectDir() {
        this.passwordList.selectPassDir().then(entry => this.fileSystem.getDisplayPath(entry))
            .then(displayPath => this.passDir = displayPath)
            .catch(err => console.error(err));
    }
}

SettingsController.$inject = ['storage', 'passwordList', 'pgp', 'fileSystem', '$q'];
