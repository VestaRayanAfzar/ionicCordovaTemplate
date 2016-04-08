import {ILocationProvider} from 'angular';
import {IStateProvider} from 'angular-ui-router';
import {AuthService} from '../service/AuthService';
import {IUrlRouterProvider} from 'angular-ui-router';

export interface IRouteFunction {
    ($stateProvider:IStateProvider, $locationProvider:ILocationProvider, $urlRouterProvider:IUrlRouterProvider): void;
}

export function router($stateProvider:IStateProvider, $locationProvider:ILocationProvider, $urlRouterProvider:IUrlRouterProvider) {
    $locationProvider.html5Mode(false);
    $locationProvider.hashPrefix('!');
    $urlRouterProvider.otherwise('/');
    $stateProvider.state('home', {
        url: '/',
        views: {
            'master': {
                templateUrl: 'tpl/home.html',
                controller: 'homeController',
                controllerAs: 'vm'
            }
        }
    });
    ///<vesta:ngRouter/>
}


