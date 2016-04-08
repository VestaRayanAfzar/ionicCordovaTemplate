import {IScope, IDirective, IAugmentedJQuery} from 'angular';

export interface IRoundImageScope extends IScope {
    src:string;
    initiative:string;
    cache:boolean;
}
/**
 * @ngdoc directive
 * @name roundImage
 * @restrict E
 *
 * @param {string} src The source of image to be displayed
 * @param {string=} initiative If image failes to load, displays the initials
 * @param {boolean=} cache cache image by base64 -> local storage
 *
 */
export function roundImage():IDirective {
    return {
        restrict: 'E',
        replace: true,
        template: '<div class="round-image"><img ng-src="{{src}}"/></div>',
        scope: {
            src: '=',
            initiative: '@',
            cache: '@'
        },
        link: function ($scope:IRoundImageScope, $element:IAugmentedJQuery) {
            var wrapper = $element[0],
                image:HTMLImageElement = <HTMLImageElement>$element[0].querySelector('img');
            if (image.complete) {
                onAfterLoad(wrapper, image);
            } else if ($scope.src) {
                image.addEventListener('load', () => {
                    onAfterLoad(wrapper, image);
                });
                image.addEventListener('error', (event)=> {
                    onAfterLoad(wrapper, image, event);
                })
            } else {
                onAfterLoad(wrapper, image, <ErrorEvent>{});
            }

            function getAbbr(name:string) {
                var abbr = '';
                var parts = name.split(/\s/);
                for (var i = 0, il = parts.length; i < il; ++i) {
                    abbr += parts[i] ? parts[i][0] : '';
                }
                return abbr.toUpperCase();
            }

            function onAfterLoad(wrapper, image, error?:ErrorEvent) {
                if (error) {
                    if ($scope.initiative) {
                        var abbr = getAbbr($scope.initiative);
                        var el = document.createElement('div');
                        el.textContent = abbr;
                        el.classList.add('name-abbr');
                        var fontSize = Math.floor(wrapper.clientWidth / 2),
                            padding = Math.floor(wrapper.clientWidth / 5);
                        $element.html('').append(el);
                        el.setAttribute('style', `width:${wrapper.clientWidth}px;height:${wrapper.clientWidth}px;padding:${padding}px;font-size:${fontSize}px;box-shadow:inset 2px 2px ${fontSize}px 10px gray;`);
                    }
                } else {
                    var height = Math.ceil(image.clientHeight * (wrapper.clientWidth / image.clientWidth));
                    image.setAttribute('style', `width:${wrapper.clientWidth}px;height:${height}px;`);
                    //if ($scope.cache) {
                    //
                    //}
                }
                wrapper.setAttribute('style', `display:flex;width:${wrapper.clientWidth}px;height:${wrapper.clientWidth}px;`);
            }
        }
    }
}
