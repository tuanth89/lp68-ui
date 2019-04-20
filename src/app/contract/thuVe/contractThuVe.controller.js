(function () {
    'use strict';

    angular.module('ati.contract')
        .controller('ContractThuVeController', ContractThuVeController);

    function ContractThuVeController($scope, CONTRACT_EVENT, $timeout, CONTRACT_STATUS, hotRegisterer, ContractManager, HdLuuThongManager, Restangular) {
        $scope.rowHeaders = true;
        $scope.colHeaders = true;

        $scope.contractSelected = {};

        $scope.$on('$viewContentLoaded', function (event, data) {
            $scope.getData();
        });

        $scope.$on(CONTRACT_EVENT.UPDATE_SUCCESS, function () {
            $scope.getData();
        });

        $scope.$on(CONTRACT_EVENT.RESIZE_TABLE, function (event, data) {
            hotInstance.render();
        });

        $scope.getData = () => {
            ContractManager.one('allContract').one('byType').getList("", {
                type: CONTRACT_STATUS.COLLECT,
                storeId: $scope.$parent.storeSelected.storeId,
                userId: $scope.$parent.storeSelected.userId
            })
                .then((contracts) => {
                    $scope.contracts = angular.copy(Restangular.stripRestangular(contracts));
                })
                .catch((error) => {

                });
        };

        let hotInstance = "";
        $scope.settings = {
            stretchH: "all",
            copyPaste: false,
            // autoWrapRow: true,
            // rowHeaders: true,
            colHeaders: true,
            minSpareRows: 0,
            wordWrap: false,
            fixedColumnsLeft: 3,
            manualColumnFreeze: true,
            cells: function (row, col) {
                let cellPrp = {};
                if (col === 1 || col === 2 || col === 8 || col === 9) {
                    cellPrp.renderer = myBtns;
                    cellPrp.readOnly = true;
                }

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
                // }

                if (event.realTarget.className.indexOf('btnAction') >= 0 && $scope.$parent.storeSelected.userId) {
                    $scope.contractSelected = {};
                    $scope.contractSelected = angular.copy(Restangular.stripRestangular($scope.contracts[rowCol.row]));
                    let {actuallyCollectedMoney, totalMoneyPaid, moneyPaid} = $scope.contractSelected;

                    switch (parseInt(event.realTarget.value)) {
                        case 2:
                            $scope.showModalChot(actuallyCollectedMoney, totalMoneyPaid);
                            break;
                        case 3:
                            $scope.showModalBe(actuallyCollectedMoney, totalMoneyPaid);
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
        };

        function myBtns(instance, td, row, col, prop, value, cellProperties) {
            Handsontable.renderers.TextRenderer.apply(this, arguments);
            if (cellProperties.prop === "customer.name") {
                // td.innerHTML = '<u><a ng-click="viewCustomerCalendar(' + value + ')">' + value + '</a></u>';
                td.innerHTML = '<u><a class="linkable cusRow value="' + value + '" ng-click="viewCustomerCalendar(' + value + ')">' + value + '</a></u>';
            }

            if (cellProperties.prop === "createdAt" || cellProperties.prop === "transferDate") {
                if (value)
                    td.innerHTML = moment(value).format("DD/MM/YYYY");
                else
                    td.innerHTML = '';
            }

            // if (cellProperties.prop === "actionTransf") {
            //     td.innerHTML = '<button class="btnStatus btn status-0">' + 'Đóng' + '</button>';
            // }

            if (cellProperties.prop === "actionTransf") {
                if ($scope.$parent.storeSelected.userId) {
                    td.innerHTML = '<button class="btnAction btn btn-success btAction-' + row + '" value="' + 2 + '">' + 'Chốt' + '</button>&nbsp;&nbsp;' +
                        '<button class="btnAction btn btn-success btAction-' + row + '" value="' + 3 + '">' + 'Bễ' + '</button>&nbsp;&nbsp;' +
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

        $scope.showModalChot = (actuallyCollectedMoney, totalMoneyPaid) => {
            let nowDate = moment();
            $scope.contractSelected.moneyContractOld = parseInt(actuallyCollectedMoney) - parseInt(totalMoneyPaid); // - parseInt(moneyPaid);
            $scope.contractSelected.newTransferDate = nowDate.format("YYYY-MM-DD");
            $scope.contractSelected.newAppointmentDate = "";
            $scope.contractSelected.newPayMoney = 0;
            $scope.contractSelected.payMoneyOriginal = 0;
            $scope.contractSelected.contractCreatedAt = moment($scope.contractSelected.createdAt).utc().format("DD/MM/YYYY");
            $('.datepicker-ui').val('');

            $scope.contractSelected.totalMoney = $scope.contractSelected.moneyContractOld;

            $('#hopDongChotModal').modal('show');
        };

        $scope.showModalBe = (actuallyCollectedMoney, totalMoneyPaid) => {
            let nowDate = moment();
            $scope.contractSelected.moneyContractOld = parseInt(actuallyCollectedMoney) - parseInt(totalMoneyPaid); //- parseInt(moneyPaid);
            $scope.contractSelected.contractCreatedAt = moment($scope.contractSelected.createdAt).utc().format("DD/MM/YYYY");
            $scope.contractSelected.newBeLoanDate = nowDate.format("DD/MM/YYYY");
            $scope.contractSelected.newTransferDate = nowDate.format("YYYY-MM-DD");
            $scope.contractSelected.newAppointmentDate = "";
            $scope.contractSelected.newPayMoney = 0;
            $scope.contractSelected.payMoneyOriginal = 0;
            $('.datepicker-ui').val('');

            $scope.contractSelected.totalMoney = $scope.contractSelected.moneyContractOld;
            $('#hopDongBeModal').modal('show');
        };

        $scope.showModalKetThuc = (actuallyCollectedMoney, totalMoneyPaid) => {
            let nowDate = moment();
            $scope.contractSelected.contractCreatedAt = moment($scope.contractSelected.createdAt).utc().format("DD/MM/YYYY");
            $scope.contractSelected.moneyContractOld = parseInt(actuallyCollectedMoney) - parseInt(totalMoneyPaid); // - parseInt(moneyPaid);
            $scope.contractSelected.newTransferDate = nowDate.format("YYYY-MM-DD");
            $scope.contractSelected.payMoneyOriginal = 0;
            $('.datepicker-ui').val('');

            $scope.contractSelected.totalMoney = $scope.contractSelected.moneyContractOld;

            $('#ketThucModal').modal('show');
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
                .one('transferType')
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

        $scope.saveBeModal = () => {
            if ($scope.formProcessing)
                return;

            $scope.formProcessing = true;

            $scope.contractSelected.isNotFromLuuThong = true;
            $scope.contractSelected.statusContract = CONTRACT_STATUS.ESCAPE;
            $scope.contractSelected.newAppointmentDate = moment($scope.contractSelected.newAppointmentDate).format("YYYY-MM-DD");
            $scope.contractSelected.newTransferDate = moment($scope.contractSelected.newTransferDate).format("YYYY-MM-DD");
            $scope.contractSelected.moneyHavePay = $scope.contractSelected.moneyPaid = $scope.contractSelected.newPayMoney;

            HdLuuThongManager
                .one($scope.contractSelected._id)
                .one('transferType')
                .customPUT($scope.contractSelected)
                .then((contract) => {
                    toastr.success('Chuyển hợp đồng Bễ thành công!');

                    $scope.contractSelected = {};
                    $('#hopDongBeModal').modal('hide');

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

            $scope.contractSelected.statusContract = CONTRACT_STATUS.END;
            $scope.contractSelected.newTransferDate = moment($scope.contractSelected.newTransferDate).format("YYYY-MM-DD");
            // $scope.contractSelected.moneyHavePay = $scope.contractSelected.moneyPaid = $scope.contractSelected.newPayMoney;

            HdLuuThongManager
                .one($scope.contractSelected._id)
                .one('transferType')
                .customPUT($scope.contractSelected)
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

        $scope.opened = false;
        $scope.opened2 = false;

        $scope.openDate = function ($event, type) {
            $event.preventDefault();
            $event.stopPropagation();

            if (type === 1) {
                $scope.opened = true;
                $scope.opened2 = false;
            }
            else {
                $scope.opened2 = true;
                $scope.opened = false;
            }
        };

        $timeout(function () {
            hotInstance = hotRegisterer.getInstance('my-handsontable');

            $scope.onAfterInit = function () {
                hotInstance.validateCells();
            };
        }, 0);

    }
})();