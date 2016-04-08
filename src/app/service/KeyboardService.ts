import {KeyboardPlugin} from "./plugin/KeyboardPlugin";

export class KeyboardService {
    private kbPlugin:KeyboardPlugin;
    public static $inject = [];

    constructor() {
        this.kbPlugin = new KeyboardPlugin();
    }

    public hideKeyboardAccessoryBar(hide:boolean = true) {
        this.kbPlugin.hideKeyboardAccessoryBar(hide);
    }

    public disableScroll(disable:boolean = true) {
        this.kbPlugin.disableScroll(disable);
    }

    public show() {
        this.kbPlugin.show();
    }

    get isVisible():boolean {
        return this.kbPlugin.isVisible;
    }
}