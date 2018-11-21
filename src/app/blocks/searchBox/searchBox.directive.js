(function () {
    'use strict';

    angular.module('ati.blocks.searchBox')
        .directive('searchBox', searchBox)
    ;

    function searchBox() {
        'use strict';

        return {
            restrict: 'AE',
            templateUrl: 'blocks/searchBox/searchBox.tpl.html',
            scope: {
                sbList: '=sbList',
                searchFields: '=searchFields',
                placeHolder: '=placeHolder'
            },
            controller: 'SearchBox'
        };
    }
})();