(function () {
    'use strict';
    angular
        .module('ati.admin')
        .directive('eSummernote', function () {

            return {
                restrict: "E",
                scope: {
                    ngModel: "=",
                    validateDirty:"="
                },
                // transclude: true,
                link: function postLink(scope, element, attrs, ctrl) {
                    var firstBind = true;
                    var summernote = $(element).summernote({
                        height: 200,
                        tooltip: false
                    }).on('summernote.change', function (we, contents, $editable) {
                        
                    }).on('summernote.focus', function (we, contents, $editable) {
                        scope.validateDirty = true;
                    }).on('summernote.blur', function (we, contents, $editable) {
                        // scope.validateDirty = true;
                        scope.ngModel = element.summernote('code');
                        scope.$apply();
                    });

                    scope.$watch('ngModel', function (newVal, oldVal) {
                        if (firstBind && scope.ngModel) {
                            element.summernote('code', scope.ngModel);
                            firstBind = false;
                        }
                    })
                    $(element).summernote('code', scope.ngModel);

                },
                controller: function ($scope, ) {

                },
            }
        });
})();