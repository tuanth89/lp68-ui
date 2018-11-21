(function () {
    'use strict';

    angular.module('ati.core.widgets')
        .directive('toggleOffCanvas', toggleOffCanvas)
    ;

    function toggleOffCanvas() {
        'use strict';

        return {
            restrict: 'A',
            link: function (scope, ele) {
                return ele.on('click', function () {
                    return $('#app').toggleClass('on-canvas');
                });
            }
        };
    }
})();