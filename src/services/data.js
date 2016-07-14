'use strict';

export default class Data {
    constructor($q, north) {
        this.promise = $q;
        this.north = north;

        this.files = {};
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
