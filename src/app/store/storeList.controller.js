(function () {
    'use strict';

    angular.module('ati.store')
        .controller('StoreListController', StoreListController);

    function StoreListController($scope, $stateParams, $compile, Restangular, StoreManager) {
        $scope.filter = angular.copy($stateParams);

        $scope.getData = function (filter) {
            // $scope.keyword = $scope.filter.search;
            return StoreManager
                .one()
                .customGET("", $scope.filter)
                .then(function (resp) {
                    let r = resp.plain();
                    if (r.pages < r.page) {
                        $scope.filter.page = r.pages;
                        return $scope.getData($scope.filter);
                    } else {
                        $scope.total = r.total;
                        return {
                            data: r.docs,
                            recordsTotal: r.total,
                            recordsFiltered: r.total
                        };
                    }

                });
        };

        $scope.tableConfig = {
            ajax: function (data, callback, settings) {
                $scope.getData().then((resp) => {
                    if ($scope.filter.page) {
                        settings._iDisplayStart = (parseInt($scope.filter.page) - 1) * parseInt($scope.filter.per_page);
                    }
                    callback(resp);
                });
            },
            ordering: false,
            columns: [{
                title: "STT",
                width: 50,
                className: "text-center",
                data: null,
                render: function (data, e, full, meta) {
                    if (meta.settings._iDisplayStart == NaN) {
                        meta.settings._iDisplayStart = 0;
                    }
                    return meta.settings._iDisplayStart + meta.row + 1;
                }
            },
                {
                    title: "Mã cửa hàng",
                    data: "storeId",
                    width: 200,
                    render: function (data, e, full, meta) {
                        return data;
                    }
                },
                {
                    title: "Tên cửa hàng",
                    orderable: false,
                    data: "name",
                    render: function (data, e, full, meta) {
                        return `<a ui-sref="^.edit({id:'${full._id}'})">${data}</a>`;
                    },
                    fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                        $compile(nTd)($scope);
                    }
                },
                {
                    title: "Trạng thái",
                    orderable: false,
                    data: "isActive",
                    width: 100,
                    className: "text-center",
                    render: function (data, e, full, meta) {
                        switch (data) {
                            case 'DEACTIVATED':
                                return `<span class='badge badge-dark'>Chưa dùng</span>`;
                            case 'ACTIVE':
                                return `<span class='badge badge-success'>Đã dùng</span>`;
                        }
                        return data ? `<span class='badge badge-success'>Hoạt động</span>` : `<span class='badge badge-danger'>Ngừng hoạt động</span>`;
                    }
                },
                {
                    title: "Thao tác",
                    orderable: false,
                    width: 100,
                    className: "text-center",
                    data: '_id',
                    render: function (data, e, full, meta) {
                        return `<button class="btn btn-sm btn-primary" type="button" ui-sref="^.detail({ id:'${data}'})">Xem</button>`;
                    },
                    fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                        $compile(nTd)($scope);
                    }

                },
            ],
            // order: [1, 'asc']
        }

    }
})();