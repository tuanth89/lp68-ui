(function () {
    'use strict';

    angular.module('ati.core.widgets')
        .directive('slimScroll', slimScroll)
    ;

    function slimScroll() {
        return {
            restrict: 'A',
            link: function(scope, ele, attrs) {
                ele.slimScroll({
                    height: attrs.scrollHeight || '100%'
                })
            }
        }
    }
})();