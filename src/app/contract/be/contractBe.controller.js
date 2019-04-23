(function () {
    'use strict';

    angular.module('ati.contract')
        .controller('ContractBeController', ContractBeController);

    function ContractBeController($scope, CONTRACT_EVENT, $timeout, CONTRACT_STATUS, ContractManager, HdLuuThongManager, Restangular) {

        $scope.$on('$viewContentLoaded', function (event, data) {
            $scope.getData();
        });

        $scope.$on(CONTRACT_EVENT.UPDATE_SUCCESS, function () {
            $scope.getData();
        });

        $scope.getData = () => {
            $scope.formTableProcessing = true;

            ContractManager.one('allContract').one('byType').getList("",
                {
                    type: CONTRACT_STATUS.ESCAPE,
                    storeId: $scope.$parent.storeSelected.storeId,
                    userId: $scope.$parent.storeSelected.userId
                })
                .then((contracts) => {
                    $scope.contracts = angular.copy(Restangular.stripRestangular(contracts));

                    hotTableInstance.updateSettings({
                        data: $scope.contracts

                    });

                    hotTableInstance.getInstance().render();
                })
                .catch((error) => {

                })
                .finally(() => {
                    $scope.formTableProcessing = false;
                });
        };

        const container = document.getElementById('hotTable');
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
                    data: 'totalMoneyNeedPay',
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
                    data: 'loanDate',
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
                    data: 'beDate',
                    type: 'text',
                    width: 100,
                    readOnly: true
                },
                {
                    data: 'actionTransf',
                    type: 'text',
                    width: 270,
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
                'Gói vay',
                'Thực thu',
                'Dư nợ',
                'Đã đóng',
                'Số ngày vay',
                'Ngày chuyển',
                'Ngày bễ',
                'Thao tác'
            ],
            cells: function (row, col) {
                let cellPrp = {};
                cellPrp.className = "hot-normal";
                cellPrp.readOnly = true;
                if (col === 1 || col === 2 || col === 7 || col === 8 || col === 10) {
                    cellPrp.renderer = myBtns;
                    // cellPrp.readOnly = true;
                }

                // if (col === 2 || col === 3) {
                //     cellPrp.className = "handsontable-td-red";
                // }
                return cellPrp;
            },
            afterOnCellMouseDown: function (event, rowCol, TD) {
                if (event.realTarget.className.indexOf('cusRow') >= 0) {
                    let selectedCus = angular.copy($scope.contracts[rowCol.row]);
                    $scope.$parent.getContractsByCus(selectedCus);
                    return;
                }

                // if (event.realTarget.className.indexOf('btnStatus') >= 0 && $scope.$parent.storeSelected.userId) {
                //     let contractSelected = angular.copy(Restangular.stripRestangular($scope.contracts[rowCol.row]));
                //     let {actuallyCollectedMoney, totalMoneyPaid, moneyPaid} = contractSelected;
                //
                //     contractSelected.moneyContractOld = parseInt(actuallyCollectedMoney) - parseInt(totalMoneyPaid); // - parseInt(moneyPaid);
                //     contractSelected.newPayMoney = 0;
                //
                //     contractSelected.totalMoney = contractSelected.moneyContractOld;
                //     $scope.$parent.contractSelected = angular.copy(Restangular.stripRestangular(contractSelected));
                //     $scope.$apply();
                //
                //     $('#dongTienModal').modal('show');
                //
                // }

                if (event.realTarget.className.indexOf('btnAction') >= 0 && $scope.$parent.storeSelected.userId) {
                    $scope.contractSelected = {};
                    $scope.contractSelected = angular.copy(Restangular.stripRestangular($scope.contracts[rowCol.row]));
                    let {actuallyCollectedMoney, totalMoneyPaid, moneyPaid} = $scope.contractSelected;

                    switch (parseInt(event.realTarget.value)) {
                        case 1:
                            $scope.showModalThuVe(actuallyCollectedMoney, totalMoneyPaid);
                            break;
                        case 2:
                            $scope.showModalChot(actuallyCollectedMoney, totalMoneyPaid);
                            break;
                        case 4:
                            $scope.showModalKetThuc(actuallyCollectedMoney, totalMoneyPaid);
                            break;
                        case 5:
                            $scope.showModalDongTien(actuallyCollectedMoney, totalMoneyPaid);
                            break;
                    }

                    setTimeout(function () {
                        $scope.$apply();
                    }, 1);
                }
            }
        });

        function myBtns(instance, td, row, col, prop, value, cellProperties) {
            Handsontable.renderers.TextRenderer.apply(this, arguments);
            if (cellProperties.prop === "customer.name") {
                td.innerHTML = '<u><a class="linkable cusRow value="' + value + '" ng-click="viewCustomerCalendar(' + value + ')">' + value + '</a></u>';
            }

            if (cellProperties.prop === "createdAt" || cellProperties.prop === "transferDate" || cellProperties.prop === "beDate") {
                if (value)
                    td.innerHTML = moment(value).format("DD/MM/YYYY");
                else
                    td.innerHTML = '';
            }

            if (cellProperties.prop === "actionTransf") {
                if ($scope.$parent.storeSelected.userId) {
                    td.innerHTML = '<button class="btnAction btn btn-success btAction-' + row + '" value="' + 1 + '">' + 'Thu về' + '</button>&nbsp;&nbsp;' +
                        '<button class="btnAction btn btn-success btAction-' + row + '" value="' + 2 + '">' + 'Chốt' + '</button>&nbsp;&nbsp;' +
                        '<button class="btnAction btn btn-success btAction-' + row + '" value="' + 4 + '">' + 'Kết thúc' + '</button>&nbsp;&nbsp;' +
                        '<button class="btnAction btn btn-success btAction-' + 5 + '" value="' + 5 + '">' + 'Đóng' + '</button>';
                }
                else
                    td.innerHTML = '';
            }
        }

        $scope.showModalDongTien = (actuallyCollectedMoney, totalMoneyPaid) => {
            $scope.contractSelected.moneyContractOld = parseInt(actuallyCollectedMoney) - parseInt(totalMoneyPaid); // - parseInt(moneyPaid);
            $scope.contractSelected.newPayMoney = 0;

            $scope.contractSelected.totalMoney = $scope.contractSelected.moneyContractOld;
            $scope.contractSelected.contractCreatedAt = moment($scope.contractSelected.createdAt).utc().format("DD/MM/YYYY");
            $scope.contractSelected.payDate = "";
            $scope.$parent.contractSelected = angular.copy($scope.contractSelected);

            $('#dongTienModal').modal('show');
        };

        $scope.showModalThuVe = (actuallyCollectedMoney, totalMoneyPaid) => {
            let nowDate = moment();
            $scope.contractSelected.moneyContractOld = parseInt(actuallyCollectedMoney) - parseInt(totalMoneyPaid); // - parseInt(moneyPaid);
            $scope.contractSelected.createdAt = moment($scope.contractSelected.createdAt).format("DD/MM/YYYY");
            $scope.contractSelected.newPayMoney = 0;
            $scope.contractSelected.payMoneyOriginal = 0;
            $scope.contractSelected.totalMoney = $scope.contractSelected.moneyContractOld;

            $scope.contractSelected.newTransferDate = nowDate.format("YYYY-MM-DD");

            $('#hopDongThuVeModal').modal('show');
        };

        $scope.showModalChot = (actuallyCollectedMoney, totalMoneyPaid) => {
            let nowDate = moment();
            $scope.contractSelected.moneyContractOld = parseInt(actuallyCollectedMoney) - parseInt(totalMoneyPaid); // - parseInt(moneyPaid);
            $scope.contractSelected.newTransferDate = nowDate.format("YYYY-MM-DD");
            $scope.contractSelected.newAppointmentDate = "";
            $scope.contractSelected.newPayMoney = 0;
            $scope.contractSelected.payMoneyOriginal = 0;
            $scope.contractSelected.createdAt = moment($scope.contractSelected.createdAt).format("DD/MM/YYYY");
            $('.datepicker-ui').val('');

            $scope.contractSelected.totalMoney = $scope.contractSelected.moneyContractOld;

            $('#hopDongChotModal').modal('show');
        };

        $scope.showModalKetThuc = (actuallyCollectedMoney, totalMoneyPaid) => {
            let nowDate = moment();

            $scope.contractSelected.createdAt = moment($scope.contractSelected.createdAt).format("DD/MM/YYYY");
            $scope.contractSelected.moneyContractOld = parseInt(actuallyCollectedMoney) - parseInt(totalMoneyPaid); // - parseInt(moneyPaid);
            $scope.contractSelected.newTransferDate = nowDate.format("YYYY-MM-DD");
            $scope.contractSelected.payMoneyOriginal = 0;
            $('.datepicker-ui').val('');

            $scope.contractSelected.totalMoney = $scope.contractSelected.moneyContractOld;

            $('#ketThucModal').modal('show');
        };


        $scope.saveThuVeModal = () => {
            if ($scope.formProcessing)
                return;

            $scope.formProcessing = true;
            $scope.contractSelected.isNotFromLuuThong = true;

            $scope.contractSelected.statusContract = CONTRACT_STATUS.COLLECT;
            $scope.contractSelected.moneyPaid = $scope.contractSelected.newActuallyCollectedMoney;

            HdLuuThongManager
                .one($scope.contractSelected._id)
                .one('updateThuve')
                .customPUT($scope.contractSelected)
                .then((contract) => {
                    toastr.success('Chuyển hợp đồng Thu Về thành công!');

                    $scope.contractSelected = {};
                    $('#hopDongThuVeModal').modal('hide');

                    $scope.getData();
                })
                .catch((error) => {
                    console.log(error);
                    toastr.error("Có lỗi xảy ra! Hãy thử lại");
                })
                .finally(() => {
                    $scope.formProcessing = false;
                });
        };

        $scope.saveChotModal = () => {
            if ($scope.formProcessing)
                return;

            $scope.formProcessing = true;

            $scope.contractSelected.isNotFromLuuThong = true;
            $scope.contractSelected.statusContract = CONTRACT_STATUS.CLOSE_DEAL;
            $scope.contractSelected.newTransferDate = moment($scope.contractSelected.newTransferDate).format("YYYY-MM-DD");
            $scope.contractSelected.newAppointmentDate = moment($scope.contractSelected.newAppointmentDate).format("YYYY-MM-DD");
            $scope.contractSelected.moneyHavePay = $scope.contractSelected.moneyPaid = $scope.contractSelected.newPayMoney;

            HdLuuThongManager
                .one($scope.contractSelected._id)
                .one('updateChot')
                .customPUT($scope.contractSelected)
                .then((contract) => {
                    toastr.success('Chuyển hợp đồng Chốt thành công!');

                    $scope.contractSelected = {};
                    $('#hopDongChotModal').modal('hide');

                    $scope.getData();
                })
                .catch((error) => {
                    console.log(error);
                    toastr.error("Có lỗi xảy ra! Hãy thử lại");
                })
                .finally(() => {
                    $scope.formProcessing = false;
                });
        };

        $scope.saveKetThucModal = () => {
            if ($scope.formProcessing)
                return;

            // swal({
            //     title: 'Bạn có chắc chắn muốn kết thúc hợp đồng này ?',
            //     text: "",
            //     type: 'warning',
            //     showCancelButton: true,
            //     confirmButtonText: 'Có',
            //     cancelButtonText: 'Không',
            // }).then((result) => {
            //     if (result.value) {

            $scope.formProcessing = true;
            $scope.contractSelected.isNotFromLuuThong = true;
            $scope.contractSelected.newTransferDate = moment($scope.contractSelected.newTransferDate).format("YYYY-MM-DD");

            ContractManager
                .one($scope.contractSelected._id)
                .one('changeStatus')
                .customPUT({
                    status: CONTRACT_STATUS.END,
                    luuThongId: $scope.contractSelected._id,
                    payMoneyOriginal: $scope.contractSelected.payMoneyOriginal
                })
                .then((contract) => {
                    toastr.success('Chuyển hợp đồng Kết Thúc thành công!');

                    $scope.contractSelected = {};

                    $('#ketThucModal').modal('hide');
                    $scope.getData();
                })
                .catch((error) => {
                    toastr.error("Có lỗi xảy ra! Hãy thử lại");
                })
                .finally(() => {
                    $scope.formProcessing = false;
                });
            // }
            // });

        };

    }
})();