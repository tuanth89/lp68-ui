(function() {
    'use strict';

    angular.module('ati.core.historyStorage')
        .factory('historyStorage', historyStorage)
    ;

    function historyStorage($window, $stateParams, $location, $state, HISTORY_TYPE_PATH, HISTORY) {
        var api = {
            getLocationPath: getLocationPath,
            setParamsHistoryCurrent: setParamsHistoryCurrent,

            getHistoryParams: getHistoryParams
        };

        $window.localStorage[HISTORY] = $window.localStorage[HISTORY] || '{}';

        return api;

        function getLocationPath(type, state) {
            $window.localStorage[HISTORY] = $window.localStorage[HISTORY] || '{}';
            if(!!HISTORY_TYPE_PATH[type]) {
                return $state.go(state, getHistoryParams(type));
            }

            // //console.log('not support type ' + type);
        }

        function setParamsHistoryCurrent(type) {
            $window.localStorage[HISTORY] = $window.localStorage[HISTORY] || '{}';
            var stateParam = _getStateParams();

            if(!!HISTORY_TYPE_PATH[type]) {
                return _setParamsHistoryCurrent(stateParam, type);
            }

            // //console.log('not support type ' + type);
        }

        function _setParamsHistoryCurrent(stateParam, key) {
            var tcHistory = angular.fromJson($window.localStorage[HISTORY]);
            tcHistory[key] = stateParam;
            $window.localStorage[HISTORY] = angular.toJson(tcHistory);
        }

        function _getStateParams() {
            var params = angular.copy($stateParams);
            var search = $location.search();

            angular.forEach(search, function(value, key) {
                params[key] = value;
            });

            return params;
        }

        function getHistoryParams(historyParams) {
            if(!$window.localStorage[HISTORY]) {
                return null;
            }

            var params = angular.fromJson($window.localStorage[HISTORY])[historyParams];

            //if(!!params) {
            //    params.uniqueRequestCacheBuster = Math.random();
            //}
            //if(!params) {
            //    params = {
            //        uniqueRequestCacheBuster: Math.random()
            //    }
            //}

            return params;
        }
    }
})();