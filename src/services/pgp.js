'use strict';

import * as openpgp from 'openpgp';
import Password from './../models/Password.js';

export default class PGP {
    constructor($q, storage) {
        this.promise = $q;
        this.storage = storage;

        // this.privateKey = this.storage.fetch('privateKey').then((result) => {
        //     if (result !== null) {
        //         return this.fileSystem.restoreEntry(result.privateKey);
        //     }
        //     return null;
        // }).catch((err) => {
        //     console.error(err);
        //     return null;
        // });
    }

    decrypt(file) {
        return this.privateKey.then((privateKey) => {
            if (privateKey === null) {
                return this.promise.reject('No private key selected');
            }
            return this.fileSystem.readFileAsText(privateKey);
        }).then((keyFileContents) => {
            const privateKey = openpgp.key.readArmored(keyFileContents).keys[0];
            if (privateKey.err) {
                return this.promise.reject(privateKey.err);
            }

            return this.promise.all([
                this.promise.when(privateKey),
                this.fileSystem.readFileAsBlob(file)
            ]);
        }).then((results) => {
            const privateKey = results[0];

            try {
                const success = privateKey.decrypt('password');
                if (!success) {
                    throw new Error('Failed to decrypt private key');
                }
            } catch(err) {
                return this.promise.reject(err);
            }

            const message = openpgp.message.read(results[1]);

            const options = {
                message: message,
                privateKey: privateKey,
                armor: false
            };

            return openpgp.decrypt(options);
        }).then(result => new Password(result));
    }

    selectPrivateKey() {
        return this.fileSystem.chooseEntry({
            type: 'openFile',
            accepts: [{extensions: ['asc']}],
            acceptsAllTypes: false
        }).then((entry) => {
            const keyId = this.fileSystem.retainEntry(entry);
            return this.promise.all([
                this.promise.when(entry),
                this.storage.save({'privateKey': keyId})
            ]);
        }).then((results) => {
            const entry = results[0];
            this.privateKey = this.promise.when(entry);
            return entry;
        });
    }
}

PGP.$injects = ['$q', 'storage'];
