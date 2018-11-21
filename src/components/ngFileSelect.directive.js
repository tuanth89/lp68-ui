(function () {
    'use strict';
    angular.module('ati.admin').directive("ngFileSelect", function (fileReader, $timeout) {
        return {
            scope: {
                ngModel: "=",
                cropper: '=',
                aspectRatio: '@',
                uploadedImage: "=",
                invalidExtension: "=",
                nameOfImageFile: "=",
                imageWidth: "=",
                imageHeight: "=",
                accept:"@"
            },
            link: function ($scope, el) {
                let allowTypes  = ".jpg,.png,.jpeg";

                if($scope.accept){
                    allowTypes = $scope.accept;
                }
                allowTypes = allowTypes.replace("ico","x-icon");
                allowTypes = allowTypes.split(",");

                function getFile(file) {
                    if (allowTypes.indexOf(file.type.replace("image/","."))>=0) {
                        $scope.nameOfImageFile = file.name;

                        fileReader.readAsDataUrl(file, $scope)
                            .then(function (result) {
                                var img = new Image();
                                img.onload = function (event) {
                                    $scope.imageWidth = img.width;
                                    $scope.imageHeight = img.height;
                                    $scope.$apply();
                                };

                                img.src = result;

                                $scope.uploadedImage = true;
                                $scope.invalidExtension = false;
                                $timeout(function () {
                                    $scope.ngModel = result;
                                    var aspectRatio = NaN;
                                    if ($scope.aspectRatio) {
                                        aspectRatio = $scope.aspectRatio;
                                    }
                                });
                            });
                    } else {
                        $scope.nameOfImageFile = null;
                        $scope.ngModel = null;
                    }
                }

                el.bind("change", function (e) {
                    var file = (e.srcElement || e.target).files[0];
                    if (file) {
                        if (allowTypes.indexOf(file.type.replace("image/",".")) >=0 ) {
                            getFile(file);
                        } else {
                            $timeout(function () {
                                $scope.nameOfImageFile = null;
                                $scope.ngModel = null;
                                $scope.invalidExtension = true;
                            }, 250);
                            return false;
                        }
                    }
                });
            }
        };
    });
})();