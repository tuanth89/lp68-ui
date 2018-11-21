window.deferredBootstrapper.bootstrap({
    element: document,
    module: 'ati',
    injectorModules: ['ati.core.bootstrap', 'ati.core.auth'],
    moduleResolves: [{
        module: 'ati.core.bootstrap',
        resolve: {
            EXISTING_SESSION: ['Auth', function (Auth) {
                return Auth.check().catch(function () {
                    return false;
                }).finally(function () {
                    // //console.log('auth resolved');
                });
            }]
        }
    }]
});