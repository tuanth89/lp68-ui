(function () {
    'use strict';

    angular.module('ati.contract')
        .controller('CustomerCirculationController', CustomerCirculationController)
    ;

    function CustomerCirculationController($scope, $timeout, hotRegisterer, CONTRACT_STATUS, ContractManager, moment, Restangular, HdLuuThong) {

        let hotInstance = "";
        $scope.formProcessing = false;
        $scope.filter = {date: "", status: ""};
        $scope.selectedCirculation = {};

        $scope.status = [
            {
                value: -1,
                title: "Tất cả"
            },
            {
                value: 0,
                title: "Lưu thông"
            },
            {
                value: 1,
                title: "Đáo"
            },
            {
                value: 2,
                title: "Lãi đứng"
            },
            {
                value: 3,
                title: "Thu về"
            },
            {
                value: 4,
                title: "Chốt"
            },
            {
                value: 5,
                title: "Bễ"
            },
            {
                value: 6,
                title: "Kết thúc"
            }
        ];

        $scope.checkedList = [];
        $scope.checkbox = {checkAll: false};
        $scope.$watch('checkbox.checkAll', function (newValue, oldValue) {
            if (newValue != oldValue) {
                _.map($scope.contracts, function (x, index) {
                    if (x.status === 0) {
                        x.isActive = newValue;

                        let checkedIndex = $scope.checkedList.indexOf(index);
                        if (checkedIndex >= 0) {
                            $scope.checkedList.splice(checkedIndex, 1);
                        }
                        else
                            $scope.checkedList.push(index);
                    }

                    return x;
                });

                if (newValue) {
                    hotInstance.selectCell(0, 0, hotInstance.countRows() - 1, hotInstance.countCols() - 1);
                }
                else {
                    hotInstance.selectCell(0, 0, 0, 0, true);
                }
            }
        });

        $scope.$watch('filter.status', function (newValue, oldValue) {
            if (newValue != oldValue) {
                $scope.getData();
            }
        });

        $scope.$watch('filter.date', function (newValue, oldValue) {
            if (newValue != oldValue) {
                $scope.getData();
            }
        });

        $scope.$watch("selectedCirculation.newLoanMoney", function (newValue, oldValue) {
            $scope.selectedCirculation.totalMoney = parseInt(newValue) + parseInt($scope.selectedCirculation.moneyContractOld);
            setTimeout(function () {
                $scope.$apply();
            }, 1);
        });

        $scope.$watch("selectedCirculation.newActuallyCollectedMoney", function (newValue, oldValue) {
            $scope.selectedCirculation.newDailyMoney = parseInt(newValue) / parseInt(!$scope.selectedCirculation.newLoanDate === 0 ? 1 : $scope.selectedCirculation.newLoanDate);
            setTimeout(function () {
                $scope.$apply();
            }, 1);
        });
        $scope.$watch("selectedCirculation.newLoanDate", function (newValue, oldValue) {
            $scope.selectedCirculation.newDailyMoney = parseInt($scope.selectedCirculation.newActuallyCollectedMoney) / parseInt(newValue);
            setTimeout(function () {
                $scope.$apply();
            }, 1);
        });

        $scope.filter.date = moment(new Date()).format("YYYY-MM-DD");

        $scope.contracts = [];
        $scope.rowHeaders = true;
        $scope.colHeaders = true;
        $scope.settings = {
            data: $scope.contracts,
            // rowHeaders: true,
            colHeaders: true,
            minSpareRows: 0,
            stretchH: "all",
            cells: function (row, col) {
                let cellPrp = {};
                let item = $scope.contracts[row];
                if (typeof item === 'object' && item.contractStatus !== CONTRACT_STATUS.STAND && (item.status > 0 || item.contractStatus > 0)) {
                    cellPrp.readOnly = true;
                    // cellPrp.className = "handsontable-cell-disable";

                    if (col === 2) {
                        cellPrp.renderer = myBtns;
                    }

                    if (col === 7) {
                        cellPrp.renderer = myBtnsRemove;
                    }

                    if (col === 8) {
                        cellPrp.renderer = myBtns;
                    }

                    // if (col === 3 || col === 4 || col === 5) {
                    //     cellPrp.className = "handsontable-td-red";
                    // }

                    return cellPrp;
                }

                if (col === 2) {
                    cellPrp.renderer = myBtns;
                }

                if (col === 7 || col === 8) {
                    cellPrp.renderer = myBtns;
                    cellPrp.readOnly = true;
                }

                if (col === 6) {
                    cellPrp.className = "hot-normal";
                }

                if (typeof item === 'object' && item.contractStatus === CONTRACT_STATUS.STAND) {
                    cellPrp.className = "handsontable-td-red";
                }

                return cellPrp;
            },
            afterOnCellMouseDown: function (event, rowCol, TD) {
                // if (event.realTarget.className.indexOf('btnPay') >= 0) {
                //     hotInstance.setDataAtCell(rowCol.row, 5, parseInt(event.realTarget.innerText) * 1000);
                //     return;
                // }

                if (event.realTarget.className.indexOf('cusRow') >= 0) {
                    let selectedCus = angular.copy($scope.contracts[rowCol.row]);
                    $scope.$parent.getContractsByCus(selectedCus);
                    return;
                }

                if (event.realTarget.className.indexOf('btnAction') >= 0) {
                    $scope.selectedCirculation = {};
                    let nowDate = moment($scope.filter.date, "YYYYMMDD");
                    $scope.selectedCirculation = angular.copy(Restangular.stripRestangular($scope.contracts[rowCol.row]));
                    let dateContract = moment($scope.selectedCirculation.createdAt, "YYYYMMDD");
                    let diffDays = nowDate.diff(dateContract, 'days');
                    let {actuallyCollectedMoney, totalMoneyPaid, moneyPaid} = $scope.selectedCirculation;

                    switch (parseInt(event.realTarget.value)) {
                        case 0:
                            $scope.selectedCirculation.totalMoney = 0;
                            $scope.selectedCirculation.newDailyMoney = 0;
                            $scope.selectedCirculation.newDailyMoney = 0;
                            // $scope.selectedCirculation.moneyContractOld = parseInt(actuallyCollectedMoney) - (parseInt(dailyMoney) * diffDays);
                            $scope.selectedCirculation.moneyContractOld = parseInt(actuallyCollectedMoney) - parseInt(totalMoneyPaid) - parseInt(moneyPaid);
                            let createdAt = moment(nowDate).add(1, "days");
                            $scope.selectedCirculation.createdAt = moment($scope.selectedCirculation.createdAt).format("DD/MM/YYYY");
                            $scope.selectedCirculation.contractDate = createdAt;
                            $scope.selectedCirculation.totalMoney = $scope.selectedCirculation.moneyContractOld;

                            $('#hopDongDaoModal').modal('show');
                            break;
                        case 1:
                            nowDate = moment();
                            // let dateContract = moment($scope.selectedCirculation.createdAt, "YYYYMMDD");
                            // let diffDays = nowDate.diff(dateContract, 'days');
                            // let {actuallyCollectedMoney, dailyMoney} = $scope.selectedCirculation;
                            $scope.selectedCirculation.moneyContractOld = parseInt(actuallyCollectedMoney) - parseInt(totalMoneyPaid) - parseInt(moneyPaid);
                            $scope.selectedCirculation.createdAt = moment($scope.selectedCirculation.createdAt).format("DD/MM/YYYY");
                            $scope.selectedCirculation.newTransferDate = nowDate.format("DD/MM/YYYY");
                            $scope.selectedCirculation.newChotLoanDate = "";
                            $scope.selectedCirculation.newAppointmentDate = "";

                            $scope.selectedCirculation.totalMoney = $scope.selectedCirculation.moneyContractOld;
                            $('#hopDongThuVeModal').modal('show');
                            break;
                        case 2:
                            nowDate = moment();
                            // let dateContract = moment($scope.selectedCirculation.createdAt, "YYYYMMDD");
                            // let diffDays = nowDate.diff(dateContract, 'days');
                            // let {actuallyCollectedMoney, dailyMoney} = $scope.selectedCirculation;
                            $scope.selectedCirculation.moneyContractOld = parseInt(actuallyCollectedMoney) - parseInt(totalMoneyPaid) - parseInt(moneyPaid);
                            $scope.selectedCirculation.createdAt = moment($scope.selectedCirculation.createdAt).format("DD/MM/YYYY");
                            $scope.selectedCirculation.newTransferDate = nowDate.format("DD/MM/YYYY");
                            $scope.selectedCirculation.newChotLoanDate = "";
                            $scope.selectedCirculation.newAppointmentDate = "";
                            $('.datepicker-ui').val('');

                            $scope.selectedCirculation.totalMoney = $scope.selectedCirculation.moneyContractOld;
                            $('#hopDongChotModal').modal('show');

                            break;
                        case 3:
                            nowDate = moment();
                            $scope.selectedCirculation.moneyContractOld = parseInt(actuallyCollectedMoney) - parseInt(totalMoneyPaid) - parseInt(moneyPaid);
                            $scope.selectedCirculation.createdAt = moment($scope.selectedCirculation.createdAt).format("DD/MM/YYYY");
                            $scope.selectedCirculation.newBeLoanDate = nowDate.format("DD/MM/YYYY");
                            $scope.selectedCirculation.newAppointmentDate = "";
                            $('.datepicker-ui').val('');

                            $scope.selectedCirculation.totalMoney = $scope.selectedCirculation.moneyContractOld;
                            $('#hopDongBeModal').modal('show');
                            break;
                        case 4:
                            $scope.saveKetThucModal();
                            break;

                    }

                    $scope.$apply();

                }

                // $scope.clickPay(event.realTarget.innerText);
            },
            afterChange: function (source, changes) {
                if (changes === 'edit') {
                    if (source[0][1] === "isActive") {
                        let rowChecked = source[0][0];
                        let checkedIndex = $scope.checkedList.indexOf(rowChecked);

                        if (checkedIndex >= 0) {
                            $scope.checkedList.splice(checkedIndex, 1);
                        }
                        else
                            $scope.checkedList.push(rowChecked);

                        // console.log('row: ' + source[0][0]);
                        // console.log('col: ' + source[0][1]);
                        // console.log('old value: ' + source[0][2]);
                        // console.log('new value: ' + source[0][3]);

                    }
                }
            }
        };

        function myBtns(instance, td, row, col, prop, value, cellProperties) {
            Handsontable.renderers.TextRenderer.apply(this, arguments);
            // if (col === 4) {
            //     td.innerHTML = '<div><button class="btnPay btn btn-success bt-' + row + '">' + 0 + '</button>&nbsp;&nbsp;' +
            //         '<button class="btnPay btn btn-success bt-' + row + '">' + 100 +
            //         '</button>&nbsp;&nbsp;<button class="btnPay btn btn-success bt-' + row + '">' + 200 + '</button>' +
            //         '</button>&nbsp;&nbsp;<button class="btnPay btn btn-success bt-' + row + '">' + 300 + '</button>' +
            //         '</button>&nbsp;&nbsp;<button class="btnPay btn btn-success bt-' + row + '">' + 400 + '</button>' +
            //         '</button>&nbsp;&nbsp;<button class="btnPay btn btn-success bt-' + row + '">' + 600 + '</button>' +
            //         '</button>&nbsp;&nbsp;<button class="btnPay btn btn-success bt-' + row + '">' + 800 + '</button>' +
            //         '</div>';
            // }

            if (col === 2) {
                td.innerHTML = '<u><a class="linkable cusRow" value="' + value + '">' + value + '</a></u>';
            }

            if (col === 7) {
                if (value === 2) {
                    td.innerHTML = '<button class="btnAction btn btn-success btAction-' + row + '" value="' + 5 + '">' + 'Chốt lãi' + '</button>';
                }
                else {
                    td.innerHTML = '<button class="btnAction btn btn-success btAction-' + row + '" value="' + 0 + '">' + 'Đáo' + '</button>&nbsp;&nbsp;' +
                        '<button class="btnAction btn btn-success btAction-' + row + '" value="' + 1 + '">' + 'Thu về' +
                        '<button class="btnAction btn btn-success btAction-' + row + '" value="' + 2 + '">' + 'Chốt' +
                        '</button>&nbsp;&nbsp;<button class="btnAction btn btn-success btAction-' + row + '" value="' + 3 + '">' + 'Bễ' + '</button>' +
                        '</button>&nbsp;&nbsp;<button class="btnAction btn btn-success btAction-' + row + '" value="' + 4 + '">' + 'Kết thúc' + '</button>';
                }
            }

            if (col === 8) {
                let statusName = "";
                switch (value) {
                    case 0:
                        statusName = "Lưu thông";
                        break;
                    case 1:
                        statusName = "Đáo";
                        break;
                    case 2:
                        statusName = "Lãi đứng";
                        break;
                    case 3:
                        statusName = "Thu về";
                        break;
                    case 4:
                        statusName = "Chốt";
                        break;
                    case 5:
                        statusName = "Bễ";
                        break;
                    case 6:
                        statusName = "Kết thúc";
                        break;

                }
                td.innerHTML = '<button class="btnStatus btn status-' + value + '" value="' + 0 + '">' + statusName + '</button>';
            }

        }

        function myBtnsRemove(instance, td, row, col, prop, value, cellProperties) {
            Handsontable.renderers.TextRenderer.apply(this, arguments);
            if (col === 7) {
                td.innerHTML = '';
            }
        }

        $scope.getData = function () {
            HdLuuThong
                .one('listByDate')
                .one('all')
                .getList("", $scope.filter)
                .then(function (resp) {
                    $scope.contracts = angular.copy(Restangular.stripRestangular(resp));
                });
        };

        $scope.convertToDate = function (stringDate) {
            let dateOut = new Date(stringDate);
            dateOut.setDate(dateOut.getDate());
            return dateOut;
        };

        $scope.saveCirculation = () => {
            let contracts = _.filter($scope.contracts, (item) => {
                return item.isActive || !item.customer;
            });

            HdLuuThong.one("contract").one("updateMany")
                .customPUT(contracts)
                .then((items) => {
                    // _.map($scope.contracts, function (x) {
                    //     x.isActive = false;
                    //     return x;
                    // });

                    // _.remove($scope.contracts, (item, index) => {
                    //     if (item.isActive)
                    //         $scope.checkedList.splice(index, 1);
                    //
                    //     return item.isActive;
                    // });

                    _.each($scope.checkedList, (rowValue) => {
                        $scope.contracts[rowValue].status = 1;
                        $scope.contracts[rowValue].isActive = false;
                    });


                    $scope.checkedList = [];
                    $scope.checkbox.checkAll = false;
                    toastr.success('Cập nhật thành công!');

                    // $state.reload();
                })
                .catch((error) => {
                    toastr.error('Cập nhật không thành công!');
                });
        };

        $timeout(function () {
            hotInstance = hotRegisterer.getInstance('my-handsontable');

            $scope.onAfterInit = function () {
                hotInstance.validateCells();
            };
        }, 0);

        $scope.getData();

        $scope.saveDaoModal = () => {
            if (!$scope.selectedCirculation.newLoanMoney
                || parseInt($scope.selectedCirculation.newLoanMoney) <= 0) {
                toastr.error("Số tiền vay không được <= 0");
                return;
            }

            ContractManager
                .one($scope.selectedCirculation.contractId)
                .one('circulationContract')
                .customPOST($scope.selectedCirculation)
                .then((contract) => {
                    toastr.success('Đáo hạn hợp đồng thành công!');

                    // _.map($scope.contracts, function (x) {
                    //     x.isActive = false;
                    //     return x;
                    // });

                    $scope.checkedList = [];
                    $scope.checkbox.checkAll = false;
                    $scope.selectedCirculation = {};
                    $('#hopDongDaoModal').modal('hide');

                    $scope.getData();
                })
                .catch((error) => {
                    console.log(error);
                    toastr.error("Đáo hạn hợp đồng thất bại!");
                });
        };

        $scope.saveThuVeModal = () => {
            ContractManager
                .one($scope.selectedCirculation.contractId)
                .one('changeStatus')
                .customPUT({status: CONTRACT_STATUS.COLLECT})
                .then((contract) => {
                    toastr.success('Thu về hợp đồng thành công!');

                    $scope.checkedList = [];
                    $scope.checkbox.checkAll = false;
                    $scope.selectedCirculation = {};
                    $('#hopDongThuVeModal').modal('hide');

                    $scope.getData();
                })
                .catch((error) => {
                    console.log(error);
                    toastr.error("Thu về hợp đồng thất bại!");
                });
        };

        $scope.saveChotModal = () => {
            ContractManager
                .one($scope.selectedCirculation.contractId)
                .one('changeStatus')
                .customPUT({status: CONTRACT_STATUS.CLOSE_DEAL})
                .then((contract) => {
                    toastr.success('Chốt hợp đồng thành công!');

                    $scope.checkedList = [];
                    $scope.checkbox.checkAll = false;
                    $scope.selectedCirculation = {};
                    $('#hopDongChotModal').modal('hide');

                    $scope.getData();
                })
                .catch((error) => {
                    console.log(error);
                    toastr.error("Chốt hợp đồng thất bại!");
                });
        };

        $scope.saveBeModal = () => {
            ContractManager
                .one($scope.selectedCirculation.contractId)
                .one('changeStatus')
                .customPUT({status: CONTRACT_STATUS.ESCAPE})
                .then((contract) => {
                    toastr.success('Thu về hợp đồng thành công!');

                    $scope.checkedList = [];
                    $scope.checkbox.checkAll = false;
                    $scope.selectedCirculation = {};
                    $('#hopDongBeModal').modal('hide');

                    $scope.getData();
                })
                .catch((error) => {
                    console.log(error);
                    toastr.error("Thu về hợp đồng thất bại!");
                });
        };

        $scope.saveKetThucModal = () => {
            ContractManager
                .one($scope.selectedCirculation.contractId)
                .one('changeStatus')
                .customPUT({status: CONTRACT_STATUS.END})
                .then((contract) => {
                    toastr.success('Kết thúc hợp đồng thành công!');

                    $scope.checkedList = [];
                    $scope.checkbox.checkAll = false;
                    $scope.selectedCirculation = {};

                    $scope.getData();
                })
                .catch((error) => {
                    console.log(error);
                    toastr.error("Kết thúc hợp đồng thất bại!");
                });
        };

    }
})();