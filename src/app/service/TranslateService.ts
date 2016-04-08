import {IClientAppSetting} from "../config/setting";
import {Dictionary} from "../cmn/locale/Dictionary";

export class TranslateService {
    private dictionary:Dictionary;
    public static $inject = ['Setting'];

    constructor(Setting:IClientAppSetting) {
        this.dictionary = new Dictionary(Setting.locale);
    }

    public translate(key:string, ...placeholders:Array<string>):string {
        if (!key) return '';
        if (!placeholders.length) return this.dictionary.get(key) || key;
        var tr = this.dictionary.get(key);
        if (!tr) return key;
        for (var i = 0, il = placeholders.length; i < il; ++i) {
            tr = tr.replace('%', placeholders[i]);
        }
        return tr;
    }
}