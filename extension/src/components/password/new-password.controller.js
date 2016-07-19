'use strict';

export default class NewPasswordController {
    constructor($mdDialog, $mdToast, data, filename, north) {
        this.dialog = $mdDialog;
        this.toast = $mdToast;
        this.data = data;
        this.filename = filename;
        this.north = north;
    }

    cancel() {
        this.dialog.cancel();
    }

    create() {
        if (this.form.$valid) {
            return this.north.create(this.filename).then(() => {
                this.data.addFile(this.filename);
                this.dialog.hide(this.filename);
            })
            .catch(err => this.toast.showSimple(err.message));
        }
        if (!this.form.filename.$touched) {
            this.form.filename.$setTouched();
        }
    }
}

NewPasswordController.$inject = ['$mdDialog', '$mdToast', 'data', 'filename', 'north'];
