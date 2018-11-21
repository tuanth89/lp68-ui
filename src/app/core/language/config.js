(function () {
    'use strict';

    angular.module('ati.core.language')
        .config(configTranslate)
        .constant('LANG_KEY', 'langKey');

    function configTranslate($translateProvider, LANG_KEY, LOCALE_EN, LOCALE_VI) {
        $translateProvider
            .translations('en', LOCALE_EN)
            .translations('vi', LOCALE_VI);

        window.localStorage[LANG_KEY] = window.localStorage[LANG_KEY] || 'vi';
        $translateProvider
            .preferredLanguage(window.localStorage[LANG_KEY])
            .useSanitizeValueStrategy('escaped');
    }
})();