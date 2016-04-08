import {IScope, IDirective, IAugmentedJQuery, IAttributes, INgModelController} from 'angular';
import {DateTime} from "../cmn/date/DateTime";
import {DateTimeFactory} from "../cmn/date/DateTimeFactory";
import {IClientAppSetting} from "../config/setting";
import {DatePickerService} from "../service/DatePickerService";

export class DateInputController {
    static $inject = ['Setting', 'datePickerService'];

    constructor(private Setting:IClientAppSetting, private datePickerService:DatePickerService) {
    }

    public getLocaleString():string {
        return this.Setting.locale;
    }

    public show(timestamp:number) {
        return this.datePickerService.show({timestamp: timestamp, clickToSelect: true});
    }
}

export interface IDateInputScope extends IScope {
    ngModel: any;
    vm: DateInputController;
    showPicker: string;
}

export function dateInput():IDirective {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            ngModel: '=',
            showPicker: '@'
        },
        controller: DateInputController,
        controllerAs: 'vm',
        bindToController: false,
        link: function (scope:IDateInputScope, $element:IAugmentedJQuery, attrs:IAttributes, ngModel:INgModelController) {
            var inputDate:DateTime = DateTimeFactory.create(scope.vm.getLocaleString());
            ngModel.$parsers.push(value=> {
                var time = inputDate.validate(value);
                if (time) {
                    ngModel.$setValidity('date', true);
                    return time;
                }
                ngModel.$setValidity('date', false);
                ngModel.$setDirty();
                return 0;
            });
            ngModel.$formatters.push(value=> {
                if (value > 0) {
                    inputDate.setTime(scope.ngModel);
                    return inputDate.format('Y/m/d');
                }
                return '';
            });

            if (scope.showPicker == "true") {
                $element[0].addEventListener('click', dpHandler, false);
                scope.$on('$destroy', function () {
                    $element[0].removeEventListener('click', dpHandler);
                });
            }
            function dpHandler() {
                scope.vm.show(Number(scope.ngModel))
                    .then(timestamp=> {
                        scope.ngModel = timestamp;
                    })
            }
        }
    };
}
