'use strict';

export default class HomeController {
    constructor($scope, style, north, bg) {
        style.reset();
        this.scope = $scope;
        this.north = north;
        this.bg = bg;

        this.root = {};
        this.current = {};

        this.scope.$on('sendFiles', (event, msg) => {
            this.root = msg.files;
            this.current = this.root;
        });

        this.scope.$on('decrypt', (event, msg) => {
            if (!msg.error) {
                this.bg.getBackgroundPage().then((bg) => {
                    bg.copyPassword(msg.password.password);
                    window.close();
                });
            }
        });

        this.north.sendFiles();
    }

    decrypt(file) {
        const prefixName = (current, name) => {
            if (current.up) {
                return prefixName(current.up, `${current.name}/${name}`);
            }
            return name;
        };

        const name = prefixName(this.current, file.name);
        this.bg.getBackgroundPage().then((bg) => {
            const password = bg.getPassword();
            this.north.decrypt(name, password);
        });
    }

    goUp() {
        this.current = this.current.up;
    }

    selectFile(file) {
        if (file.files) {
            const temp = this.current;
            this.current = file;
            this.current.up = temp;
        } else {
            this.decrypt(file);
        }
    }
}

HomeController.$inject = ['$scope', 'style', 'north', 'bg'];
