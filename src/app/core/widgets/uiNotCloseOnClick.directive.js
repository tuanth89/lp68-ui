(function () {
    'use strict';

    angular.module('ati.core.widgets')
        .directive('uiNotCloseOnClick', uiNotCloseOnClick)
    ;

    function uiNotCloseOnClick() {
        return {
            restrict: 'A',
            compile: function (ele) {
                return ele.on('click', function (event) {
                    return event.stopPropagation();
                });
            }
        };
    }
})();