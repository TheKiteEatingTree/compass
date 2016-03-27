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

    showLeftButton(icon, handler) {
        this.leftButton = {
            icon,
            handler
        };
    }
}

Style.$injects = [];
