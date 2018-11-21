(function () {
    'use strict';
    angular
        .module('ati.admin')
        .directive('eTable', function ($state, $location) {
            return {
                restrict: "A",
                transclude: true,
                scope: {
                    datatableConfig: '=',
                    filter: '=',
                    table: '=',
                    // getDataSource: '&'
                    // dataSource: '&'
                },
                link: function postLink(scope, element, attrs, ctrl) {
                    let defaultConfig = {
                        pageLength: 10,
                        serverSide: true,
                        scrollX: true,
                        dom: "<<tr>>" + "<'footer-info'ip>",
                        responsive: true,
                        language: {
                            "emptyTable": "Không tìm thấy bản ghi nào",
                            "infoEmpty": "",
                            "info": "Hiển thị _START_ đến _END_ trong tổng số _TOTAL_ bản ghi",
                            paginate: {
                                next: ">",
                                previous: "<",
                                first: "<<",
                                last: ">>"
                            }
                        },
                        pagingType: "full_numbers",
                        fnDrawCallback: function (data) {
                            var recordNumber = this.fnSettings().fnRecordsTotal();
                            if (jQuery('table td').hasClass('dataTables_empty') || recordNumber <= 10) {
                                setTimeout(function(){
                                    jQuery('div.dataTables_paginate.paging_full_numbers').hide();
                                },0)
                              
                            } else {
                                jQuery('div.dataTables_paginate.paging_full_numbers').show();
                            }
                        }

                    };

                    let config = Object.assign({}, defaultConfig, scope.datatableConfig);

                    if (scope.filter.per_page) {
                        config.pageLength = Number(scope.filter.per_page);
                    } else {
                        scope.filter.per_page = config.pageLength;
                    }
                    if (scope.filter.page) {
                        config.displayStart = config.pageLength * (parseInt(scope.filter.page) - 1);
                    }
                    $.fn.dataTableExt.oPagination.numbers_length = 5;

                    if (typeof (scope.dataSource) == 'function') {
                        
                        scope.dataSource().then(data => {

                            config.data = data;
                            initDatatable();
                        });
                    } else {
                        initDatatable();
                    }

                    function initDatatable() {
                        let table = $(element).find("table").DataTable(config);
                        if (scope.table) {
                            scope.table = table;
                        }

                        table.on('page', function (e, settings) {
                            scope.filter.page = (settings._iDisplayStart / settings._iDisplayLength) + 1;
                            if (scope.filter.page < 1) scope.filter.page = 1;
                        });

                        table.on('length', function (e, settings) {
                            scope.filter.per_page = settings._iDisplayLength;
                        });

                        table.on('order.dt', function (e, settings) {
                            var order = table.order()[0];
                            scope.filter.sortBy = settings.aoColumns[order[0]].sName;
                            scope.filter.sortType = order[1];
                        });

                        // $(element).find('.filter-region input').change(function (e) {
                        //     var input = $(this);
                        //     scope.filter[input.attr('name')] = input.val();
                        // });

                        // $(element).find('.filter-region select').change(function (e) {
                        //     loadData();
                        // });

                        $(element).find('.filter-region input[name="search"]').keypress(function (e) {
                            if (e.keyCode == 13) {
                                scope.filter.page = 1;
                                table.page(0);
                                loadData();
                            }
                        });

                        $(element).find('.filter-region .input-group-addon').click(function (e) {
                            scope.filter.page = 1;
                            table.page(0);
                            loadData();
                        });

                        scope.$watch("filter", function (newVal, oldVal) {
                            // loadData();

                            oldVal.page = newVal.page;
                            oldVal.per_page = newVal.per_page;
                            oldVal.search = newVal.search;

                            if (JSON.stringify(oldVal) != JSON.stringify(newVal)) {
                                loadData();
                            }
                        }, true);
                        var loadData = function () {
                            table.ajax.reload();
                        }
                        table.on("draw", function (e, settings) {
                            updateUrl();
                        });
                    }

                    function updateUrl() {
                        let newFilter = {
                            ...scope.filter
                        };
                        // $location.search(newFilter)

                        $state.go($state.current.name, newFilter, {
                            notify: false,
                            reload: false,
                            location: 'replace',
                        });
                    }
                },
                controller: function ($scope, ) {

                },
                template: '<ng-transclude></ng-transclude>'
            }
        });
})();