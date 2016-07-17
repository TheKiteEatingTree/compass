'use strict';

import * as inject from './inject.js';

export default class AutoLogin {
    constructor(north, tabs) {
        this.north = north;
        this.tabs = tabs;
    }

    login(file) {
        return this.north.decrypt(file).then((password) => {
            let user = '';
            let pass = '';
            if (password.user) {
                user = password.user.replace(/\'/g, '\\\'');
            }
            if (password.password) {
                pass = password.password.replace(/\'/g, '\\\'');
            }
            return this.tabs.executeScript({
                code: inject.getCode(user, pass)
            });
        });
    }
}

AutoLogin.$injects = ['north', 'tabs'];
