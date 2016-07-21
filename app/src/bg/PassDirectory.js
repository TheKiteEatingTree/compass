'use strict';

import fs from 'fsystem';
import storage from './storage.js';

function filterFn(file) {
    if (file.name[0] === '.' || (file.isFile && file.name.slice(-4) !== '.gpg')) {
        return false;
    }

    return true;
}

export default class PassDirectory {
    constructor(dir) {
        this.dir = dir;
    }

    static fetch() {
        return storage.fetch('passDir').then((keyId) => {
            if (!keyId) {
                throw new Error('No directory saved');
            }
            return fs.restoreEntry(keyId);
        }).then((dir) => {
            if (!dir) {
                throw new Error('Could not find directory');
            }
            return new PassDirectory(dir);
        });
    }

    static save(dir) {
        const keyId = dir.retain();
        return storage.save({'passDir': keyId}).then(() => {
            return new PassDirectory(dir);
        });
    }

    deleteFile(name) {
        const parts = name.split('/');

        return this.findFile(name)
            .then(file => file.del())
            .then(() => {
                parts.pop();
                return this._deleteEmptyDirs(parts);
            });
    }

    getDisplayPath() {
        return this.dir.getDisplayPath();
    }

    getFiles() {
        return this.dir.readRecursive(filterFn);
    }

    getSimpleFiles() {
        return this.dir.getSimpleFiles(filterFn);
    }

    getFlatFiles() {
        return this.dir.getFlatFiles(filterFn);
    }

    findFile(name) {
        return this.dir.getFile(name);
    }

    createFile(name, exclusive) {
        return this.dir.createFile(name, exclusive);
    }

    _deleteEmptyDirs(parts) {
        if (parts.length === 0) {
            return Promise.resolve();
        }

        return this.dir.getDirectory(parts.join('/'))
            .then((dir) => {
                return Promise.all([
                    Promise.resolve(dir),
                    dir.read()
                ]);
            }).then(([dir, files]) => {
                if (files.length) {
                    return;
                }

                return dir.del().then(() => {
                    parts.pop();
                    return this._deleteEmptyDirs(parts);
                });
            });
    }
}
