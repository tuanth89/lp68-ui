(function () {
    'use strict';

    angular.module('ati.blocks.event')
        .directive('fileModel', fileModel)
    ;

    function fileModel() {
        return {
            restrict: 'A',
            link: function($parse, scope, element, attrs) {
                if(!attrs) {
                    return
                }

                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function(){
                    scope.$apply(function(){
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }
})();