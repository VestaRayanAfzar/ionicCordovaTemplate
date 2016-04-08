import {CordovaPlugin} from "./CordovaPlugin";

export class StatusbarPlugin extends CordovaPlugin {
    private statusbar: StatusBar;

    constructor() {
        super();
        this.statusbar = window.StatusBar;
        if (!this.statusbar) {
            this.mock();
        }
    }

    styleDefault(): void {
        this.statusbar.styleDefault();
    }

    protected mock(): void {
        this.mockingMode = true;
        this.statusbar = <StatusBar>{
            styleDefault() {
                console.log('Mocking Statusbar: styleDefault');
            }
        };
    }
}