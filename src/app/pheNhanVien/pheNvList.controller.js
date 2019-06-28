(function () {
    'use strict';

    angular.module('ati.pheNv')
        .controller('PheNvListController', PheNvListController);

    function PheNvListController($scope, $state, $stateParams, $compile, AlertService, Restangular, ContractManager, storeList, StoreManager, Auth, moment) {
        let currentUser = Auth.getSession();
        $scope.filter = angular.copy($stateParams);

        let storeArr = angular.copy(Restangular.stripRestangular(storeList));
        let selectedStoreId = $scope.$parent.storeSelected.storeId;
        let storeCode = "";
        let storeItem = _.find(storeArr, {_id: selectedStoreId});
        if (storeItem) {
            storeCode = storeItem.storeId;
        }
        let regexCurrency = /(\d)(?=(\d{3})+(?!\d))/g;

        $scope.month = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
        $scope.date = new Date();

        $scope.userSelected = {storeId: $scope.$parent.storeSelected.storeId, id: $scope.$parent.storeSelected.userId};
        $scope.stores = [];
        $scope.usersByStore = [];

        $scope.filter.userId = $scope.userSelected.id;
        $scope.totalMoneyFee = 0;
        $scope.contracts = [];
        $scope.pagination = {
            // page: $stateParams.p ? parseInt($stateParams.p) : 1,
            page: 1,
            per_page: 30,
            totalItems: 0
        };

        $scope.$on('$viewContentLoaded', function (event, data) {
            $scope.getData();

            StoreManager.one('listForUser').getList()
                .then((stores) => {
                    $scope.stores = angular.copy(Restangular.stripRestangular(stores));

                    StoreManager.one(storeItem._id).one('listUserByStore').get()
                        .then((store) => {
                            $scope.usersByStore = _.map(store.staffs, (item) => {
                                if (!item.isAccountant)
                                    return item;
                            });
                            // $scope.usersByStore = angular.copy(Restangular.stripRestangular(store.staffs));
                        }, (error) => {
                        })
                        .finally(() => {
                        });
                });
        });

        $scope.selectedStoreEvent = function (item) {
            $scope.userSelected.id = "";
            $scope.filter.userId = "";
            $scope.getData();
            StoreManager.one(item._id).one('listUserByStore').get()
                .then((store) => {
                    $scope.usersByStore = _.map(store.staffs, (item) => {
                        if (!item.isAccountant)
                            return item;
                    });
                    // $scope.usersByStore = angular.copy(Restangular.stripRestangular(store.staffs));
                }, (error) => {
                })
                .finally(() => {
                });
        };

        $scope.selectedStaffEvent = function (item) {
            $scope.filter.userId = item._id;
            $scope.getData();
        };

        $scope.getData = function () {
            let currentPage = $scope.pagination.page;
            let per_page = $scope.pagination.per_page;

            if (!$scope.filter.userId) {
                $scope.contracts = [];
                return;
            }

            return ContractManager
                .one($scope.filter.userId ? $scope.filter.userId : $scope.userSelected.id)
                .customGET("commissionFeeStaff", {
                    page: currentPage,
                    per_page: per_page
                })
                .then(function (resp) {
                    // let r = resp.plain();
                    // $scope.contracts = r.contracts;

                    if (resp) {
                        let data = resp.plain();
                        $scope.contracts = angular.copy(Restangular.stripRestangular(data.contracts));
                        $scope.pagination.totalItems = data.totalItems;
                    } else {
                        $scope.contracts = [];
                        $scope.pagination.page = 1;
                        $scope.pagination.totalItems = 0;
                    }
                });
        };

        $scope.pageChanged = function () {
            let currentPage = $scope.pagination.page;
            let per_page = $scope.pagination.per_page;

            // $state.go(STATE_NAME, {
            //     q: $scope.keyWord,
            //     from: $scope.dateFilter.from,
            //     to: $scope.dateFilter.to,
            //     p: currentPage === 1 ? null : currentPage
            // }, {notify: false});

            document.documentElement.scrollTop = 0;
            $scope.getData();
        };

        $scope.totalMoneyFee = () => {
            let totalFee = 0;

            $scope.contracts.forEach(item => {
                totalFee += item.commissionFee === undefined ? 0 : item.commissionFee.receive;
            });

            return totalFee;
            // return $scope.orders.reduce((accumulator, currentValue) => accumulator + (currentValue.price), 0);
        };

        $scope.editComFee = (item) => {
            item.isEdit = !item.isEdit;
        };

        $scope.formatNumber = (index, item) => {
            let comFeeId = $('#comFee-' + index);
            let comValue = comFeeId.val();
            let money = parseInt(formatInputNumberKMB(comValue));
            if (money === item.commissionFee.receive) {
                item.isEdit = !item.isEdit;
                return;
            }

            item.commissionFee.receive = money;
            comFeeId.val(money.toString().replace(regexCurrency, '$1,'));

            ContractManager
                .one(item._id)
                .one("updateComFeeStaff")
                .customPUT({
                    moneyFeeStaff: money
                })
                .then(function (resp) {
                    item.isEdit = !item.isEdit;

                    item.commissionFee.lastUserNameUpdate = currentUser.fullName;

                    AlertService.replaceAlerts({
                        type: 'success',
                        message: "Cập nhật tiền phế thành công!"
                    });
                })
                .catch(err => {
                    console.log(err);

                    AlertService.replaceAlerts({
                        type: 'error',
                        message: "Có lỗi xảy ra. Hãy thử lại!"
                    });
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
            columns: [
                {
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
                    title: "Số hợp đồng",
                    orderable: false,
                    width: 100,
                    data: "contractNo",
                    render: function (data, e, full, meta) {
                        return `<a ui-sref="^.detail({id:'${full._id}'})">${data}</a>`;
                    },
                    fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                        $compile(nTd)($scope);
                    }
                },
                {
                    title: "Tên khách hàng",
                    data: "customerId.name",
                    width: 200,
                    render: function (data, e, full, meta) {
                        return data;
                    }
                },
                {
                    title: "Ngày vay",
                    orderable: false,
                    data: "loanDate",
                    width: 100,
                    className: "text-right",
                    render: function (data, e, full, meta) {
                        return moment(data).format("DD/MM/YYYY");
                    }
                },
                {
                    title: "Gói vay",
                    orderable: false,
                    data: "loanMoney",
                    width: 100,
                    className: "text-right",
                    render: function (data, e, full, meta) {
                        return data.toString().replace(regexCurrency, '$1,');
                    }
                },
                {
                    title: "Số ngày vay",
                    orderable: false,
                    data: "loanDate",
                    width: 100,
                    className: "text-right",
                    render: function (data, e, full, meta) {
                        return data;
                    }
                },
                {
                    title: "Tiền phế",
                    orderable: false,
                    data: "commissionFee.receive",
                    width: 100,
                    className: "text-right",
                    render: function (data, e, full, meta) {
                        let regexCurrency = /(\d)(?=(\d{3})+(?!\d))/g;
                        return (data * 1000).toString().replace(regexCurrency, '$1,');
                    }
                }

            ],
            // footerCallback: function (row, data, start, end, display) {
            //     var api = this.api();
            //
            //     // Update footer
            //     $(api.column(4).footer()).html(
            //         $scope.totalMoneyFee
            //     );
            // }
        };

    }
})();
