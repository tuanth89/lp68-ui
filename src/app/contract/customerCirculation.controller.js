(function () {
    'use strict';

    angular.module('ati.contract')
        .controller('CustomerCirculationVer2Controller', CustomerCirculationVer2Controller)
    ;

    function CustomerCirculationVer2Controller($scope, $rootScope, $state, $stateParams, $timeout, CONTRACT_STATUS, ContractManager, moment, Restangular, HdLuuThongManager, CONTRACT_EVENT) {
        $scope.formProcessing = false;
        $scope.filter = {
            date: "",
            status: "",
            storeId: $scope.$parent.storeSelected.storeId,
            userId: $scope.$parent.storeSelected.userId,
        };
        let STATE_NAME = "app.root.contract.cusCirculation";

        $scope.contracts = [];

        $scope.selectedCirculation = {};
        // $('#lai-dung-dp').datepicker({startDate: new Date()});

        $scope.formTableProcessing = false;

        let container = document.getElementById('hotCirculationTable');
        // let containerId = $("#hotCirculationTable");
        const hotTableInstance = new Handsontable(container, {
            data: $scope.contracts,
            columns: [
                {
                    data: 'isActive',
                    type: 'checkbox',
                    checkedTemplate: 'true',
                    uncheckedTemplate: 'false',
                    width: 60
                },
                {
                    data: 'customer.name',
                    type: 'text',
                    width: 150,
                    readOnly: true
                },
                {
                    data: 'contractCreatedAt',
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
                    data: 'totalHavePay',
                    type: 'numeric',
                    numericFormat: {
                        pattern: '#,###'
                    },
                    width: 100,
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
                    data: 'moneyPaid',
                    type: 'numeric',
                    numericFormat: {
                        pattern: '#,###'
                    },
                    width: 120
                },
                {
                    data: 'contractStatus',
                    type: 'text',
                    width: 250,
                    readOnly: true
                },
                {
                    data: 'contractNo',
                    type: 'text',
                    width: 150,
                    readOnly: true
                },
                // {
                //     data: 'status',
                //     type: 'text',
                //     width: 80,
                //     readOnly: true
                // },
                // {
                //     data: 'contractStatus',
                //     type: 'text',
                //     width: 80,
                //     readOnly: true
                // }
            ],
            stretchH: 'all',
            copyPaste: false,
            autoWrapRow: true,
            rowHeaders: true,
            // wordWrap: false,
            // preventOverflow: 'horizontal',
            fixedColumnsLeft: 4,
            // manualColumnFreeze: true,
            viewportColumnRenderingOffset: 100,
            viewportRowRenderingOffset: 100,
            rowHeights: 35,
            licenseKey: 'non-commercial-and-evaluation',
            colHeaders: [
                ' ',
                'Họ và tên',
                'Ngày vay',
                'Gói vay',
                'Thực thu',
                'Dư nợ',
                'Đã đóng',
                'Đóng trong ngày',
                'Thao tác',
                'Số hợp đồng'
                // 'Trạng thái',
                // 'Hợp đồng'
            ],
            // colHeaders: function (col) {
            //     switch (col) {
            //         case 0:
            //             let txt = "<input type='checkbox' class='checker' ";
            //             txt += isChecked() ? 'checked="checked"' : '';
            //             txt += "> ";
            //             return txt;
            //         case 1:
            //             return "Họ và tên";
            //         case 2:
            //             return "Ngày vay";
            //         case 3:
            //             return "Gói vay";
            //         case 4:
            //             return "Thực thu";
            //         case 5:
            //             return "Dư nợ";
            //         case 6:
            //             return "Đã đóng";
            //         case 7:
            //             return "Đóng trong ngày";
            //         case 8:
            //             return "Thao tác";
            //         case 9:
            //             return "Số hợp đồng";
            //
            //     }
            // },
            cells: function (row, col) {
                let cellPrp = {};
                let item = $scope.contracts[row];
                if (typeof item === 'object' && (item.status > 0)) {
                    cellPrp.className = "handsontable-cell-disable";
                    cellPrp.readOnly = true;

                    if (item.contractStatus === CONTRACT_STATUS.STAND) {
                        cellPrp.className += " handsontable-td-red";
                    } else {
                        cellPrp.className += " handsontable-td-black";
                    }

                    switch (col) {
                        case 0:
                            cellPrp.type = "text";
                            cellPrp.renderer = myBtnsRemove;
                            break;
                        case 8:
                            if (item.contractStatus !== CONTRACT_STATUS.STAND && item.contractStatus !== CONTRACT_STATUS.END)
                                cellPrp.renderer = btnThuVeChotBe;
                            else
                                cellPrp.renderer = myBtnsRemove;
                            break;
                        case 1:
                        case 2:
                            // case 10:
                            // case 11:
                            cellPrp.renderer = myBtns;
                            break;
                    }

                    return cellPrp;
                }

                cellPrp.className = "hot-normal";

                switch (col) {
                    case 0:
                        if (typeof item === 'object'
                            && (item.contractStatus === CONTRACT_STATUS.COLLECT ||
                                item.contractStatus === CONTRACT_STATUS.CLOSE_DEAL || item.contractStatus === CONTRACT_STATUS.ESCAPE)) {
                            cellPrp.readOnly = true;
                            // cellPrp.renderer = myBtnsRemove;
                            cellPrp.renderer = myBtns;
                        }
                        break;
                    // case 8:
                    //     if (typeof item === 'object'
                    //         && (item.contractStatus === CONTRACT_STATUS.COLLECT ||
                    //             item.contractStatus === CONTRACT_STATUS.CLOSE_DEAL || item.contractStatus === CONTRACT_STATUS.ESCAPE)) {
                    //         cellPrp.readOnly = true;
                    //     } else
                    //         cellPrp.className = "hot-normal";
                    //
                    //     break;
                    case 8:
                        if (typeof item === 'object' && item.status > 0) {
                            cellPrp.renderer = myBtnsRemove;
                        } else {
                            cellPrp.renderer = myBtns;
                            cellPrp.readOnly = true;
                        }
                        break;
                    case 1:
                    case 2:
                        // case 10:
                        // case 11:
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
                            $scope.selectedCirculation.moneyPayOld = 0;
                            $scope.selectedCirculation.newLoanMoney = 0;
                            $scope.selectedCirculation.newActuallyCollectedMoney = 0;
                            $scope.selectedCirculation.moneyPayNew = 0;
                            $scope.selectedCirculation.moneyContractOld = parseInt(actuallyCollectedMoney) - parseInt(totalMoneyPaid); // - parseInt(moneyPaid);
                            // $scope.selectedCirculation.moneyContractOld = parseInt(actuallyCollectedMoney) - (parseInt(dailyMoney) * diffDays);
                            // let createdAt = moment(nowDate).add(1, "days");

                            $scope.selectedCirculation.createdAt = nowDate.format("YYYY-MM-DD");
                            $scope.selectedCirculation.contractDate = nowDate.format("DD/MM/YYYY");
                            $scope.selectedCirculation.totalMoney = -$scope.selectedCirculation.moneyContractOld;

                            $('#hopDongDaoModal').modal('show');

                            break;
                        case 1:
                            setTimeout(function () {
                                $scope.$apply();
                                $scope.showModalThuVe(actuallyCollectedMoney, totalMoneyPaid);
                            }, 1);

                            break;
                        case 2:
                            setTimeout(function () {
                                $scope.$apply();
                                $scope.showModalChot(actuallyCollectedMoney, totalMoneyPaid);
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

                        case 5:
                            nowDate = moment();
                            $scope.selectedCirculation.moneyContractOld = parseInt(actuallyCollectedMoney) - parseInt(totalMoneyPaid);
                            $scope.selectedCirculation.createdAt = moment($scope.selectedCirculation.createdAt).format("DD/MM/YYYY");
                            $scope.selectedCirculation.newPayMoney = 0;
                            $scope.selectedCirculation.payMoneyOriginal = 0;
                            $('.datepicker-ui').val('');

                            $scope.selectedCirculation.totalMoney = $scope.selectedCirculation.moneyContractOld;

                            $('#laiDungModal').modal('show');
                            break;

                        case 6:
                            $scope.selectedCirculation.moneyContractOld = parseInt(actuallyCollectedMoney) - parseInt(totalMoneyPaid);
                            $scope.selectedCirculation.contractCreatedAt = moment($scope.selectedCirculation.contractCreatedAt).utc().format("DD/MM/YYYY");
                            $scope.selectedCirculation.newPayMoney = 0;
                            $scope.selectedCirculation.numOfDayPaid = 0;
                            $scope.selectedCirculation.totalMoney = $scope.selectedCirculation.moneyContractOld;

                            $('#dongNhieuNgayModal').modal('show');
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
                        let moneyDraft = parseInt($scope.contracts[rowChecked].moneyPaid) || 0;

                        if (checkedIndex >= 0) {
                            // $scope.totalMoneyPayDraft -= moneyDraft;
                            $scope.totalMoneyPayDraft = Math.max(0, $scope.totalMoneyPayDraft - moneyDraft);

                            $scope.checkedList.splice(checkedIndex, 1);
                            // if ($scope.checkedList.length === 0)
                            //     $scope.checkbox.checkAll = false;
                        } else {
                            $scope.checkedList.push(rowChecked);
                            $scope.totalMoneyPayDraft += moneyDraft;
                        }

                        setTimeout(function () {
                            $scope.$apply();
                        }, 1);

                        // hotTableInstance.render();
                        // console.log('row: ' + source[0][0]);
                        // console.log('col: ' + source[0][1]);
                        // console.log('old value: ' + source[0][2]);
                        // console.log('new value: ' + source[0][3]);
                    }
                }
            },
            beforeChange: function (changes) {
                if (changes[0][1] === "moneyPaid") {
                    changes[0][3] = numbro.unformat(changes[0][3]);
                }
            }
        });

        // containerId.on('mouseup', 'input.checker', function (event) {
        //     let current = !$('input.checker').is(':checked'); //returns boolean
        //     $scope.totalMoneyPayDraft = 0;
        //     $scope.checkedList = [];
        //     for (let index = 0; index < $scope.contracts.length; index++) {
        //         $scope.contracts[index].isActive = current;
        //         $scope.checkedList.push(index);
        //
        //         let moneyDraft = parseInt($scope.contracts[index].moneyPaid) || 0;
        //         if (current)
        //             $scope.totalMoneyPayDraft += moneyDraft;
        //         else
        //             $scope.totalMoneyPayDraft = Math.max(0, $scope.totalMoneyPayDraft - moneyDraft);
        //     }
        //
        //     setTimeout(function () {
        //         $scope.$apply();
        //     }, 1);
        //
        //     hotTableInstance.render();
        // });

        function isChecked() {
            // let itemHasActive = _.find($scope.contracts, {isActive: false});
            // return itemHasActive ? false : true;
            for (let i = 0, ilen = $scope.contracts.length; i < ilen; i++) {
                if (!$scope.contracts[i].isActive) {
                    return false;
                }
            }
            return true;
        }

        $scope.$on(CONTRACT_EVENT.RESIZE_TABLE, function (event, data) {
            setTimeout(function () {
                hotTableInstance.render();
            }, 1);

        });

        // $scope.status = [
        //     {
        //         value: -1,
        //         title: "Tất cả"
        //     },
        //     {
        //         value: 0,
        //         title: "Lưu thông"
        //     },
        //     {
        //         value: 1,
        //         title: "Đáo"
        //     },
        //     {
        //         value: 2,
        //         title: "Lãi đứng"
        //     },
        //     {
        //         value: 3,
        //         title: "Thu về"
        //     },
        //     {
        //         value: 4,
        //         title: "Chốt"
        //     },
        //     {
        //         value: 5,
        //         title: "Bễ"
        //     },
        //     {
        //         value: 6,
        //         title: "Kết thúc"
        //     }
        // ];
        // $scope.filterDateFormat = "";

        $scope.pagination = {
            page: $stateParams.p ? parseInt($stateParams.p) : 1,
            per_page: 30,
            totalItems: 0,
            totalByPages: 0
        };

        $scope.checkedList = [];
        // $scope.checkbox = {checkAll: false};
        // $scope.$watch('checkbox.checkAll', function (newValue, oldValue) {
        //     if (newValue !== oldValue) {
        //         _.map($scope.contracts, function (x, index) {
        //             if (x.status === 0) {
        //                 x.isActive = newValue;
        //
        //                 let checkedIndex = $scope.checkedList.indexOf(index);
        //                 if (checkedIndex >= 0) {
        //                     $scope.checkedList.splice(checkedIndex, 1);
        //                 } else
        //                     $scope.checkedList.push(index);
        //             }
        //
        //             return x;
        //         });
        //
        //         if (newValue) {
        //             hotTableInstance.selectCell(0, 0, hotTableInstance.countRows() - 1, hotTableInstance.countCols() - 1);
        //         } else {
        //             hotTableInstance.selectCell(0, 0, 0, 0, true);
        //         }
        //     }
        // });

        // $scope.$watch('filter.status', function (newValue, oldValue) {
        //     if (newValue != oldValue) {
        //         $scope.getData();
        //     }
        // });

        $scope.$watch('filter.date', function (newValue, oldValue) {
            if (newValue != oldValue) {
                // $scope.filterDateFormat = moment(newValue, "YYYY-MM-DD").format("DD/MM/YYYY");
                $scope.getData();
            }
        });

        $scope.$on('$viewContentLoaded', function (event, data) {
            $scope.getData($scope.pagination.page, $scope.pagination.per_page);
        });

        $scope.numOfDayPaidFunc = (money) => {
            $scope.selectedCirculation.numOfDayPaid = Math.trunc(parseInt(money) / ($scope.selectedCirculation.dailyMoneyPay === 0 ? parseInt(money) : $scope.selectedCirculation.dailyMoneyPay));
        };

        $scope.newLoanMoneyFunc = (money) => {
            $scope.selectedCirculation.totalMoney = parseInt(money) - (parseInt($scope.selectedCirculation.moneyContractOld) - parseInt($scope.selectedCirculation.moneyPayOld));
        };

        $scope.newActuallyCollectedMoneyFunc = function (money) {
            $scope.selectedCirculation.newDailyMoney = parseInt(money) / parseInt(!$scope.selectedCirculation.newLoanDate === 0 ? 1 : $scope.selectedCirculation.newLoanDate);
        };

        $scope.newLoanDateFunc = function () {
            $scope.selectedCirculation.newDailyMoney = parseInt($scope.selectedCirculation.newActuallyCollectedMoney) / parseInt($scope.selectedCirculation.newLoanDate);
        };

        $scope.moneyPayOldDaoFunc = function (money) {
            $scope.selectedCirculation.totalMoney = parseInt($scope.selectedCirculation.newLoanMoney) - (parseInt($scope.selectedCirculation.moneyContractOld) - parseInt(money));
        };

        if ($scope.$parent.isAccountant)
            $scope.filter.date = moment(new Date()).subtract(1, "days").format("YYYY-MM-DD");
        else
            $scope.filter.date = moment(new Date()).format("YYYY-MM-DD");

        $scope.contracts = [];
        $scope.rowHeaders = true;
        $scope.colHeaders = true;

        $scope.totalMoneyPaid = 0;
        $scope.totalMoneyPayDraft = 0;

        $scope.showModalThuVe = (actuallyCollectedMoney, totalMoneyPaid) => {
            // let nowDate = moment($scope.filter.date, "YYYYMMDD");

            $scope.selectedCirculation.moneyContractOld = parseInt(actuallyCollectedMoney) - parseInt(totalMoneyPaid); // - parseInt(moneyPaid);
            $scope.selectedCirculation.createdAt = moment($scope.selectedCirculation.createdAt).format("DD/MM/YYYY");
            $scope.selectedCirculation.newPayMoney = 0;
            $scope.selectedCirculation.payMoneyOriginal = 0;
            $scope.selectedCirculation.totalMoney = $scope.selectedCirculation.moneyContractOld;
            $scope.selectedCirculation.contractCreatedAt = moment($scope.selectedCirculation.contractCreatedAt).utc().format("DD/MM/YYYY");
            $scope.selectedCirculation.newTransferDate = $scope.filter.date;

            $('#hopDongThuVeModal').modal('show');
        };

        $scope.showModalChot = (actuallyCollectedMoney, totalMoneyPaid) => {
            $scope.selectedCirculation.moneyContractOld = parseInt(actuallyCollectedMoney) - parseInt(totalMoneyPaid); // - parseInt(moneyPaid);
            $scope.selectedCirculation.newTransferDate = $scope.filter.date;
            $scope.selectedCirculation.newAppointmentDate = "";
            $scope.selectedCirculation.newPayMoney = 0;
            $scope.selectedCirculation.payMoneyOriginal = 0;
            $scope.selectedCirculation.contractCreatedAt = moment($scope.selectedCirculation.contractCreatedAt).utc().format("DD/MM/YYYY");
            $('.datepicker-ui').val('');

            $scope.selectedCirculation.totalMoney = $scope.selectedCirculation.moneyContractOld;

            $('#hopDongChotModal').modal('show');
        };

        $scope.showModalBe = (actuallyCollectedMoney, totalMoneyPaid) => {
            let nowDate = moment();
            $scope.selectedCirculation.moneyContractOld = parseInt(actuallyCollectedMoney) - parseInt(totalMoneyPaid); //- parseInt(moneyPaid);
            $scope.selectedCirculation.createdAt = moment($scope.selectedCirculation.createdAt).format("DD/MM/YYYY");
            $scope.selectedCirculation.contractCreatedAt = moment($scope.selectedCirculation.contractCreatedAt).utc().format("DD/MM/YYYY");
            $scope.selectedCirculation.newBeLoanDate = nowDate.format("DD/MM/YYYY");
            $scope.selectedCirculation.newTransferDate = $scope.filter.date;
            $scope.selectedCirculation.newAppointmentDate = "";
            $scope.selectedCirculation.newPayMoney = 0;
            $scope.selectedCirculation.payMoneyOriginal = 0;
            $('.datepicker-ui').val('');

            $scope.selectedCirculation.totalMoney = $scope.selectedCirculation.moneyContractOld;
            $('#hopDongBeModal').modal('show');
        };

        $scope.showModalKetThuc = (actuallyCollectedMoney, totalMoneyPaid) => {
            $scope.selectedCirculation.moneyContractOld = parseInt(actuallyCollectedMoney) - parseInt(totalMoneyPaid); // - parseInt(moneyPaid);
            $scope.selectedCirculation.newTransferDate = $scope.filter.date;
            $scope.selectedCirculation.payMoneyOriginal = 0;
            $scope.selectedCirculation.contractCreatedAt = moment($scope.selectedCirculation.contractCreatedAt).utc().format("DD/MM/YYYY");
            $('.datepicker-ui').val('');

            $scope.selectedCirculation.totalMoney = $scope.selectedCirculation.moneyContractOld;

            $('#ketThucModal').modal('show');
        };

        function myBtns(instance, td, row, col, prop, value, cellProperties) {
            Handsontable.renderers.TextRenderer.apply(this, arguments);
            if (cellProperties.prop === "customer.name") {
                td.innerHTML = '<u><a class="linkable cusRow value="' + value + '">' + value + '</a></u>';
            }

            if (cellProperties.prop === "contractCreatedAt") {
                if (value)
                    td.innerHTML = moment(value).format("DD/MM/YYYY");
                else
                    td.innerHTML = '';
            }


            if (cellProperties.prop === "contractStatus" && col === 8) {
                if ($scope.$parent.storeSelected.userId) {
                    switch (value) {
                        case 2:
                            td.innerHTML = '<button class="btnAction btn btn-success btAction-' + row + '" value="' + 5 + '">' + 'Chốt lãi' + '</button>';
                            break;
                        case 0:
                            td.innerHTML = '<button class="btnAction btn btn-success btAction-' + 0 + '" value="' + 0 + '">' + 'Đáo' + '</button>&nbsp;&nbsp;' +
                                '<button class="btnAction btn btn-success btAction-' + 1 + '" value="' + 1 + '">' + 'Thu về' + '</button>&nbsp;&nbsp;' +
                                '<button class="btnAction btn btn-success btAction-' + 2 + '" value="' + 2 + '">' + 'Chốt' + '</button>&nbsp;&nbsp;' +
                                '<button class="btnAction btn btn-success btAction-' + 3 + '" value="' + 3 + '">' + 'Bễ' + '</button>&nbsp;&nbsp;' +
                                '<button class="btnAction btn btn-success btAction-' + 4 + '" value="' + 4 + '">' + 'Kết thúc' + '</button>&nbsp;&nbsp;' +
                                '<button class="btnAction btn btn-success btAction-' + 6 + '" value="' + 6 + '">' + 'Đóng trước' + '</button>';
                            break;
                        default:
                            td.innerHTML = '';
                            break;
                    }
                } else
                    td.innerHTML = '';
            }


            // if (cellProperties.prop === "status") {
            //     let statusName = "";
            //     switch (value) {
            //         case 0:
            //             statusName = "Lưu thông";
            //             break;
            //         case 1:
            //             statusName = "Đã đóng";
            //             break;
            //     }
            //     td.innerHTML = '<div style="text-align: center;"><button class="btnStatus btn status-lt-' + value + '" value="' + 0 + '">' + statusName + '</button></div>';
            // }

            // if (cellProperties.prop === "contractStatus" && col === 11) {
            //     let statusName = "";
            //     switch (value) {
            //         case 0:
            //             statusName = "Mới";
            //             break;
            //         case 1:
            //             statusName = "Đáo";
            //             break;
            //         case 2:
            //             statusName = "Lãi đứng";
            //             break;
            //         case 3:
            //             statusName = "Thu về";
            //             break;
            //         case 4:
            //             statusName = "Chốt";
            //             break;
            //         case 5:
            //             statusName = "Bễ";
            //             break;
            //         case 6:
            //             statusName = "Kết thúc";
            //             break;
            //         case 8:
            //             statusName = "Hết họ";
            //             break;
            //
            //     }
            //     td.innerHTML = '<div style="text-align: center;"><button class="btnStatus btn status-' + value + '" value="' + 0 + '">' + statusName + '</button></div>';
            // }

        }

        function btnThuVeChotBe(instance, td, row, col, prop, value, cellProperties) {
            Handsontable.renderers.TextRenderer.apply(this, arguments);

            if ($scope.$parent.storeSelected.userId) {
                switch (value) {
                    case CONTRACT_STATUS.STAND:
                        td.innerHTML = '<button class="btnAction btn btn-success btAction-' + 5 + '" value="' + 5 + '">' + 'Chốt lãi' + '</button>';
                        break;
                    case CONTRACT_STATUS.COLLECT:
                        td.innerHTML = '<button class="btnAction btn btn-success btAction-' + 2 + '" value="' + 2 + '">' + 'Chốt' +
                            '</button>&nbsp;&nbsp;<button class="btnAction btn btn-success btAction-' + 3 + '" value="' + 3 + '">' + 'Bễ' + '</button>&nbsp;&nbsp;' +
                            '<button class="btnAction btn btn-success btAction-' + 4 + '" value="' + 4 + '">' + 'Kết thúc' + '</button>';
                        break;
                    case CONTRACT_STATUS.CLOSE_DEAL:
                        td.innerHTML = '<button class="btnAction btn btn-success btAction-' + 1 + '" value="' + 1 + '">' + 'Thu về' + '</button>&nbsp;&nbsp;' +
                            '</button>&nbsp;&nbsp;<button class="btnAction btn btn-success btAction-' + 3 + '" value="' + 3 + '">' + 'Bễ' + '</button>&nbsp;&nbsp;' +
                            '<button class="btnAction btn btn-success btAction-' + 4 + '" value="' + 4 + '">' + 'Kết thúc' + '</button>';
                        break;
                    case CONTRACT_STATUS.ESCAPE:
                        td.innerHTML = '<button class="btnAction btn btn-success btAction-' + row + '" value="' + 1 + '">' + 'Thu về' + '</button>&nbsp;&nbsp;' +
                            '<button class="btnAction btn btn-success btAction-' + 2 + '" value="' + 2 + '">' + 'Chốt' + '</button>&nbsp;&nbsp;' +
                            '<button class="btnAction btn btn-success btAction-' + 4 + '" value="' + 4 + '">' + 'Kết thúc' + '</button>';
                        break;
                    case CONTRACT_STATUS.END:
                        td.innerHTML = '';
                        break;
                    default:
                        td.innerHTML = '<button class="btnAction btn btn-success btAction-' + 1 + '" value="' + 1 + '">' + 'Thu về' + '</button>&nbsp;&nbsp;' +
                            '<button class="btnAction btn btn-success btAction-' + 2 + '" value="' + 2 + '">' + 'Chốt' +
                            '</button>&nbsp;&nbsp;<button class="btnAction btn btn-success btAction-' + 3 + '" value="' + 3 + '">' + 'Bễ' + '</button>&nbsp;&nbsp;' +
                            '<button class="btnAction btn btn-success btAction-' + 4 + '" value="' + 4 + '">' + 'Kết thúc' + '</button>&nbsp;&nbsp;' +
                            '<button class="btnAction btn btn-success btAction-' + 6 + '" value="' + 6 + '">' + 'Đóng trước' + '</button>';
                        break;
                }

                // td.innerHTML += '&nbsp;&nbsp;<button class="btnAction btn btn-success btAction-' + 6 + '" value="' + 6 + '">' + 'Đóng trước' + '</button>';
            } else
                td.innerHTML = '';
        }

        function myBtnsRemove(instance, td, row, col, prop, value, cellProperties) {
            Handsontable.renderers.TextRenderer.apply(this, arguments);
            if (cellProperties.prop === "contractStatus" || cellProperties.prop === "isActive") {
                td.innerHTML = '';
            }
        }

        $scope.convertToDate = function (stringDate) {
            let dateOut = new Date(stringDate);
            dateOut.setDate(dateOut.getDate());
            return dateOut;
        };

        $scope.pageChanged = function () {
            $scope.goToGetData();
        };

        $scope.goToGetData = () => {
            let currentPage = $scope.pagination.page;
            let per_page = $scope.pagination.per_page;

            $state.go(STATE_NAME, {
                // date: $scope.filter.date,
                p: currentPage === 1 ? null : currentPage
            }, {notify: false});

            document.documentElement.scrollTop = 0;

            $scope.getData(currentPage, per_page);
        };

        $scope.getData = function (page, per_page) {
            // $scope.$broadcast(CONTRACT_EVENT.BLOCKING_UI, {isShow: true});

            $scope.filter.page = page;
            $scope.filter.per_page = per_page;
            $scope.formTableProcessing = true;

            HdLuuThongManager
                .one('listByDate')
                .customGET("all", $scope.filter)
                .then(function (resp) {
                    if (resp) {
                        let data = resp.plain();
                        $scope.contracts = angular.copy(data.docs);
                        $scope.pagination.totalItems = data.totalItems;
                        $scope.totalMoneyPaid = data.totalMoneyStatusEnd;

                        let totalContract = $scope.contracts.length;

                        if ($scope.filter.page > 1) {
                            $scope.pagination.totalByPages = (($scope.filter.page - 1) * $scope.filter.per_page) + totalContract;
                        } else {
                            $scope.pagination.totalByPages = totalContract;
                        }
                    } else {
                        $scope.contracts = [];
                        $scope.pagination.totalItems = 0;
                        $scope.pagination.totalByPages = 0;
                        $scope.totalMoneyPaid = 0;
                    }

                    // hotTableInstance.render();
                    hotTableInstance.updateSettings({
                        data: $scope.contracts
                    });

                    hotTableInstance.render();

                })
                .finally(() => {
                    $scope.formTableProcessing = false;
                    // $scope.$broadcast(CONTRACT_EVENT.BLOCKING_UI, {isShow: false});
                });
        };

        $timeout(function () {
            // let plugin = hotTableInstance.getPlugin('ManualColumnFreeze');
            // plugin.freezeColumn(1);
            // plugin.freezeColumn(2);
            // plugin.freezeColumn(3);
            //
            // hotTableInstance.render();

            Inputmask({}).mask(document.querySelectorAll(".datemask"));
        }, 0);

        $scope.saveCirculation = () => {
            if ($scope.formProcessing)
                return;

            $scope.formProcessing = true;

            let contracts = _.filter($scope.contracts, (item) => {
                return item.isActive || !item.customer;
            });

            HdLuuThongManager
                .one("contract")
                .one("updateMany")
                .customPUT(contracts)
                .then((items) => {
                    $scope.checkedList = [];
                    // $scope.checkbox.checkAll = false;

                    $scope.goToGetData();

                    toastr.success('Cập nhật thành công!');
                })
                .catch((error) => {
                    toastr.error("Có lỗi xảy ra! Hãy thử lại");
                })
                .finally(() => {
                    $scope.formProcessing = false;
                });
        };

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

            HdLuuThongManager
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
                    toastr.error("Có lỗi xảy ra! Hãy thử lại");
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
                    // $scope.checkbox.checkAll = false;
                    $scope.selectedCirculation = {};
                    $('#hopDongDaoModal').modal('hide');

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

        $scope.saveThuVeModal = () => {
            if ($scope.formProcessing)
                return;

            $scope.formProcessing = true;

            $scope.selectedCirculation.statusContract = CONTRACT_STATUS.COLLECT;
            $scope.selectedCirculation.moneyPaid = $scope.selectedCirculation.newActuallyCollectedMoney;

            HdLuuThongManager
                .one($scope.selectedCirculation.contractId)
                .one('transferType')
                .customPUT($scope.selectedCirculation)
                .then((contract) => {
                    toastr.success('Chuyển hợp đồng Thu Về thành công!');

                    $scope.checkedList = [];
                    // $scope.checkbox.checkAll = false;
                    $scope.selectedCirculation = {};
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

            $scope.selectedCirculation.statusContract = CONTRACT_STATUS.CLOSE_DEAL;
            $scope.selectedCirculation.newTransferDate = moment($scope.selectedCirculation.newTransferDate).format("DD/MM/YYYY");
            $scope.selectedCirculation.newAppointmentDate = moment($scope.selectedCirculation.newAppointmentDate).format("DD/MM/YYYY");
            $scope.selectedCirculation.moneyHavePay = $scope.selectedCirculation.moneyPaid = $scope.selectedCirculation.newPayMoney;

            HdLuuThongManager
                .one($scope.selectedCirculation.contractId)
                .one('transferType')
                .customPUT($scope.selectedCirculation)
                .then((contract) => {
                    toastr.success('Chuyển hợp đồng Chốt thành công!');

                    $scope.selectedCirculation = {};
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

            $scope.selectedCirculation.statusContract = CONTRACT_STATUS.ESCAPE;
            $scope.selectedCirculation.newAppointmentDate = moment($scope.selectedCirculation.newAppointmentDate).format("DD/MM/YYYY");
            $scope.selectedCirculation.moneyHavePay = $scope.selectedCirculation.moneyPaid = $scope.selectedCirculation.newPayMoney;

            HdLuuThongManager
                .one($scope.selectedCirculation.contractId)
                .one('transferType')
                .customPUT($scope.selectedCirculation)
                .then((contract) => {
                    toastr.success('Chuyển hợp đồng Bễ thành công!');

                    $scope.selectedCirculation = {};
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
            $scope.selectedCirculation.statusContract = CONTRACT_STATUS.END;
            $scope.selectedCirculation.newTransferDate = moment($scope.selectedCirculation.newTransferDate).format("YYYY-MM-DD");

            HdLuuThongManager
                .one($scope.selectedCirculation.contractId)
                .one('transferType')
                // .customPUT({
                //     status: CONTRACT_STATUS.END,
                //     luuThongId: $scope.selectedCirculation._id,
                //     payMoneyOriginal: $scope.selectedCirculation.payMoneyOriginal,
                //     newTransferDate: $scope.selectedCirculation.newTransferDate
                // })
                .customPUT($scope.selectedCirculation)
                .then((contract) => {
                    toastr.success('Chuyển hợp đồng Kết Thúc thành công!');

                    $scope.checkedList = [];
                    // $scope.checkbox.checkAll = false;
                    $scope.selectedCirculation = {};


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

        $scope.saveDongThemModal = () => {
            if ($scope.formProcessing)
                return;

            $scope.formProcessing = true;

            $scope.selectedCirculation.statusContract = CONTRACT_STATUS.ESCAPE;
            $scope.selectedCirculation.newAppointmentDate = moment($scope.selectedCirculation.newAppointmentDate).format("DD/MM/YYYY");
            $scope.selectedCirculation.moneyHavePay = $scope.selectedCirculation.moneyPaid = $scope.selectedCirculation.newPayMoney;

            HdLuuThongManager
                .one($scope.selectedCirculation.contractId)
                .one('updateDongTruoc')
                .customPUT($scope.selectedCirculation)
                .then((contract) => {
                    toastr.success('Cập nhật thành công!');

                    $scope.selectedCirculation = {};
                    $('#dongNhieuNgayModal').modal('hide');

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


        $scope.opened = false;
        $scope.opened2 = false;

        $scope.openDate = function ($event, type) {
            $event.preventDefault();
            $event.stopPropagation();

            if (type === 1) {
                $scope.opened = true;
                $scope.opened2 = false;
            } else {
                $scope.opened2 = true;
                $scope.opened = false;
            }
        };

    }
})();