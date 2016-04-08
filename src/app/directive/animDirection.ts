import {IAttributes, IScope, IDirective, IAugmentedJQuery} from 'angular';

export function animDirection():IDirective {
    return {
        restrict: 'A',
        scope: false,
        link: ($scope:IScope, $element:IAugmentedJQuery, attrs:IAttributes)=> {
            var parent = $element[0].parentElement;
            if (attrs['animDirection'] == 'forward') {
                parent.classList.remove('backward');
                parent.classList.add('forward');
            } else {
                parent.classList.remove('forward');
                parent.classList.add('backward');
            }
        }
    }
}
