import {IScope} from 'angular';
import {NotificationService} from "../service/NotificationService";
import IonicPlatformService = ionic.platform.IonicPlatformService;
import IStateService = ng.ui.IStateService;

export class HomeController {
    public date:number;
    private isAlreadyPressed:boolean = false;
    private exitTimer:number;
    private timeout:number = 5000;
    public static $inject = ['$scope', 'notificationService', '$ionicPlatform'];

    constructor(private $scope:IScope, private notificationService:NotificationService, private $ionicPlatform:IonicPlatformService) {
        this.handleBackButton();
        this.date = Date.now();
    }

    private handleBackButton() {
        var remover = this.$ionicPlatform.registerBackButtonAction((event)=> {
            if (this.isAlreadyPressed) {
                clearTimeout(this.exitTimer);
                navigator['app'].exitApp();
            } else {
                this.isAlreadyPressed = true;
                this.notificationService.toast('press back button again to exit');
                this.exitTimer = setTimeout(()=> {
                    this.isAlreadyPressed = false;
                }, this.timeout);
                event.preventDefault();
                event.stopPropagation();
                return false;
            }
        }, 105);
        this.$scope.$on('$destroy', ()=>remover());
    }
}
