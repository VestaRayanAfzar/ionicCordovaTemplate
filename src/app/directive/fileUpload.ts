import {IDirective, IScope, IAugmentedJQuery, IAttributes} from 'angular';

interface IFileUploadScope extends IScope {
    ngModel: any
}

export function fileUpload(): IDirective {
    return {
        restrict: 'A',
        scope: {
            ngModel: '='
        },
        link(scope: IFileUploadScope, element: IAugmentedJQuery, attrs: IAttributes) {
            element[0].onchange = function (event) {
                var files = this.files;
                scope.$apply(function () {
                    scope.ngModel = attrs['multiple'] ? files : files[0];
                });
            };
            element[0].style.display = 'none';
            var fileChooser = document.createElement('a');
            fileChooser.setAttribute('type', 'button');
            fileChooser.setAttribute('href', '#');
            fileChooser.classList.add('file-upload');
            var label: HTMLElement,
                labels = element[0].parentElement.getElementsByTagName('label');
            if (labels && labels.length) {
                label = <HTMLElement>labels[0];
                label.style.display = 'none';
            }
            fileChooser.textContent = attrs['label'] || (label ? label.textContent : 'انتخاب تصویر');
            element[0].parentNode.insertBefore(fileChooser, element[0]);
            fileChooser.addEventListener('click', function (e) {
                e.preventDefault();
                element[0].click();
            });
        }
    };
}
