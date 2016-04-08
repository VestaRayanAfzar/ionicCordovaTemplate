import {CordovaPlugin} from "./CordovaPlugin";

export class NetworkPlugin extends CordovaPlugin {
    private connType:string;

    constructor() {
        super();
        if (!navigator.connection || !window['Connection']) {
            this.mock();
        }
        this.getConnectionType();
        document.addEventListener('online', ()=> {
            this.changeStatus(true);
        }, false);
        document.addEventListener('offline', ()=> {
            this.changeStatus(false);
        }, false);
    }

    private changeStatus(online:boolean) {
        this.getConnectionType();
    }

    public getConnectionType():string {
        if (this.mockingMode) return navigator.onLine ? Connection.WIFI : Connection.NONE;
        this.connType = navigator.connection && navigator.connection.type;
        return this.connType;
    }

    public isOnline():boolean {
        if (this.mockingMode) return navigator.onLine;
        this.getConnectionType();
        return this.connType != Connection.UNKNOWN && this.connType != Connection.NONE;
    }

    protected mock():void {
        this.mockingMode = true;
        window['Connection'] = {
            UNKNOWN: "unknown",
            ETHERNET: "ethernet",
            WIFI: "wifi",
            CELL_2G: "2g",
            CELL_3G: "3g",
            CELL_4G: "4g",
            CELL: "cellular",
            NONE: "none"
        };
        this.connType = Connection.UNKNOWN;
    }
}
