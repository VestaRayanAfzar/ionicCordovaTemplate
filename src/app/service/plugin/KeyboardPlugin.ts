import {CordovaPlugin} from "./CordovaPlugin";

export class KeyboardPlugin extends CordovaPlugin {
    private keyboard:any;

    constructor() {
        super();
        if (cordova.plugins && cordova.plugins['Keyboard']) {
            this.keyboard = cordova.plugins['Keyboard'];
        } else {
            this.mock();
        }
    }

    public hideKeyboardAccessoryBar(hide:boolean = true) {
        this.keyboard.hideKeyboardAccessoryBar(hide);
    }

    public disableScroll(disable:boolean = true) {
        this.keyboard.disableScroll(disable);
    }

    public show() {
        this.keyboard.show();
    }

    get isVisible():boolean {
        return this.keyboard.isVisible;
    }

    protected mock():void {
        this.mockingMode = true;
        this.keyboard = {
            hideKeyboardAccessoryBar(hide:boolean = true) {
                console.log(`Mocking Keyboard plugin: hideKeyboardAccessoryBar(${hide})`);
            },
            disableScroll(disable:boolean = true) {
                console.log(`Mocking Keyboard plugin: disableScroll(${disable})`);
            },
            show(){
                console.log(`Mocking Keyboard plugin: show()`);
            },
            isVisible: false
        }
    }
}