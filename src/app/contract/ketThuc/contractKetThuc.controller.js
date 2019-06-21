(function () {
    'use strict';

    angular.module('ati.contract')
        .controller('ContractKetThucController', ContractKetThucController);

    function ContractKetThucController($scope, $timeout, CONTRACT_STATUS, ContractManager, Restangular, CONTRACT_EVENT) {
        $scope.rowHeaders = true;
        $scope.colHeaders = true;

        $scope.$on(CONTRACT_EVENT.RESIZE_TABLE, function (event, data) {
            setTimeout(function () {
                hotTableInstance.render();
            }, 1);

        });

        $scope.$on('$viewContentLoaded', function (event, data) {
            $scope.getData();
        });

        $scope.pagination = {
            page: 1,
            per_page: 30,
            totalItems: 0,
            totalByPages: 0
        };

        $scope.getData = () => {
            ContractManager.one('allContract').one('byType')
                .customGET("", {
                    type: CONTRACT_STATUS.END,
                    // date: $scope.filter.date,
                    storeId: $scope.$parent.storeSelected.storeId,
                    userId: $scope.$parent.storeSelected.userId,
                    // page: $scope.pagination.page,
                    // per_page: $scope.pagination.per_page
                })
                .then((resp) => {
                    if (resp) {
                        let data = resp.plain();
                        $scope.contracts = angular.copy(Restangular.stripRestangular(data.docs));
                        $scope.pagination.totalItems = data.totalItems;
                        $scope.totalMoneyPaid = data.totalMoneyStatus;

                        let totalContract = $scope.contracts.length;

                        if ($scope.pagination.page > 1) {
                            $scope.pagination.totalByPages = (($scope.pagination.page - 1) * $scope.pagination.per_page) + totalContract;
                        } else {
                            $scope.pagination.totalByPages = totalContract;
                        }
                    } else {
                        $scope.contracts = [];
                        $scope.pagination.page = 1;
                        $scope.pagination.totalItems = 0;
                        $scope.pagination.totalByPages = 0;
                        $scope.totalMoneyPaid = 0;
                    }

                    hotTableInstance.updateSettings({
                        data: $scope.contracts
                    });

                    hotTableInstance.getInstance().render();
                })
                .catch((error) => {

                });
        };

        const container = document.getElementById('hotKetThucTable');
        const hotTableInstance = new Handsontable(container, {
            data: $scope.contracts,
            licenseKey: 'non-commercial-and-evaluation',
            columns: [
                {
                    data: 'contractNo',
                    type: 'text',
                    width: 170,
                    readOnly: true
                },
                {
                    data: 'customer.name',
                    type: 'text',
                    width: 150,
                    readOnly: true
                },
                {
                    data: 'createdAt',
                    type: 'text',
                    width: 100,
                    readOnly: true,
                },
                {
                    data: 'loanDate',
                    type: 'numeric',
                    numericFormat: {
                        pattern: '#,###'
                    },
                    width: 100,
                    readOnly: true
                },
                {
                    data: 'loanMoney',
                    type: 'numeric',
                    width: 100,
                    numericFormat: {
                        pattern: '#,###'
                    },
                    readOnly: true
                },
                {
                    data: 'actuallyCollectedMoney',
                    type: 'numeric',
                    numericFormat: {
                        pattern: '#,###'
                    },
                    width: 100,
                    readOnly: true
                },
                {
                    data: 'totalHavePay',
                    type: 'numeric',
                    numericFormat: {
                        pattern: '#,###'
                    },
                    width: 120,
                    readOnly: true
                },
                {
                    data: 'totalMoneyPaid',
                    type: 'numeric',
                    numericFormat: {
                        pattern: '#,###'
                    },
                    width: 100,
                    readOnly: true
                },
                {
                    data: 'transferDate',
                    type: 'text',
                    width: 100,
                    readOnly: true
                },
                {
                    data: 'note',
                    type: 'text',
                    width: 250,
                    readOnly: true
                },
                {
                    data: 'status',
                    type: 'text',
                    width: 90,
                    readOnly: true
                },
                {
                    data: 'actionTransf',
                    type: 'text',
                    width: 60,
                    readOnly: true
                }
            ],
            stretchH: 'all',
            copyPaste: false,
            autoWrapRow: true,
            // wordWrap: false,
            // preventOverflow: 'horizontal',
            fixedColumnsLeft: 3,
            // manualColumnFreeze: true,
            viewportColumnRenderingOffset: 100,
            viewportRowRenderingOffset: 100,
            rowHeights: 35,
            colHeaders: [
                'Số hợp đồng',
                'Họ và tên',
                'Ngày vay',
                'Số ngày vay',
                'Gói vay',
                'Thực thu',
                'Dư nợ',
                'Đã đóng',
                'Ngày chuyển',
                'Ghi chú',
                'Trạng thái',
                'Thao tác'
            ],
            cells: function (row, col) {
                let cellPrp = {};
                cellPrp.className = "hot-normal";

                if (col === 1 || col === 2 || col === 8 || col === 10 || col === 11) {
                    cellPrp.renderer = myBtns;
                }

                // if (col === 7)
                //     cellPrp.className = "handsontable-td-red";

                return cellPrp;
            },
            afterOnCellMouseDown: function (event, rowCol, TD) {
                if (event.realTarget.className.indexOf('cusRow') >= 0) {
                    let selectedCus = angular.copy($scope.contracts[rowCol.row]);
                    $scope.$parent.getContractsByCus(selectedCus);
                    return;
                }

                if (event.realTarget.className.indexOf('btnDuyet') >= 0 && $scope.$parent.storeSelected.userId) {
                    let contractSelected = angular.copy(Restangular.stripRestangular($scope.contracts[rowCol.row]));
                    let {actuallyCollectedMoney, totalMoneyPaid, moneyPaid} = contractSelected;

                    contractSelected.newTransferDate = moment().format("YYYY-MM-DD");
                    contractSelected.moneyContractOld = parseInt(actuallyCollectedMoney) - parseInt(totalMoneyPaid); // - parseInt(moneyPaid);
                    contractSelected.moneyNotEnough = 0;

                    contractSelected.totalMoney = contractSelected.moneyContractOld;
                    $scope.$parent.contractSelected = angular.copy(Restangular.stripRestangular(contractSelected));
                    $scope.$apply();

                    $('#duyetModal').modal('show');
                }
            }
        });

        function myBtns(instance, td, row, col, prop, value, cellProperties) {
            Handsontable.renderers.TextRenderer.apply(this, arguments);
            if (cellProperties.prop === "customer.name") {
                // td.innerHTML = '<u><a ng-click="viewCustomerCalendar(' + value + ')">' + value + '</a></u>';
                td.innerHTML = '<u><a class="linkable cusRow" value="' + value + '" ng-click="viewCustomerCalendar(' + value + ')">' + value + '</a></u>';
            }

            if (cellProperties.prop === "createdAt" || cellProperties.prop === "transferDate") {
                if (value)
                    td.innerHTML = moment(value).format("DD/MM/YYYY");
                else
                    td.innerHTML = '';
            }

            if (cellProperties.prop === "status") {
                let statusName = "";
                switch (value) {
                    case 6:
                        statusName = "Kết thúc";
                        break;
                    case 7:
                        statusName = "Kết thúc đáo";
                        break;

                }
                td.innerHTML = '<button class="btnStatus btn status-' + value + '" value="' + 0 + '">' + statusName + '</button>';
            }

            if (cellProperties.prop === "actionTransf") {
                td.innerHTML = '<button class="btnStatus btnDuyet btn status-0">' + 'Duyệt' + '</button>';
            }
        }

        $scope.accountantEnd = () => {
            $scope.formProcessing = true;

            ContractManager
                .one($scope.contractSelected._id)
                .one('changeStatus')
                .customPUT({
                    status: CONTRACT_STATUS.ACCOUNTANT_END,
                    newTransferDate: $scope.contractSelected.newTransferDate
                })
                .then((contract) => {
                    toastr.success('Cập nhật thành công!');

                    $('#duyetModal').modal('hide');
                    $scope.getData();
                })
                .catch((error) => {
                    toastr.error('Cập nhật không thành công!');
                })
                .finally(() => {
                    $scope.formProcessing = false;
                });
        };

        $timeout(function () {
            Inputmask({}).mask(document.querySelectorAll(".datemask"));
        }, 0);

    }
})();
