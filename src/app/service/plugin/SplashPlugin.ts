import {CordovaPlugin} from './CordovaPlugin';

interface ISplashScreenPlugin {
    /** Dismiss the splash screen. */
    hide(): void;
    /** Displays the splash screen. */
    show(): void;
}

export class SplashPlugin extends CordovaPlugin {
    private splash: ISplashScreenPlugin;

    constructor() {
        super();
        this.splash = navigator.splashscreen;
        if (!this.splash) {
            this.mock();
        }
    }

    hide() {
        this.splash.hide();
    }

    show() {
        this.splash.show();
    }

    protected mock() {
        this.mockingMode = true;
        this.splash = {
            hide: function () {
                console.log('Mocking SplashScreen plugin: hide');
            },
            show: function () {
                console.log('Mocking SplashScreen plugin: show');
            }
        };
    }
}
