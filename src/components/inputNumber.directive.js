(function () {
    'use strict';
    angular.module('ati.admin').directive("blurCurrency", function ($filter, $timeout) {
        return {
            scope: {
                ngModel: "=",
            },
            controller: function(){

            },
            link: function (scope, el, attrs, ngModelCtrl) {
                // //console.log(ngModelCtrl,"ngModelCtrl");
                function formatter(value) {
                    value = value ? parseFloat(value.toString().replace(/[^0-9._-]/g, '')) || 0 : 0;
                    //console.log(scope.controller);
                    var formattedValue = $filter('currency')(value,"",0);

                    el.val(formattedValue);
                    
                    // ngModelCtrl.$setViewValue(value);
                    scope.ngModel = value;
                    scope.$apply();
    
                    return formattedValue;
                }
                
                // ngModelCtrl.$formatters.push(formatter);
                el.bind('focus', function () {

                });
    
                el.bind('blur', function () {
                    formatter(el.val());
                });
                scope.$watch('ngModel',function(newVal,oldVal){
                    if(newVal){
                        //console.log(1);
                        formatter(el.val());
                    }

                })
            }
        };
    });
})();
