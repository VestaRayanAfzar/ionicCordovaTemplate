import {ToastPlugin} from "./plugin/ToastPlugin";

export class NotificationService {
    static Positions = {Top: 'top', Center: 'center', Bottom: 'bottom'};
    static Duration = {Short: 'short', Long: 'long'};
    private toastPlugin:ToastPlugin;

    constructor() {
        this.toastPlugin = new ToastPlugin();
    }

    public toast(message:string, duration?:string, position?:string) {
        this.toastPlugin.show(message, duration, position);
    }
}