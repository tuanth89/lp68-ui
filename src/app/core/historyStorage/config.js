(function () {
    'use strict';

    angular.module('ati.core.historyStorage')
        .constant('HISTORY', 'dtagHistory')
        .constant('HISTORY_TYPE_PATH', {doctor: "doctor", assistant: 'assistant', clinic: "clinic"})
    ;
})();