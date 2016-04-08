import {setting, IClientAppSetting} from './config/setting';
import {IRouteFunction, router} from './config/route';
import {ClientApp} from './ClientApp';
import * as imp from './config/import';

if (window.cordova) {
    document.addEventListener('deviceready', onDeviceReady, false);
} else {
    console.log('running app without the deviceready event {Mocking Mode}');
    window.cordova = <Cordova>{};
    onDeviceReady();
}

function onDeviceReady() {
    var clientApp = new ClientApp(setting, router);

    clientApp.module.service('i18nService', imp.I18nService);
    clientApp.module.service('translateService', imp.TranslateService);
    clientApp.module.service('apiService', imp.ApiService);
    clientApp.module.service('authService', imp.AuthService);
    clientApp.module.service('storageService', imp.StorageService);
    clientApp.module.service('formService', imp.FormService);
    clientApp.module.service('databaseService', imp.DatabaseService);
    clientApp.module.service('notificationService', imp.NotificationService);
    clientApp.module.service('splashService', imp.SplashService);
    clientApp.module.service('networkService', imp.NetworkService);
    clientApp.module.service('datePickerService', imp.DatePickerService);
    ///<vesta:ngService/>
    clientApp.module.filter('dateTime', imp.dateTimeFilter);
    clientApp.module.filter('tr', imp.translateFilter);
    ///<vesta:ngFilter/>
    clientApp.module.controller('baseController', imp.BaseController);
    clientApp.module.controller('homeController', imp.HomeController);
    ///<vesta:ngController/>
    clientApp.module.directive('animDirection', imp.animDirection);
    clientApp.module.directive('currencyInput', imp.currencyInput);
    clientApp.module.directive('dateInput', imp.dateInput);
    clientApp.module.directive('fileUpload', imp.fileUpload);
    clientApp.module.directive('roundImage', imp.roundImage);
    ///<vesta:ngDirective/>

    clientApp.bootstrap();
}