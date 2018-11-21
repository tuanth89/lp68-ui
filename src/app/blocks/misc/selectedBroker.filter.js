(function () {
    'use strict';

    angular.module('ati.blocks.misc')
        .filter('selectedDoctor', selectedDoctor)
    ;

    function selectedDoctor() {
        return function (items, doctorId) {
            if (angular.isObject(doctorId) && doctorId.id) {
                // allow user to pass in a doctor object
                doctorId = doctorId.id;
            }

            doctorId = parseInt(doctorId, 10);

            if (!doctorId) {
                return items;
            }

            var filtered = [];

            angular.forEach(items, function(item) {
                if (!angular.isObject(item)) {
                    return;
                }

                try {
                    // we use item.id == null for the option to indicate 'All" at the moment
                    if (item.id == null || doctorId === item.client.id) {
                        filtered.push(item);
                    }
                } catch (e) {}
            });

            return filtered;
        }
    }
})();