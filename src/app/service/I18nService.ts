import {IClientAppSetting} from "../config/setting";
import {I18N, ILocale} from "../cmn/I18N";

export class I18nService {
    private i18nLocale:ILocale;
    public static $inject = ['Setting'];

    constructor(Setting:IClientAppSetting) {
        this.i18nLocale = I18N.getLocale(Setting.locale);
    }

    public get(property?:string) {
        if (!property) return this.i18nLocale;
        return this.i18nLocale[property];
    }
}