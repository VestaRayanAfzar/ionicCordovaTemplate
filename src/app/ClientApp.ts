import {IRootScopeService, IModule, IAngularEvent, IAngularBootstrapConfig, ILocationProvider} from 'angular';
import {IState, IStateService, IStateProvider, IUrlRouterProvider} from 'angular-ui-router';
import {IClientAppSetting} from './config/setting';
import {IRouteFunction} from './config/route';
import {AuthService} from './service/AuthService';
import {StorageService} from './service/StorageService';
import {NetworkService} from './service/NetworkService';
import {SplashService} from './service/SplashService';
import {NotificationService} from './service/NotificationService';
import {IUser} from './cmn/models/User';
import IonicConfigProvider = ionic.utility.IonicConfigProvider;
import IonicPlatformService = ionic.platform.IonicPlatformService;
import {BaseController} from "./modules/BaseController";
import {I18nService} from "./service/I18nService";
import {ILocale} from "./cmn/I18N";

export interface IExtRootScopeService extends IRootScopeService {
    bvm: BaseController;
    locale: ILocale;
    pageTitle: string;
}

interface IAppStatus {
    type: string;
    state: string;
    date: number;
}

export class ClientApp {
    private appStatusKey = 'appStatus';
    public module:IModule;

    constructor(private setting:IClientAppSetting, router:IRouteFunction) {
        if (cordova.plugins && cordova.plugins['Keyboard']) {
            cordova.plugins['Keyboard'].hideKeyboardAccessoryBar(true);
            cordova.plugins['Keyboard'].disableScroll(true);
        }
        var statusBar:StatusBar = window['StatusBar'];
        if (statusBar) {
            statusBar.styleDefault();
        }
        this.init(router);
    }

    private init(router:IRouteFunction) {
        this.module = angular.module(this.setting.name, ['ionic']);
        this.module.constant('Setting', this.setting);
        // CONFIG
        this.module.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', '$ionicConfigProvider',
            function ($stateProvider:IStateProvider, $locationProvider:ILocationProvider, $urlRouterProvider:IUrlRouterProvider, $ionicConfigProvider:IonicConfigProvider) {
                //$ionicConfigProvider.views.maxCache(0);// disabling ionic view cache
                //$ionicConfigProvider.views.forwardCache(false);
                $ionicConfigProvider.navBar.alignTitle('center');
                router($stateProvider, $locationProvider, $urlRouterProvider);
            }]);
        // RUN
        this.module.run(['$rootScope', 'authService', '$state', 'storageService', 'notificationService', 'networkService', 'splashService', 'i18nService',
            ($rootScope:IExtRootScopeService, authService:AuthService, $state:IStateService, storageService:StorageService,
             notificationService:NotificationService, networkService:NetworkService, splashService:SplashService, i18nService:I18nService)=> {
                $rootScope.locale = i18nService.get();
                $rootScope.pageTitle = 'Vesta Framework';
                this.aclCheck($rootScope, authService, $state);
                this.connectionWatcher(networkService);
                var state2go = this.appWatcher(storageService, $state);
                $state.go(state2go);
                setTimeout(splashService.hide.bind(splashService), 500);
            }])
    }

    private aclCheck($rootScope:IExtRootScopeService, authService:AuthService, $state:IStateService) {
        var userForbiddenStates = [];
        var guestForbiddenStates = [];
        $rootScope.$on('$stateChangeStart', (event:IAngularEvent, toState:IState)=> {
            if (authService.isLoggedIn()) {
                if (userForbiddenStates.indexOf(toState.name) >= 0) {
                    event.preventDefault();
                    //$state.go(guestForbiddenStates[0]);
                    return false;
                }
            } else {
                if (guestForbiddenStates.indexOf(toState.name) >= 0) {
                    event.preventDefault();
                    //$state.go(userForbiddenStates[0]);
                    return false;
                }
            }
        });
    }

    private appWatcher(storageService:StorageService, $state:IStateService) {
        var appStatus:IAppStatus = storageService.get<IAppStatus>(this.appStatusKey),
        // todo: state params
        // todo: you may change this to go the last state
            state2go = 'home';
        window.addEventListener('unload', ()=> {
            storageService.set<IAppStatus>(this.appStatusKey, {
                type: 'exit',
                date: Date.now(),
                state: $state.current.name
            });
        }, false);
        document.addEventListener('pause', ()=> {
            storageService.set<IAppStatus>(this.appStatusKey, {
                type: 'pause',
                date: Date.now(),
                state: $state.current.name
            });
        }, false);
        // todo: check if these events are registered twice in case of pause/resume
        document.addEventListener('resume', ()=> {
            // todo: change the state2go value
        }, false);
        return state2go;
    }

    private connectionWatcher(networkService:NetworkService) {
        changeStatus(networkService.isOnline());
        document.addEventListener('online', ()=> {
            changeStatus(true);
        }, false);
        document.addEventListener('offline', ()=> {
            changeStatus(false);
        }, false);
        function changeStatus(isOnline:boolean) {
            document.body.classList[isOnline ? 'remove' : 'add']('net-offline');
        }
    }

    public bootstrap() {
        var isProduction = this.setting.env == 'production';
        var bsConfig:IAngularBootstrapConfig = {
            strictDi: isProduction,
            debugInfoEnabled: isProduction
        };
        angular.bootstrap(document, [this.setting.name], bsConfig);
    }
}