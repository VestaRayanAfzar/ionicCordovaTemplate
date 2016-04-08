import {IScope, IDirective, IAugmentedJQuery, IAttributes, INgModelController} from 'angular';

export interface ICurrencyInputScope extends IScope {
}


export function currencyInput():IDirective {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            ngModel: '='
        },
        link: function (scope:ICurrencyInputScope, $element:IAugmentedJQuery, attrs:IAttributes, ngModel:INgModelController) {
            if (!ngModel) return;

            ngModel.$parsers.push(parse);
            ngModel.$formatters.push(format);
            ngModel.$render = function () {
                $element.val(format(ngModel.$modelValue));
            };

            var removeWatch = scope.$watch(()=>ngModel.$modelValue, ()=> ngModel.$render());
            scope.$on('$destroy', ()=>removeWatch());

            function format(number:number):string {
                return number ? number.toLocaleString() : '';
            }

            function parse(number:string):number {
                return Number(number.replace(/\D/g, ''));
            }
        }
    }
}
