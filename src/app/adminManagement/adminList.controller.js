(function () {
    'use strict';

    angular.module('ati.adminManagement')
        .controller('AdminList', AdminList)
    ;

    function AdminList($scope, $compile, $state, $stateParams, $translate, AlertService, AdminManager, AdminService) {
        $scope.confirmDelete = "Bạn có chắc chắn muốn xóa tài khoản này?";
        $scope.filter = angular.copy($stateParams);
        $scope.tableData = [];
        $scope.total = 0;

        $scope.$on('$viewContentLoaded', function (event, data) {
            $scope.getData();
        });

        $scope.toggleStatus = function (user) {
            let newStatus = !user.enabled;

            AdminManager.one(user._id).customPUT({'enabled': newStatus})
                .then(function () {
                    user.enabled = newStatus;
                    AlertService.replaceAlerts({
                        type: 'success',
                        message: newStatus ? "Tài khoản đã được kích hoạt"
                            : "Tài khoản đã ngừng kích hoạt"
                    });
                })
                .catch(function () {
                    AlertService.replaceAlerts({
                        type: 'error',
                        message: ""
                    });
                });
        };

        $scope.delAccount = function (userId) {
            swal({
                title: 'Bạn có chắc chắn muốn xóa tài khoản này ?',
                text: "",
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Có',
                cancelButtonText: 'Không',
            }).then((result) => {
                if (result.value) {
                    AdminManager.one(userId).remove()
                        .then(function () {
                            AlertService.addFlash({
                                type: 'success',
                                message: "Xóa tài khoản thành công"
                            });
                        })
                        .then(function () {
                            $state.reload();
                        })
                        .catch(function () {
                            AlertService.replaceAlerts({
                                type: 'error',
                                message: "Có lỗi xảy ra"
                            });
                        });
                }
            });
        };

        $scope.table = {};

        $scope.keyword = $stateParams.search;

        $scope.filterSearch = function (e) {
            if (e.keyCode === 13) {
                $scope.keyword = $scope.filter.search;
                $scope.getData();
            }
        };

        // getData
        $scope.getData = function () {
            $scope.keyword = $scope.filter.search;

            return AdminManager
                .one("listAdmin")
                .customGET("", $scope.filter)
                .then(function (resp) {
                        // let data = resp.plain();
                        // $scope.tableData = data.docs;
                        // $scope.total = data.total;

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
                    },
                    function (err) {
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
                    title: "Họ và tên",
                    data: "fullName",
                    width: 200,
                    render: function (data, e, full, meta) {

                        return `<a ui-sref="^.edit({id:'${full._id}'})">${data}</a>`;
                    },
                    fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                        $compile(nTd)($scope);
                    }
                },
                {
                    title: "Email",
                    orderable: false,
                    data: "email",
                    render: function (data, e, full, meta) {
                        return data;
                    }
                },
                {
                    title: "Số điện thoại",
                    orderable: false,
                    data: "phone",
                    render: function (data, e, full, meta) {
                        return data;
                    }
                },
                {
                    title: "Trạng thái",
                    orderable: false,
                    data: "enabled",
                    width: 100,
                    className: "text-center",
                    render: function (data, e, full, meta) {
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
                        let dom = "";
                        let editItem = "";
                        let removeItem = "";

                        if (AdminService.hasRouteNames(['admin.update']))
                            editItem = `<a class="dropdown-item" e-route-name="admin.update" ui-sref="^.edit({id:'${full._id}'})">Sửa</a>`;
                        if (AdminService.hasRouteNames(['admin.remove']))
                            removeItem = `<a class="dropdown-item" e-route-name="admin.remove" ng-click="delAccount('${full._id}')">Xoá</a>`;

                        if (!editItem && !removeItem) {
                            dom =
                                `<div table-action-menu class="btn-group">
                                <button type="button" dropdown class="btn btn-default fa fa-ellipsis-v" ><span class="sr-only">Toggle Dropdown</span></button>
                            </div>`;
                        }
                        else {
                            dom =
                                `<div table-action-menu class="btn-group">
                                <button type="button" dropdown class="btn btn-default fa fa-ellipsis-v"><span class="sr-only">Toggle Dropdown</span></button>
                                <div class="dropdown-menu">
                                    ${editItem}
                                    ${removeItem}
                                </div>
                            </div>`;
                        }

                        return dom;
                    },
                    fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                        $compile(nTd)($scope);
                    }

                },
            ],
        }

    }
})();