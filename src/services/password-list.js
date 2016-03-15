'use strict';

export default class PasswordList {
    constructor($q, storage, fileSystem) {
        this.promise = $q;
        this.storage = storage;
        this.fileSystem = fileSystem;

        this.passwords = [];

        this.passDir = this.storage.fetch('passDir').then((result) => {
            if (result !== null) {
                return this.fileSystem.restoreEntry(result.passDir);
            }
            return null;
        }).catch((err) => {
            console.error(err);
            return null;
        });

        this.refreshPasswordList();
    }

    refreshPasswordList() {
        this.passwords = [];
        return this.passDir.then((entry) => {
            return this.fileSystem.readDirRecursive(entry);
        }).then((result) => {
            this.passwords = result.files;
            return this.passwords;
        });
    }

    selectPassDir() {
        return this.fileSystem.chooseEntry({
            type: 'openDirectory'
        }).then((entry) => {
            const keyId = this.fileSystem.retainEntry(entry);
            return this.promise.all([
                this.promise.when(entry),
                this.storage.save({'passDir': keyId})
            ]);
        }).then((results) => {
            const entry = results[0];
            this.passDir = this.promise.when(entry);
            return entry;
        });
    }
}

PasswordList.$injects = ['$q', 'storage', 'fileSystem'];
