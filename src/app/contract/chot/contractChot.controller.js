(function () {
    'use strict';

    angular.module('ati.contract')
        .controller('ContractChotController', ContractChotController);

    function ContractChotController($scope, CONTRACT_EVENT, $timeout, CONTRACT_STATUS, hotRegisterer, ContractManager, HdLuuThongManager, Restangular) {
        $scope.rowHeaders = true;
        $scope.colHeaders = true;

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
                type: CONTRACT_STATUS.CLOSE_DEAL,
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
            // autoWrapRow: true,
            // rowHeaders: true,
            colHeaders: true,
            minSpareRows: 0,
            wordWrap: false,
            fixedColumnsLeft: 3,
            manualColumnFreeze: true,
            cells: function (row, col) {
                let cellPrp = {};
                cellPrp.readOnly = true;
                if (col === 1 || col === 2 || col === 8 || col === 9 || col === 11) {
                    cellPrp.renderer = myBtns;
                    cellPrp.readOnly = true;
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
                            setTimeout(function () {
                                $scope.$apply();
                                $scope.showModalThuVe(actuallyCollectedMoney, totalMoneyPaid);
                            }, 1);

                            break;
                        case 3:
                            setTimeout(function () {
                                $scope.$apply();
                                $scope.showModalBe(actuallyCollectedMoney, totalMoneyPaid);
                            }, 1);
                            break;

                        case 4:
                            setTimeout(function () {
                                $scope.$apply();
                                $scope.showModalKetThuc(actuallyCollectedMoney, totalMoneyPaid);
                            }, 1);

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

            if (cellProperties.prop === "createdAt" || cellProperties.prop === "transferDate" || cellProperties.prop === "appointmentDate") {
                if (value)
                    td.innerHTML = moment(value).format("DD/MM/YYYY");
                else
                    td.innerHTML = '';
            }

            if (cellProperties.prop === "actionTransf") {
                if ($scope.$parent.storeSelected.userId) {
                    td.innerHTML = '<button class="btnAction btn btn-success btAction-' + row + '" value="' + 1 + '">' + 'Thu về' + '</button>&nbsp;&nbsp;' +
                        '<button class="btnAction btn btn-success btAction-' + row + '" value="' + 3 + '">' + 'Bễ' + '</button>&nbsp;&nbsp;' +
                        '<button class="btnAction btn btn-success btAction-' + row + '" value="' + 4 + '">' + 'Kết thúc' + '</button>';
                }
                else
                    td.innerHTML = '';
            }
        }

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

        $scope.showModalBe = (actuallyCollectedMoney, totalMoneyPaid) => {
            let nowDate = moment();
            $scope.contractSelected.moneyContractOld = parseInt(actuallyCollectedMoney) - parseInt(totalMoneyPaid); //- parseInt(moneyPaid);
            $scope.contractSelected.createdAt = moment($scope.contractSelected.createdAt).format("DD/MM/YYYY");
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

            $scope.contractSelected.createdAt = moment($scope.contractSelected.createdAt).format("DD/MM/YYYY");
            $scope.contractSelected.moneyContractOld = parseInt(actuallyCollectedMoney) - parseInt(totalMoneyPaid); // - parseInt(moneyPaid);
            $scope.contractSelected.newTransferDate = nowDate.format("YYYY-MM-DD");
            $scope.contractSelected.payMoneyOriginal = 0;
            $('.datepicker-ui').val('');

            $scope.contractSelected.totalMoney = $scope.contractSelected.moneyContractOld;

            $('#ketThucModal').modal('show');
        };

        $timeout(function () {
            hotInstance = hotRegisterer.getInstance('my-handsontable');
        }, 0);


        $scope.saveThuVeModal = () => {
            if ($scope.formProcessing)
                return;

            $scope.formProcessing = true;
            $scope.contractSelected.isNotFromLuuThong = true;

            $scope.contractSelected.statusContract = CONTRACT_STATUS.COLLECT;
            $scope.contractSelected.moneyPaid = $scope.contractSelected.newActuallyCollectedMoney;

            HdLuuThongManager
                .one($scope.contractSelected._id)
                .one('transferType')
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

            ContractManager
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
    }
})();