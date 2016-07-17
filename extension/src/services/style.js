'use strict';

export default class Style {
    constructor() {
        this.reset();
    }

    reset() {
        this.body = "";
        this.nav = "";
        this.leftButton = false;
        this.rightButton = false;
    }

    addHeaderShadow() {
        this.nav = "md-whiteframe-4dp";
    }

    cyanBg() {
        this.body = "cyan-bg";
    }

    hideLeftButton() {
        this.leftButton = false;
    }

    hideRightButton() {
        this.rightButton = false;
    }

    showLeftButton(aria, icon, handler) {
        this.leftButton = {
            aria,
            icon,
            handler
        };
    }

    showRightButton(aria, icon, handler) {
        this.rightButton = {
            aria,
            icon,
            handler
        };
    }
}

Style.$injects = [];
