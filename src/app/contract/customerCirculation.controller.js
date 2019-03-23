(function () {
    'use strict';

    angular.module('ati.contract')
        .controller('CustomerCirculationController', CustomerCirculationController)
    ;

    function CustomerCirculationController($scope, $timeout, hotRegisterer, CONTRACT_STATUS, ContractManager, moment, Restangular, HdLuuThong, CONTRACT_EVENT) {
        let hotInstance = "";
        $scope.formProcessing = false;
        $scope.filter = {
            date: "",
            status: "",
            storeId: $scope.$parent.storeSelected.storeId,
            userId: $scope.$parent.storeSelected.userId
        };
        $scope.selectedCirculation = {};
        // $('#lai-dung-dp').datepicker({startDate: new Date()});

        $scope.$on(CONTRACT_EVENT.RESIZE_TABLE, function (event, data) {
            hotInstance.render();
        });

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

        $scope.filterDateFormat = "";

        $scope.checkedList = [];
        $scope.checkbox = {checkAll: false};
        $scope.$watch('checkbox.checkAll', function (newValue, oldValue) {
            if (newValue !== oldValue) {
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
                $scope.filterDateFormat = moment(newValue, "YYYY-MM-DD").format("DD/MM/YYYY");
                $scope.getData();
            }
        });

        $scope.newLoanMoneyFunc = (money) => {
            $scope.selectedCirculation.totalMoney = parseInt(money) - parseInt($scope.selectedCirculation.moneyContractOld);
        };

        $scope.newActuallyCollectedMoneyFunc = function (money) {
            $scope.selectedCirculation.newDailyMoney = parseInt(money) / parseInt(!$scope.selectedCirculation.newLoanDate === 0 ? 1 : $scope.selectedCirculation.newLoanDate);
        };

        $scope.newLoanDateFunc = function () {
            $scope.selectedCirculation.newDailyMoney = parseInt($scope.selectedCirculation.newActuallyCollectedMoney) / parseInt($scope.selectedCirculation.newLoanDate);
        };

        if ($scope.$parent.isAccountant)
            $scope.filter.date = moment(new Date()).subtract(1, "days").format("YYYY-MM-DD");
        else
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
            wordWrap: false,
            fixedColumnsLeft: 3,
            manualColumnFreeze: true,
            cells: function (row, col) {
                let cellPrp = {};
                let item = $scope.contracts[row];
                if (typeof item === 'object' && (item.status > 0)) {
                    cellPrp.readOnly = true;
                    if (item.contractStatus === CONTRACT_STATUS.STAND) {
                        cellPrp.className = "handsontable-td-red";
                    }
                    // cellPrp.className = "handsontable-cell-disable";
                    switch (col) {
                        case 0:
                            cellPrp.type = "text";
                            cellPrp.renderer = myBtnsRemove;
                            break;

                        case 8:
                            cellPrp.renderer = myBtnsRemove;
                            break;

                        case 2:
                        case 3:
                        case 9:
                        case 10:
                            cellPrp.renderer = myBtns;
                            break;
                    }

                    return cellPrp;
                }

                switch (col) {
                    case 7:
                        if (typeof item === 'object' && item.contractStatus === CONTRACT_STATUS.COLLECT) {
                            cellPrp.readOnly = true;
                        }
                        else
                            cellPrp.className = "hot-normal";
                        break;
                    case 8:
                        if (typeof item === 'object' && item.status > 0) {
                            cellPrp.renderer = myBtnsRemove;
                        }
                        else {
                            cellPrp.renderer = myBtns;
                            cellPrp.readOnly = true;
                        }
                        break;
                    case 2:
                    case 3:
                    case 9:
                    case 10:
                        cellPrp.renderer = myBtns;
                        cellPrp.readOnly = true;
                        break;
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

                if (event.realTarget.className.indexOf('btnAction') >= 0 && $scope.$parent.storeSelected.userId) {
                    $scope.selectedCirculation = {};
                    let nowDate = moment($scope.filter.date, "YYYYMMDD");
                    $scope.selectedCirculation = angular.copy(Restangular.stripRestangular($scope.contracts[rowCol.row]));
                    let {actuallyCollectedMoney, totalMoneyPaid, moneyPaid} = $scope.selectedCirculation;

                    switch (parseInt(event.realTarget.value)) {
                        case 0:
                            $scope.selectedCirculation.totalMoney = 0;
                            $scope.selectedCirculation.newDailyMoney = 0;
                            // $scope.selectedCirculation.moneyContractOld = parseInt(actuallyCollectedMoney) - (parseInt(dailyMoney) * diffDays);
                            $scope.selectedCirculation.moneyContractOld = parseInt(actuallyCollectedMoney) - parseInt(totalMoneyPaid); // - parseInt(moneyPaid);
                            // let createdAt = moment(nowDate).add(1, "days");
                            $scope.selectedCirculation.createdAt = nowDate.format("YYYY-MM-DD");
                            $scope.selectedCirculation.contractDate = nowDate.format("DD/MM/YYYY");
                            $scope.selectedCirculation.totalMoney = -$scope.selectedCirculation.moneyContractOld;

                            $('#hopDongDaoModal').modal('show');

                            break;
                        case 1:
                            // nowDate = moment();
                            // let dateContract = moment($scope.selectedCirculation.createdAt, "YYYYMMDD");
                            // let diffDays = nowDate.diff(dateContract, 'days');
                            // let {actuallyCollectedMoney, dailyMoney} = $scope.selectedCirculation;

                            $scope.selectedCirculation.moneyContractOld = parseInt(actuallyCollectedMoney) - parseInt(totalMoneyPaid); // - parseInt(moneyPaid);
                            $scope.selectedCirculation.createdAt = moment($scope.selectedCirculation.createdAt).format("DD/MM/YYYY");

                            // $scope.selectedCirculation.newTransferDate = $scope.filterDateFormat;

                            $scope.selectedCirculation.newChotLoanDate = "";
                            $scope.selectedCirculation.newActuallyCollectedMoney = 0;

                            $scope.selectedCirculation.totalMoney = $scope.selectedCirculation.moneyContractOld;

                            $('#hopDongThuVeModal').modal('show');

                            break;
                        case 2:
                            // // nowDate = moment();
                            // $scope.selectedCirculation.moneyContractOld = parseInt(actuallyCollectedMoney) - parseInt(totalMoneyPaid); // - parseInt(moneyPaid);
                            // $scope.selectedCirculation.newTransferDate = $scope.filter.date;
                            // $scope.selectedCirculation.newChotLoanDate = "";
                            // $scope.selectedCirculation.newAppointmentDate = "";
                            // $scope.selectedCirculation.newPayMoney = 0;
                            // $scope.selectedCirculation.contractCreatedAt = moment($scope.selectedCirculation.contractCreatedAt).utc().format("DD/MM/YYYY");
                            // $('.datepicker-ui').val('');
                            //
                            // $scope.selectedCirculation.totalMoney = $scope.selectedCirculation.moneyContractOld;
                            // $('#hopDongChotModal').modal('show');

                            setTimeout(function () {
                                $scope.$apply();
                                $scope.showModalChot(actuallyCollectedMoney, totalMoneyPaid);
                            }, 1);


                            break;
                        case 3:
                            nowDate = moment();
                            $scope.selectedCirculation.moneyContractOld = parseInt(actuallyCollectedMoney) - parseInt(totalMoneyPaid); //- parseInt(moneyPaid);
                            $scope.selectedCirculation.createdAt = moment($scope.selectedCirculation.createdAt).format("DD/MM/YYYY");
                            $scope.selectedCirculation.contractCreatedAt = moment($scope.selectedCirculation.contractCreatedAt).utc().format("DD/MM/YYYY");
                            $scope.selectedCirculation.newBeLoanDate = nowDate.format("DD/MM/YYYY");
                            $scope.selectedCirculation.newAppointmentDate = "";
                            $scope.selectedCirculation.newPayMoney = 0;
                            $('.datepicker-ui').val('');

                            $scope.selectedCirculation.totalMoney = $scope.selectedCirculation.moneyContractOld;
                            $('#hopDongBeModal').modal('show');
                            break;

                        case 4:
                            $scope.saveKetThucModal();
                            break;

                        case 5:
                            nowDate = moment();
                            $scope.selectedCirculation.moneyContractOld = parseInt(actuallyCollectedMoney) - parseInt(totalMoneyPaid);
                            $scope.selectedCirculation.createdAt = moment($scope.selectedCirculation.createdAt).format("DD/MM/YYYY");
                            $scope.selectedCirculation.newPayMoney = 0;
                            $('.datepicker-ui').val('');

                            $scope.selectedCirculation.totalMoney = $scope.selectedCirculation.moneyContractOld;

                            $('#laiDungModal').modal('show');
                            break;
                    }

                    setTimeout(function () {
                        $scope.$apply();
                    }, 1);


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
                            if ($scope.checkedList.length === 0)
                                $scope.checkbox.checkAll = false;
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

        $scope.totalMoneyPaid = () => {
            let totalFee = 0;

            $scope.contracts.forEach(item => {
                if (item.status === 1)
                    totalFee += item.moneyPaid;
            });


            return totalFee;
        };

        $scope.showModalChot = (actuallyCollectedMoney, totalMoneyPaid) => {
            $scope.selectedCirculation.moneyContractOld = parseInt(actuallyCollectedMoney) - parseInt(totalMoneyPaid); // - parseInt(moneyPaid);
            $scope.selectedCirculation.newTransferDate = $scope.filter.date;
            $scope.selectedCirculation.newChotLoanDate = "";
            $scope.selectedCirculation.newAppointmentDate = "";
            $scope.selectedCirculation.newPayMoney = 0;
            $scope.selectedCirculation.contractCreatedAt = moment($scope.selectedCirculation.contractCreatedAt).utc().format("DD/MM/YYYY");
            $('.datepicker-ui').val('');

            $scope.selectedCirculation.totalMoney = $scope.selectedCirculation.moneyContractOld;

            $('#hopDongChotModal').modal('show');
        };

        function myBtns(instance, td, row, col, prop, value, cellProperties) {
            Handsontable.renderers.TextRenderer.apply(this, arguments);
            if (col === 2) {
                td.innerHTML = '<u><a class="linkable cusRow" value="' + value + '">' + value + '</a></u>';
            }

            if (col === 3) {
                if (value)
                    td.innerHTML = moment(value).format("DD/MM/YYYY");
                else
                    td.innerHTML = '';
            }

            if (col === 8) {
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

            if (col === 9) {
                let statusName = "";
                switch (value) {
                    case 0:
                        statusName = "Lưu thông";
                        break;
                    case 1:
                        statusName = "Đã đóng";
                        break;
                }
                td.innerHTML = '<div style="text-align: center;"><button class="btnStatus btn status-lt-' + value + '" value="' + 0 + '">' + statusName + '</button></div>';
            }

            if (col === 10) {
                let statusName = "";
                switch (value) {
                    case 0:
                        statusName = "Mới tạo";
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
                td.innerHTML = '<div style="text-align: center;"><button class="btnStatus btn status-' + value + '" value="' + 0 + '">' + statusName + '</button></div>';
            }

        }

        function myBtnsRemove(instance, td, row, col, prop, value, cellProperties) {
            Handsontable.renderers.TextRenderer.apply(this, arguments);
            if (col === 8 || col === 0) {
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
            if ($scope.formProcessing)
                return;

            $scope.formProcessing = true;

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

                    // _.each($scope.checkedList, (rowValue) => {
                    //     $scope.contracts[rowValue].status = 1;
                    //     $scope.contracts[rowValue].isActive = false;
                    // });
                    //
                    $scope.checkedList = [];
                    $scope.checkbox.checkAll = false;

                    $scope.getData();
                    toastr.success('Cập nhật thành công!');
                })
                .catch((error) => {
                    toastr.error('Cập nhật không thành công!');
                })
                .finally(() => {
                    $scope.formProcessing = false;
                });
        };

        $timeout(function () {
            hotInstance = hotRegisterer.getInstance('my-handsontable');

            $scope.onAfterInit = function () {
                hotInstance.validateCells();
            };

        }, 0);

        $scope.getData();

        $scope.saveLaiDungModal = () => {
            if ($scope.formProcessing)
                return;

            $scope.formProcessing = true;

            if (!$scope.selectedCirculation.newPayMoney
                || parseInt($scope.selectedCirculation.newPayMoney) <= 0) {
                toastr.error("Số tiền đóng không được <= 0");
                return;
            }

            // if (!$scope.selectedCirculation.newAppointmentDate) {
            //     toastr.error("Chưa chọn ngày hẹn!");
            //     return;
            // }

            delete $scope.selectedCirculation.moneyHavePay;
            delete $scope.selectedCirculation.moneyPaid;

            HdLuuThong
                .one($scope.selectedCirculation.contractId)
                .one('updateLaiDung')
                .customPUT($scope.selectedCirculation)
                .then((contract) => {
                    toastr.success('Chốt lãi hợp đồng thành công!');

                    $scope.selectedCirculation = {};
                    $('#laiDungModal').modal('hide');
                    $scope.getData();
                })
                .catch((error) => {
                    console.log(error);
                    toastr.error("Chốt lãi hợp đồng thất bại!");
                })
                .finally(() => {
                    $scope.formProcessing = false;
                });
        };

        $scope.saveDaoModal = () => {
            if ($scope.formProcessing)
                return;

            $scope.formProcessing = true;

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
                })
                .finally(() => {
                    $scope.formProcessing = false;
                });
        };

        $scope.saveThuVeModal = () => {
            if ($scope.formProcessing)
                return;

            $scope.formProcessing = true;

            $scope.selectedCirculation.statusContract = CONTRACT_STATUS.COLLECT;
            $scope.selectedCirculation.moneyPaid = $scope.selectedCirculation.newActuallyCollectedMoney;
            $scope.selectedCirculation.newTransferDate = $scope.filterDateFormat;

            HdLuuThong
                .one($scope.selectedCirculation.contractId)
                .one('updateThuve')
                .customPUT($scope.selectedCirculation)
                .then((contract) => {
                    toastr.success('Chuyển hợp đồng Thu Về thành công!');

                    $scope.checkedList = [];
                    $scope.checkbox.checkAll = false;
                    $scope.selectedCirculation = {};
                    $('#hopDongThuVeModal').modal('hide');

                    $scope.getData();
                })
                .catch((error) => {
                    console.log(error);
                    toastr.error("Chuyển hợp đồng Thu Về thất bại!");
                })
                .finally(() => {
                    $scope.formProcessing = false;
                });
        };

        $scope.saveChotModal = () => {
            if ($scope.formProcessing)
                return;

            $scope.formProcessing = true;

            $scope.selectedCirculation.statusContract = CONTRACT_STATUS.CLOSE_DEAL;
            $scope.selectedCirculation.newTransferDate = moment($scope.selectedCirculation.newTransferDate).format("DD/MM/YYYY");
            $scope.selectedCirculation.newAppointmentDate = moment($scope.selectedCirculation.newAppointmentDate).format("DD/MM/YYYY");
            $scope.selectedCirculation.moneyHavePay = $scope.selectedCirculation.moneyPaid = $scope.selectedCirculation.newPayMoney;

            HdLuuThong
                .one($scope.selectedCirculation.contractId)
                .one('updateChot')
                .customPUT($scope.selectedCirculation)
                .then((contract) => {
                    toastr.success('Chuyển hợp đồng Chốt thành công!');

                    $scope.selectedCirculation = {};
                    $('#hopDongChotModal').modal('hide');

                    $scope.getData();
                })
                .catch((error) => {
                    console.log(error);
                    toastr.error("Chuyển hợp đồng Chốt thất bại!");
                })
                .finally(() => {
                    $scope.formProcessing = false;
                });
        };

        $scope.saveBeModal = () => {
            if ($scope.formProcessing)
                return;

            $scope.formProcessing = true;

            $scope.selectedCirculation.statusContract = CONTRACT_STATUS.ESCAPE;
            $scope.selectedCirculation.newAppointmentDate = moment($scope.selectedCirculation.newAppointmentDate).format("DD/MM/YYYY");
            $scope.selectedCirculation.moneyHavePay = $scope.selectedCirculation.moneyPaid = $scope.selectedCirculation.newPayMoney;

            HdLuuThong
                .one($scope.selectedCirculation.contractId)
                .one('updateBe')
                .customPUT($scope.selectedCirculation)
                .then((contract) => {
                    toastr.success('Chuyển hợp đồng Bễ thành công!');

                    $scope.selectedCirculation = {};
                    $('#hopDongBeModal').modal('hide');

                    $scope.getData();
                })
                .catch((error) => {
                    console.log(error);
                    toastr.error("Chuyển hợp đồng Bễ thất bại!");
                })
                .finally(() => {
                    $scope.formProcessing = false;
                });
        };

        $scope.saveKetThucModal = () => {
            if ($scope.formProcessing)
                return;

            swal({
                title: 'Bạn có chắc chắn muốn kết thúc hợp đồng này ?',
                text: "",
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Có',
                cancelButtonText: 'Không',
            }).then((result) => {
                if (result.value) {

                    $scope.formProcessing = true;
                    ContractManager
                        .one($scope.selectedCirculation.contractId)
                        .one('changeStatus')
                        .customPUT({status: CONTRACT_STATUS.END, luuThongId: $scope.selectedCirculation._id})
                        .then((contract) => {
                            toastr.success('Chuyển hợp đồng Kết Thúc thành công!');

                            $scope.checkedList = [];
                            $scope.checkbox.checkAll = false;
                            $scope.selectedCirculation = {};

                            $scope.getData();
                        })
                        .catch((error) => {
                            console.log(error);
                            toastr.error("Chuyển hợp đồng Kết Thúc thất bại!");
                        })
                        .finally(() => {
                            $scope.formProcessing = false;
                        });
                }
            });

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


    }
})();