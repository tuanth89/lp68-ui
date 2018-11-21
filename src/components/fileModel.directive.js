(function () {
    'use strict';
    angular.module('ati.admin').directive("fileModel", function ($parse) {
        return {
            restrict:'A',
            link: function ($scope, element,attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;
                  
                element.bind('change', function(){
                    $scope.uploadFile(element[0].files[0]);ß
                });
            },
            controller: function(adminRestangular, $scope,Auth,Restangular){
                $scope.uploadFile = function(file){
                    let user = Auth.getSession();

                    var fd = new FormData();
                    fd.append('file', file);
                    
                   
                    adminRestangular.all("uploadFiles")
                        .withHttpConfig({
                            transformRequest: angular.identity
                        })
                        .post(fd, {
                          
                        }, {
                            'Content-Type': undefined
                        }).then(function (resp) {
                            $scope.$apply(function(){
                                modelSetter($scope, resp[0].link);
                            });
                        })
                }

            }
        };
    });
})();