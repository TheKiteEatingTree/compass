'use strict';

export default class HomeController {
    constructor($scope, $location, style, north, bg, $mdDialog) {
        style.reset();
        style.addHeaderShadow();

        this.scope = $scope;
        this.location = $location;
        this.north = north;
        this.bg = bg;
        this.dialog = $mdDialog;

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

    addPassword(ev) {
        const confirm = this.dialog.prompt()
            .title('New Password')
            .textContent('Enter a password file name.  Use \'/\' to create folders')
            .placeholder('amazon')
            .ariaLabel('Password file name')
            .targetEvent(ev)
            .ok('Create')
            .cancel('Cancel');

        this.dialog.show(confirm).then(function(result) {
            console.log(result);
        }, function() {
            console.log('canceled?');
        });
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
            this.location.path('/password').search('file', name);
        }
    }
}

HomeController.$inject = ['$scope', '$location', 'style', 'north', 'bg', '$mdDialog'];
