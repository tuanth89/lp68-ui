(function () {
    'use strict';
    angular
        .module('ati.admin')
        .directive('eDatepicker', function () {
            return {
                restrict: "A",
                scope: {
                    inputValue: "=",
                    outputFormat: "@",
                    inputFormat: "@"
                },
                // transclude: true,
                link: function postLink(scope, element, $timeout, attrs, ctrl) {
                    if (!scope.inputFormat) scope.inputFormat = "yyyy-mm-dd";
                    if (!scope.outputFormat) scope.outputFormat = "dd/mm/yyyy";

                    let firstInit = true;
                    let filter = {};
                    let date = $(element).datepicker({
                        format: {
                            toDisplay: function (date, format, language) {
                                var d = new Date(date);
                                return moment(d).format(scope.outputFormat.toUpperCase());
                            },
                            toValue: function (date, format, language) {
                                var d = new Date(date);
                                return moment(d).format(scope.inputFormat.toUpperCase());
                            }
                        },
                        autoclose: true,
                        clearBtn: false,
                        todayHighlight: true,
                        orientation: "bottom",
                    }).on('changeDate', function (e) {
                        if (firstInit) {
                            firstInit = false;
                        } else {

                            let dateConvert = $(this).val();
                            if($(this).val()){
                                dateConvert = $(this).val().split("/")[2] +"/"+$(this).val().split("/")[1] +"/"+$(this).val().split("/")[0]; 
                            }else{
                               dateConvert = "";
                            }

                            if (e.date) {
                                scope.inputValue = moment(e.date).format(scope.inputFormat.toUpperCase());
                            } else {
                                scope.inputValue = undefined;
                            }

                            $(element).datepicker("hide");

                            setTimeout(function(){
                                scope.$apply();
                            },1);

                        }
                    }).on('clearDate', function (e) {
                      
                        // $(element).datepicker('setDate',null);
                    });
                    // $('.datepicker-days .clear').on('click',function(e){
                    //     //console.log(e);
                    //     $(element).datepicker('setDate',null);
                    // })
                    $(element).datepicker('setDate', new Date(scope.inputValue));

                    $(element).change(function (e) {
                        let val = $(this).val();
                        if (val == "") {
                            $(element).datepicker("clearDates");
                        }
                    });
                    // $(element).unbind("pase")
                    $(element).on('paste',function(e){
                        setTimeout(function(){
                            let val = $(e.currentTarget).val();
                            let validDate = moment(val, scope.outputFormat.toUpperCase()).isValid();
                            if (validDate) {
                                $(element).datepicker("setDate", moment(val, scope.outputFormat.toUpperCase())._d);
                                $(element).datepicker("hide");
                            } else {
                                toastr.error("Ngày không chính xác");
                                $(element).datepicker("clearDates");
                                $(element).val('');
                            }
                        })
                    })
                    $(element).unbind("keydown");
                    // $(element).blur(function(e){
                    //     //console.log($(element.val()));
                    //     // let val = $(this).val();
                    //     //     let validDate = moment(val, scope.outputFormat.toUpperCase()).isValid();
                    //     //     if (validDate) {
                    //     //         $(element).datepicker("setDate", moment(val, scope.outputFormat.toUpperCase())._d);
                    //     //         $(element).datepicker("hide");
                    //     //     } else {
                    //     //         $(element).datepicker("clearDates");
                    //     //     }
                    // });
                    // $(element).on('blur',function(){
                    //    setTimeout(function(){
                    //     let val = $(this).val();
                    //     //console.log(2)
                    //     if(val){
                    //         let validDate = moment(val, scope.outputFormat.toUpperCase()).isValid();
                    //         if (validDate) {
                    //             $(element).datepicker("setDate", moment(val, scope.outputFormat.toUpperCase())._d);
                    //             $(element).datepicker("hide");
                    //             scope.$apply();
                    //         } else {
                    //             $(element).datepicker("clearDates");
                    //             scope.$apply();
                    //         }

                    //     }
                    //    },200)
                       
                           
                        
                    // })
                    $(element).keydown(function (e) {
                        
                        if (e.keyCode == 13) {
                            let val = $(this).val();
                            var d = new Date
                            val = val.split('/')
                            if (val[1] == undefined) {
                                val[1] = d.getMonth() + 1
                            }
                            if (val[2] == undefined) {
                                val[2] = d.getFullYear()
                            }
                            val = val.join('/')
                            let validDate = moment(val, scope.outputFormat.toUpperCase()).isValid();
                            if (validDate) {
                                $(element).datepicker("setDate", moment(val, scope.outputFormat.toUpperCase())._d);
                                $(element).datepicker("hide");
                            } else {
                                toastr.error("Ngày không chính xác");
                                $(element).datepicker("clearDates");
                            }

                                $(element).blur();

                          
                        }
                        else{
                            // $timeout(()=>{
                                let currentValue = $(element).val()+ String.fromCharCode(e.keyCode);
                                let dateParams = currentValue.split('/');
                                if(dateParams.length==3){
                                    currentValue = dateParams[0].padStart(2,"0") +"/"+ dateParams[1].padStart(2,"0") +"/"+ dateParams[2];
                                    let validDate = moment(currentValue, scope.outputFormat.toUpperCase(),true).isValid();
                                    if (validDate) {
                                        e.preventDefault();
                                        $(element).datepicker("setDate", moment(currentValue, scope.outputFormat.toUpperCase())._d);
                                        $(element).datepicker("hide");
                                    }else{
                                        // $(element).datepicker("clearDates");
                                        // toastr.error("Ngày không chính xác");
                                    }
                                }
                            // },100)
                                
                        }
                    });

                    scope.$watch('inputValue',function(newVal,oldVal){
                        if(newVal){
                            if( newVal != oldVal){
                                let date = new Date(newVal);
                                $(element).datepicker("setDate", date);
                             }
                        }
                          
                      
                    
                    })
                },
                controller: function ($scope, ) {

                },
                // template: '<input name="" />'
            }
        });
})();