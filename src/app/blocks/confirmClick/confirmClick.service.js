(function () {
    'use strict';

    angular.module('ati.blocks.confirmClick')
        .service('dialogModal', ['$modal', '$translate', function($modal, $translate) {
            return function (message, title, okButton, cancelButton) {
                // setup default values for buttons
                // if a button value is set to false, then that button won't be included
                okButton = okButton===false ? false : (okButton || $translate.instant('YES_DELETE'));
                cancelButton = cancelButton===false ? false : (cancelButton || $translate.instant('NO_CANCEL'));

                // setup the Controller to watch the click
                var ModalInstanceCtrl = function ($scope, $modalInstance, settings) {
                    // add settings to scope
                    angular.extend($scope, settings);
                    // ok button clicked
                    $scope.ok = function () {
                        $modalInstance.close(true);
                    };
                    // cancel button clicked
                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                };
                ModalInstanceCtrl.$inject = ["$scope", "$modalInstance", "settings"];

                // open modal and return the instance (which will resolve the promise on ok/cancel clicks)
                var modalInstance = $modal.open({
                    template: '<div class="dialog-modal"> \
                                <div class="modal-header" ng-show="modalTitle"> \
                                <h3 class="modal-title">{{modalTitle}}</h3> \
                                </div> \
                                    <div class="modal-body">{{modalBody}}</div> \
                                    <div class="modal-footer"> \
                                    <button class="btn btn-primary" ng-click="cancel()" ng-show="cancelButton">{{cancelButton}}</button> \
                                     <button class="btn btn-danger" ng-click="ok()" ng-show="okButton">{{okButton}}</button> \
                                </div> \
                                </div>',
                    controller: ModalInstanceCtrl,
                    resolve: {
                        settings: function() {
                            return {
                                modalTitle: title,
                                modalBody: message,
                                okButton: okButton,
                                cancelButton: cancelButton
                            };
                        }
                    }
                });
                // return the modal instance
                return modalInstance;
            }
        }])
})();