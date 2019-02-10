(function () {
    'use strict';

    angular.module('ati.admin')
        .controller('RoleController', RoleController);

    function RoleController($scope, $state, $stateParams, adminRestangular, $translate, AdminService) {
        $scope.filter = angular.copy($stateParams);
        $scope.selectedGroupName = $stateParams.groupName;

        $scope.$on('$viewContentLoaded', function (event, data) {
            var stateName = $state.current.name;
            if (stateName.indexOf("role.edit") !== -1) {
                $scope.mode = "edit";

                $scope.currentRole = $stateParams.friendlyName;
                $scope.getById();
                $scope.getData();
                $scope.getListFeatures();
                $scope.isNew = false;
            } else if (stateName.indexOf("role.new") >= 0) {
                $scope.mode = "add";
                $scope.isNew = true;
            } else {
                $scope.getData();
            }
        });

        $scope.$on('$stateChangeStart', function (event) {
            if ($scope.formProcessing) {
                $scope.formProcessing = false;
                return;
            }
        });

        $scope.backToList = function () {
            $state.go('^.list');
        };

        $scope.getById = function () {
            adminRestangular.all("roles").customGET($stateParams.friendlyName).then(role => {
                $scope.role = role.plain();
            })
        };

        $scope.updateRole = function () {
            adminRestangular.all("roles").customPUT(_.pick($scope.role, ['name', 'description', 'friendlyName']), $stateParams.friendlyName).then(result => {
                toastr.success("Cập nhật thành công");
            }).catch(err => {
                toastr.error(err);
            });
        };

        $scope.updateFeatureAccess = function (colAction, feature, event) {
            if (AdminService.hasRouteNames(['role.update'])) {
                let action = feature.actions.find(item => {
                    return item.routeName.split(".")[1] == colAction;
                });

                let status = feature.hasPermissions.indexOf(colAction) >= 0 ? "pull" : "push";

                adminRestangular.all("feature-access").customPUT({
                    roleName: $stateParams.friendlyName,
                    routeName: action.routeName,
                    status: status
                }, `${feature.friendlyName}/update-role`).then(resp => {
                    if (status === "push") {
                        feature.hasPermissions.push(colAction);
                    } else {
                        let index = feature.hasPermissions.indexOf(colAction);
                        feature.hasPermissions.splice(index, 1);
                    }
                });
            } else {
                event.preventDefault();
                toastr.warning("Bạn không có quyền");
            }
        };

        $scope.removeAllPermission = function (feature) {
            adminRestangular.all("feature-access").customDELETE(`${feature.friendlyName}/remove-role`, {
                roleName: $stateParams.friendlyName
            }).then(resp => {
                // toastr.success("Cập nhật thành công");
                feature.hasPermissions = [];
            }).catch(err => {
                toastr.error("Có lỗi xảy ra");
            })
        };

        $scope.features = [];

        //Danh sách các nhóm chức năng của feature
        $scope.groupNames = [];

        //Danh sách các action có được
        $scope.actions = [];

        $scope.getListFeatures = function () {
            adminRestangular.all("feature-access").customGET("").then(resp => {
                let data = resp.plain();
                data.forEach(item => {
                    if ($scope.groupNames.indexOf(item.groupName) < 0)
                        $scope.groupNames.push(item.groupName);

                    item.hasPermissions = []; //Lưu danh sách các action mà role có quyền truy cập hiện tại
                    item.actionNames = []; //Lưu danh sách tên các action mà feature này có

                    item.actions.forEach(action => {
                        item.actionNames.push(action.routeName.split('.')[1]);
                        if (action.roles.indexOf($scope.currentRole) >= 0) {
                            item.hasPermissions.push(action.routeName.split('.')[1]);
                        }
                    })
                });


                $scope.features = data;

                if ($scope.groupNames.indexOf($scope.selectedGroupName) >= 0) {
                    $scope.selectGroupName($scope.selectedGroupName);
                } else {
                    $scope.selectGroupName("Hợp đồng");
                }
            });
        };

        //Danh sách định nghĩa các action và tiêu đề hiển thị
        $scope.actionTerms = [
            {
                name: "list",
                title: "Xem"
            },
            {
                name: "viewDate",
                title: "Xem theo ngày"
            },
            {
                name: "create",
                title: "Thêm"
            },
            {
                name: "update",
                title: "Sửa"
            },
            {
                name: "remove",
                title: "Xóa"
            },
            {
                name: "active",
                title: "Kích hoạt"
            },
            {
                name: "disable",
                title: "Ngừng hoạt động"
            },
            {
                name: "lock",
                title: "Khóa tài khoản"
            },
            {
                name: "unlock",
                title: "Mở khóa"
            }, {
                name: "exportExcel",
                title: "Xuất Excel"
            },
            // {
            //     name: "print",
            //     title: "In"
            // },
            {
                name: "upload",
                title: "Tải lên"
            }
        ];

        $scope.selectedGroupName = "";

        $scope.selectGroupName = function (groupName) {
            $scope.selectedGroupName = groupName;

            $state.go(
                $state.current.name,
                Object.assign({}, $stateParams, {groupName: groupName}),
                {notify: false}
            );

            //Cập nhật lại danh sách các actions để hiển thị ra thành các cột
            $scope.actions = [];

            let actionNames = [];
            $scope.features.forEach(item => {
                if (item.groupName == groupName) {
                    actionNames = _.union(actionNames, item.actionNames);
                }
            });

            actionNames.map(name => {
                let actionTerm = $scope.actionTerms.find(i => i.name == name);
                if (actionTerm) {
                    $scope.actions.push(actionTerm);
                }
            });
        };

        $scope.selectRole = function (data) {
            $state.go($state.current.name, {
                friendlyName: data.friendlyName
            }, {
                notify: true
            });
        };

        $scope.getData = function (filter) {
            $scope.keyword = $scope.filter.search;
            return adminRestangular
                .all("roles")
                .customGET("", $scope.filter)
                .then(function (resp) {
                    $scope.total = resp.length;
                    $scope.tableData = resp.plain();
                });
        };


        $scope.isFormValid = function () {
            return $scope.editForm.$valid;
        };

        $scope.resetForm = function () {
            if ($("#editForm").serialize() !== $scope.form_original_data || $scope.uploadedImage) {
                let confirmBack = confirm($translate.instant("CHANGES_YOU_MADE_MAY_NOT_BE_SAVED"));
                if (confirmBack === false) {
                    event.preventDefault();
                    return;
                }
            }
            $scope.form_original_data = $("#editForm").serialize();
            $state.go('^.list');
        };

        $scope.remove = function (friendlyName) {
            swal({
                title: 'Bạn có chắc muốn xóa nhóm quyền này?',
                text: "",
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Đồng ý',
                cancelButtonText: 'Hủy bỏ',
            }).then((result) => {
                if (result.value) {
                    adminRestangular.all("/roles").customDELETE(friendlyName).then(function (resp) {
                        toastr.success("Xóa thành công!");
                        swal.close();
                        $scope.getData()
                    });
                }
            })
        };

        $scope.addNewRole = function () {
            // $scope.role.friendlyName = StringService.convertViToEn($scope.role.name);

            adminRestangular.all('roles').post($scope.role).then(function (resp) {
                $scope.form_original_data = $("#editForm").serialize();
                $state.go("^.list");
                toastr.success('Lưu thành công!');
            }, function (resp) {
                toastr.error(resp.code);
            })
        };

        $scope.keyword = $stateParams.search;

        $scope.filterSearch = function (e) {
            if (e.keyCode === 13) {
                $scope.getData()
                $state.go('.', {
                    search: $scope.filter.search
                }, {
                    notify: false
                });
            }
        }
    }
})();