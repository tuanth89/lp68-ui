(function () {
    'use strict';

    angular.module('ati.core.widgets')
        .directive('selectOnClick', selectOnClick)
    ;

    function selectOnClick() {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.on('click', function () {
                    this.select();
                });
            }
        };
    }
})();