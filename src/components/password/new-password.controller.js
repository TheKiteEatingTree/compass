'use strict';

export default class NewPasswordController {
    constructor($scope, $mdDialog, $mdToast, filename, north) {
        this.scope = $scope;
        this.dialog = $mdDialog;
        this.toast = $mdToast;
        this.north = north;

        this.filename = filename;

        this.scope.$on('create', (event, msg) => {
            if (msg.error) {
                return this.toast.show(this.toast.simple().textContent(msg.error));
            }

            return this.dialog.hide(this.filename);
        });
    }

    cancel() {
        this.dialog.cancel();
    }

    create() {
        if (this.form.$valid) {
            return this.north.create(this.filename);
        }
        if (!this.form.filename.$touched) {
            this.form.filename.$setTouched();
        }
    }
}

NewPasswordController.$inject = ['$scope', '$mdDialog', '$mdToast', 'filename', 'north'];
