import {TranslateService} from "../service/TranslateService";

export function translateFilter(translateService:TranslateService) {
    return function (key:string, ...placeholders:Array<string>):string {
        return translateService.translate(key, ...placeholders);
    }
}

translateFilter.$inject = ['translateService'];