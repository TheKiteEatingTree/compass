'use strict';

function fileSort(a, b) {
    if (a.files && !b.files) {
        return -1;
    } else if (b.files && !a.files) {
        return 1;
    } else {
        return a.name.localeCompare(b.name);
    }
}

export default class Data {
    constructor($q, north) {
        this.promise = $q;
        this.north = north;

        this.files = {};
        this.matches = [];
    }

    addFile(file) {
        const parts = file.split('/');
        let current = this.files;

        for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i];
            let next = current.files.find(file => file.name === part);
            if (!next) {
                next = {
                    name: part,
                    files: []
                };
                current.files.push(next);
                current.files.sort(fileSort);
            }
            current = next;
        }

        current.files.push({name: `${parts[parts.length - 1]}.gpg`});
        current.files.sort(fileSort);
    }

    login(password, url) {
        return new this.promise((resolve, reject) => {
            const that = this;
            this.north.port.onMessage.addListener(function loadData(msg) {
                if (msg.cmd !== 'login') {
                    return;
                }

                that.north.port.onMessage.removeListener(loadData);

                if (msg.error) {
                    return reject(new Error(msg.error));
                }

                that.files = msg.files;
                that.matches = msg.matches;

                return resolve();
            });

            this.north.port.postMessage({
                password,
                url,
                cmd: 'login'
            });
        });

    }
}

Data.$injects = ['$q', 'north'];
