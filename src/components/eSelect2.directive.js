(function () {
    'use strict';
    angular
        .module('ati.admin')
        .directive('eSelect2', function () {
            return {
                restrict: "E",
                scope: {
                    search: '@',
                    width: '@',
                    placeholder: '@',
                    clear: '@',
                    getData: '&',
                    selectall: '@',
                    ngModel: '=?',
                    multiple: '@',
                    select: '&',
                    unselect: '&',
                    old_values: '=',
                    key: '@',
                    templateSelection: '=',
                    allowNull: '@'
                },
                template: `<select style="width:{{width}}" class="form-control"><option></option></select>`,
                link: function(scope, element, attrs, ctrl) {
                    let option = {
                        theme: "bootstrap4",
                        placeholder: scope.placeholder,
                        multiple: scope.multiple,
                        escapeMarkup: function (markup) { return markup; },
                        // templateResult: function (data) {
                        //     if (data.loading){
                        //         return data.text;
                        //     }
                        //     var markup = "";
                        //     // if(data.children){
                        //     //     markup = "<div class='select2-treeview'><div class='select2-treeview-triangle select2-treeview-down'></div><span>" + data.text + "</span></div>";
                        //     // }else{
                        //     //     markup = "<div class='select2-treeview-item'><span><img style='height: 15px;width: 18px; margin-right: 5px;' class='img-flag'/>" + data.text + "</span></div>";
                        //     // }

                        //     let displayText = data.text;
                        //     if(data.level==2) displayText = "---" + displayText;

                        //     markup = "<div class='select2-treeview-item'>" + displayText + "</div>";
                        //     return markup;
                        // },
                        templateSelection: function (data) {
                            return data.text;
                        },
                      
                        // queryComplete: function(select2, term){
                        //     //Register the parent element click event
                        //     select2.$results.children().click(function(){
                        //         //Triangle Transform position
                        //         var triangle = $(this).find(".select2-treeview-triangle");
                        //         if(triangle.hasClass("select2-treeview-down")){
                        //             triangle.removeClass("select2-treeview-down").addClass("select2-treeview-right");
                        //         }else{
                        //             triangle.removeClass("select2-treeview-right").addClass("select2-treeview-down");
                        //         }
                                
                        //         //Toggle child elements are hidden or displayed
                        //         $(this).children("ul").toggle();
                
                        //     }).click();//收缩所有分组 Shrink all groups
                
                        //     var highlighted = select2.$results.find('.select2-results__option--highlighted');
                        //     //Expand the grouping of the selected columns
                        //     highlighted.parent().show();
                
                        //     //Toggle the triangles of the selected section
                        //     var triangle = highlighted.parent().parent().find(".select2-treeview-triangle");
                        //     triangle.removeClass("select2-treeview-right").addClass("select2-treeview-down");
                
                        //     //The scroll bar position
                        //     // 35 = $(".select2-search--dropdown").outerHeight()
                        //     // 29 = (".select2-results__option--highlighted").outerHeight()
                        //     select2.$results.scrollTop(highlighted[0].offsetTop - 35 - 29);
                        // }
                    }

                    scope.getData().then(function (data) {
                        option.data = data;

                        $(element).find("select").select2(option)
                        .on('change', function (data) {
                              scope.ngModel = $(element).find("select").val();
                          });
                    });
                },
                controller: function ($scope) {

                },
            }
        });
})();