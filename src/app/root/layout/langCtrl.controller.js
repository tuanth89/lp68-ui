(function () {
    'use strict';

    angular.module('ati.root.layout')
        .controller('LangCtrl', LangCtrl);

    function LangCtrl($scope, $state, $translate, LANG_KEY) {
        $scope.lang = window.localStorage[LANG_KEY];

        $scope.getFlag = getFlag;
        $scope.setLang = setLang;

        $scope.stateName = $state.current.name;



        function getFlag() {
            return 'flag-icon-' + $scope.lang;
        }

        function setLang(lang) {
            $scope.lang = lang;
            $translate.use(lang);
            window.localStorage[LANG_KEY] = lang;

            $state.current.reloadOnSearch = true;
            $state.reload()
        }
    }
})();