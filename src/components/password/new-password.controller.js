'use strict';

export default class NewPasswordController {
    constructor($mdDialog, filename) {
        this.dialog = $mdDialog;

        this.filename = filename;
    }

    cancel() {
        this.dialog.cancel();
    }

    create() {
        if (this.form.$valid) {
            return this.dialog.hide(this.filename);
        }
        if (!this.form.filename.$touched) {
            this.form.filename.$setTouched();
        }
    }
}

NewPasswordController.$inject = ['$mdDialog', 'filename'];
