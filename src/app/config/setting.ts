import {IVariantClientAppSetting, VariantClientAppSetting} from './setting.var';

export interface IClientAppSetting extends IVariantClientAppSetting {
    name: string;
    version: {app:string, api: string};
    locale: string;
}

export var setting: IClientAppSetting = {
    name: 'ionicCordovaTemplate',
    version: {
        app: '0.1.0',
        api: 'v1'
    },
    locale: 'fa-IR',
    api: VariantClientAppSetting.api,
    env: VariantClientAppSetting.env
};
