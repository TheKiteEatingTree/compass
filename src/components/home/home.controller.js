'use strict';

export default class HomeController {
    constructor($scope, $location, style, north, bg) {
        style.reset();
        style.addHeaderShadow();
        
        this.scope = $scope;
        this.location = $location;
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

    copyPassword(evt, file) {
        evt.stopPropagation();
        const name = this.prefixName(this.current, file.name);
        this.bg.getBackgroundPage().then((bg) => {
            const password = bg.getPassword();
            this.north.decrypt(name, password);
        });
    }

    goUp() {
        this.current = this.current.up;
    }

    prefixName(current, name) {
        if (current.up) {
            return this.prefixName(current.up, `${current.name}/${name}`);
        }
        return name;
    }

    selectFile(file) {
        if (file.files) {
            const temp = this.current;
            this.current = file;
            this.current.up = temp;
        } else {
            const name = this.prefixName(this.current, file.name);
            this.location.path(`/password/${name}`);
        }
    }
}

HomeController.$inject = ['$scope', '$location', 'style', 'north', 'bg'];
