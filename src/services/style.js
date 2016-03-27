'use strict';

export default class Style {
    constructor() {
        this.body = "";
        this.nav = "";
    }

    reset() {
        this.body = "";
        this.nav = "";
    }

    addHeaderShadow() {
        this.nav = "md-whiteframe-4dp";
    }

    cyanBg() {
        this.body = "cyan-bg";
    }
}

Style.$injects = [];
