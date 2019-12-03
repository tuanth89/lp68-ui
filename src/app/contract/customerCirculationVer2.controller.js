(function () {
    'use strict';

    angular.module('ati.contract')
        .controller('CustomerCirculationVer2Controller', CustomerCirculationVer2Controller)
    ;

    function CustomerCirculationVer2Controller($scope, $rootScope, $state, $stateParams, $timeout, $http, CONTRACT_STATUS, ContractManager, moment, Restangular, HdLuuThongManager, CONTRACT_EVENT, API_END_POINT) {
        $scope.formProcessing = false;
        $scope.filter = {
            date: "",
            status: "",
            storeId: $scope.$parent.storeSelected.storeId,
            userId: $scope.$parent.storeSelected.userId,
        };
        let STATE_NAME = "app.root.contract.cusCirculation";

        $scope.contracts = [];
        $scope.checkedList = [];

        $scope.selectedCirculation = {};

        $scope.formTableProcessing = false;
        let totalLuuThong = 0;
        let inModeSelectMulti = false;
        let isClickHeader = false;
        let isDataChanged = false;

        let container = document.getElementById('hotCirculationTable');
        let containerId = $("#hotCirculationTable");
        const hotTableInstance = new Handsontable(container, {
            data: $scope.contracts,
            columns: [
                {
                    data: 'isActive',
                    type: 'checkbox',
                    checkedTemplate: 'true',
                    uncheckedTemplate: 'false',
                    width: 40
                },
                {
                    data: 'customer.name',
                    type: 'text',
                    width: 130,
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
                    width: 330,
                    readOnly: true
                },
                {
                    data: 'contractNo',
                    type: 'text',
                    width: 170,
                    readOnly: true
                },
                {
                    data: 'note',
                    type: 'text',
                    width: 200,
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
            // copyPaste: false,
            autoWrapRow: true,
            rowHeaders: true,
            // wordWrap: false,
            // preventOverflow: 'horizontal',
            fixedColumnsLeft: 4,
            // viewportColumnRenderingOffset: 100,
            // viewportRowRenderingOffset: 100,
            rowHeights: 35,
            manualColumnMove: true,
            manualRowMove: true,
            licenseKey: 'non-commercial-and-evaluation',
            colHeaders: function (col) {
                switch (col) {
                    case 0:
                        let txt = "<input type='checkbox' class='checker' ";
                        txt += totalLuuThong === 0 ? 'style=display:none' : '';
                        txt += isChecked() ? 'checked="checked"' : '';
                        txt += "> ";
                        return txt;
                    case 1:
                        return "Họ và tên";
                    case 2:
                        return "Ngày vay";
                    case 3:
                        return "Gói vay";
                    case 4:
                        return "Thực thu";
                    case 5:
                        return "Dư nợ";
                    case 6:
                        return "Đã đóng";
                    case 7:
                        return "Đóng trong ngày";
                    case 8:
                        return "Thao tác";
                    case 9:
                        return "Số hợp đồng";
                    case 10:
                        return "Ghi chú";

                }
            },
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

                if (typeof item === 'object' && item.contractStatus === CONTRACT_STATUS.STAND) {
                    cellPrp.className = "handsontable-td-red";
                } else
                    cellPrp.className = "hot-normal";

                switch (col) {
                    case 0:
                        cellPrp.className += " htCenter htMiddle";
                        break;
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
                        cellPrp.renderer = myBtns;
                        cellPrp.readOnly = true;
                        break;
                }


                return cellPrp;
            },
            beforeOnCellMouseDown: function (e, coords) {
                isClickHeader = (coords.col < 0 || coords.row < 0) && coords.col !== 7;
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
                    // if (isDataChanged) {
                    //     $scope.showConfirmSave();
                    //     return;
                    // }

                    $scope.selectedCirculation = {};
                    let nowDate = moment($scope.filter.date, "YYYYMMDD");
                    $scope.selectedCirculation = angular.copy(Restangular.stripRestangular($scope.contracts[rowCol.row]));
                    let {actuallyCollectedMoney, totalMoneyPaid, moneyPaid} = $scope.selectedCirculation;

                    switch (parseInt(event.realTarget.value)) {
                        case 7:
                        case 0:
                            $scope.selectedCirculation.totalMoney = 0;
                            $scope.selectedCirculation.newDailyMoney = 0;
                            $scope.selectedCirculation.moneyPayOld = numbro($scope.selectedCirculation.moneyPaid).format({thousandSeparated: true});
                            $scope.selectedCirculation.newLoanMoney = 0;
                            $scope.selectedCirculation.newActuallyCollectedMoney = 0;
                            $scope.selectedCirculation.moneyPayNew = 0;
                            $scope.selectedCirculation.moneyContractOld = parseInt(actuallyCollectedMoney) - parseInt(totalMoneyPaid); // - parseInt(moneyPaid);
                            // $scope.selectedCirculation.moneyContractOld = parseInt(actuallyCollectedMoney) - (parseInt(dailyMoney) * diffDays);
                            // let createdAt = moment(nowDate).add(1, "days");

                            $scope.selectedCirculation.newTransferDate = $scope.filter.date;
                            $scope.selectedCirculation.createdAt = nowDate.format("YYYY-MM-DD");
                            $scope.selectedCirculation.contractDate = nowDate.format("DD/MM/YYYY");
                            $scope.selectedCirculation.contractCreatedAt = moment($scope.selectedCirculation.contractCreatedAt).utc().format("DD/MM/YYYY");
                            $scope.selectedCirculation.totalMoney = -$scope.selectedCirculation.moneyContractOld;
                            $scope.selectedCirculation.isPheCustomerNew = false;

                            $('#hopDongDaoModal').on('shown.bs.modal', function () {
                                $('.inputDao').focus();
                                $('.inputDao').blur();
                            });

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

                            // $('#dongNhieuNgayModal').modal('show');

                            let ws = XLSX.utils.json_to_sheet($scope.contracts);
                            let wb = XLSX.utils.book_new();
                            XLSX.utils.book_append_sheet(wb, ws, "Presidents");
                            XLSX.writeFile(wb, "sheetjs.xlsx");
                            break;

                        case 8:
                            $scope.selectedCirculation.moneyContractOld = parseInt(actuallyCollectedMoney) - parseInt(totalMoneyPaid);
                            $scope.selectedCirculation.contractCreatedAt = moment($scope.selectedCirculation.contractCreatedAt).utc().format("DD/MM/YYYY");
                            $scope.selectedCirculation.payMoneyOriginal = numbro($scope.selectedCirculation.moneyPaid).format({thousandSeparated: true});

                            $('#suaTienDongModal').on('shown.bs.modal', function () {
                                $('.inputSuaTienDongModal').focus();
                            });

                            $('#suaTienDongModal').modal('show');
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
                    isDataChanged = true;

                    if (source[0][1] === "isActive") {
                        let rowChecked = source[0][0];
                        let checkedIndex = $scope.checkedList.indexOf(rowChecked);
                        let moneyDraft = parseInt($scope.contracts[rowChecked].moneyPaid) || 0;

                        if (checkedIndex >= 0) {
                            $scope.totalMoneyPayDraft = Math.max(0, $scope.totalMoneyPayDraft - moneyDraft);

                            $scope.checkedList.splice(checkedIndex, 1);

                            let totalCheckedList = $scope.checkedList.length;
                            if (totalCheckedList === 0 || totalCheckedList < totalLuuThong) {
                                $('input.checker').attr("checked", false);
                                isDataChanged = false;
                            }
                        } else {
                            isDataChanged = true;
                            $scope.checkedList.push(rowChecked);
                            $scope.totalMoneyPayDraft += moneyDraft;

                            if ($scope.checkedList.length === totalLuuThong)
                                $('input.checker').attr("checked", true);
                        }

                        setTimeout(function () {
                            $scope.$apply();
                        }, 1);

                        // hotTableInstance.getInstance().render();

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
            },
            afterSelection: function (row, col, row2, col2) {
                let isSelected = hotTableInstance.selection.isSelected();
                let isMultiple = false;
                if (isSelected) {
                    isMultiple = hotTableInstance.selection.isMultiple();
                    if (!isMultiple && inModeSelectMulti) {
                        inModeSelectMulti = false;
                        $scope.totalMoneyPayDraft = 0;

                        $scope.checkedList.forEach((index) => {
                            let item = $scope.contracts[index];

                            $scope.totalMoneyPayDraft += parseInt(item.moneyPaid);
                        });

                        setTimeout(function () {
                            $scope.$apply();
                        }, 1);
                    }
                }

                if (isSelected && isMultiple) {
                    if (col !== 7) {
                        if ($scope.checkedList.length === 0) {
                            $scope.totalMoneyPayDraft = 0;

                            setTimeout(function () {
                                $scope.$apply();
                            }, 1);
                        }
                        return;
                    }

                    inModeSelectMulti = true;

                    if (!isClickHeader)
                        $scope.totalMoneyPayDraft = 0;

                    for (let index = row; index < (row2 + 1); index++) {
                        let contractItem = $scope.contracts[index];
                        // if (contractItem.status !== 1 && parseInt(contractItem.moneyPaid) > 0)
                        $scope.totalMoneyPayDraft += parseInt(contractItem.moneyPaid);
                    }

                    // let moneyPaids = hotTableInstance.getData.apply(hotTableInstance, item);
                    // let moneyPaids = hotTableInstance.getSourceData.apply(hotTableInstance, item);
                    // // console.log(moneyPaids);
                    // if (moneyPaids.length > 0 && moneyPaids.length > 1) {
                    //     moneyPaids.forEach((item) => {
                    //         if (parseInt(item.moneyPaid) > 0)
                    //             $scope.totalMoneyPayDraft += parseInt(item.moneyPaid);
                    //     });
                    // }
                    // }

                    setTimeout(function () {
                        $scope.$apply();
                    }, 1);
                }
            },
            afterDeselect: function () {
                $scope.totalMoneyPayDraft = 0;

                $scope.checkedList.forEach((index) => {
                    let item = $scope.contracts[index];

                    $scope.totalMoneyPayDraft += parseInt(item.moneyPaid);
                });

                setTimeout(function () {
                    $scope.$apply();
                }, 1);
            }

        });

        containerId.on('mouseup', 'input.checker', function (event) {
            let current = !$('input.checker').is(':checked'); //returns boolean
            $('input.checker').attr("checked", current);
            $scope.totalMoneyPayDraft = 0;
            $scope.checkedList = [];
            for (let index = 0; index < $scope.contracts.length; index++) {
                let itemContract = $scope.contracts[index];

                if (itemContract && itemContract.status !== 1) {
                    itemContract.isActive = current.toString();

                    let moneyDraft = parseInt(itemContract.moneyPaid) || 0;
                    if (current) {
                        $scope.totalMoneyPayDraft += moneyDraft;
                        $scope.checkedList.push(index);
                    } else {
                        let checkedIndex = $scope.checkedList.indexOf(index);
                        if (checkedIndex >= 0) {
                            $scope.checkedList.splice(checkedIndex, 1);
                        }
                        $scope.totalMoneyPayDraft = Math.max(0, $scope.totalMoneyPayDraft - moneyDraft);
                    }
                }
            }

            setTimeout(function () {
                $scope.$apply();
            }, 1);

            hotTableInstance.render();
        });

        function isChecked() {
            for (let index = 0, ilen = $scope.contracts.length; index < ilen; index++) {
                let itemContract = $scope.contracts[index];

                if (itemContract.isActive === "false" && itemContract.status !== 1) {
                    return false;
                }
            }
            return $scope.checkedList.length > 0 && $scope.checkedList.length === totalLuuThong;
        }

        $scope.$on(CONTRACT_EVENT.RESIZE_TABLE, function (event, data) {
            setTimeout(function () {
                hotTableInstance.render();
            }, 1);

        });

        $scope.pagination = {
            page: $stateParams.p ? parseInt($stateParams.p) : 1,
            per_page: 30,
            totalItems: 0,
            totalByPages: 0
        };

        $scope.$watch('filter.date', function (newValue, oldValue) {
            if (newValue != oldValue) {
                $scope.filterDateFormat = moment(newValue, "YYYY-MM-DD").format("DD/MM/YYYY");
                $scope.getData();
            }
        });

        $scope.$on('$viewContentLoaded', function (event, data) {
            $scope.getData();
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
        $scope.totalMoneyHavePayEnd = 0;
        $scope.totalMoneyPayDraft = 0;

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

            $scope.filter.page = $scope.pagination.page;
            $scope.filter.per_page = $scope.pagination.per_page;
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
                        $scope.totalMoneyHavePayEnd = data.totalMoneyHavePayEnd;

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
                        $scope.totalMoneyHavePayEnd = 0;
                    }

                    $scope.totalMoneyPayDraft = 0;
                    $scope.checkedList = [];
                    $('input.checker').attr("checked", false);

                    // isCheckboxVisible = _.find($scope.contracts, {status: 0}) === undefined;
                    totalLuuThong = _.filter($scope.contracts, function (item) {
                        return item.status === 0;
                    }).length;

                    // let headers = hotTableInstance.getColHeader();

                    // hotTableInstance.render();
                    hotTableInstance.updateSettings({
                        data: $scope.contracts,
                        // colHeaders: headers
                    });

                    hotTableInstance.getInstance().render();

                })
                .finally(() => {
                    $scope.formTableProcessing = false;
                    // $scope.$broadcast(CONTRACT_EVENT.BLOCKING_UI, {isShow: false});
                });
        };

        $scope.exportToExcel = function () {
            $scope.filter.page = $scope.pagination.page;
            $scope.filter.per_page = $scope.pagination.per_page;

            // $scope.formTableProcessing = true;

            // HdLuuThongManager
            //     .one('listByDate')
            //     .customGET("exportAll", $scope.filter)
            //     .then(function (resp) {
            //
            //     })
            //     .finally(() => {
            //         $scope.formTableProcessing = false;
            //         // $scope.$broadcast(CONTRACT_EVENT.BLOCKING_UI, {isShow: false});
            //     });

            $http({
                method: 'GET',
                url: `${API_END_POINT}/admin/v1/hdLuuThongs/listByDate/exportAll`,
                params: $scope.filter,
                responseType: 'arraybuffer'
            })
                .then(function successCallback(response) {
                    let today = new Date();
                    let filename = `Danh_sach_Luu_Thong_ngay_${moment($scope.filter.date).format("DD/MM/YYYY")}.xlsx`;
                    let file = new Blob([response.data], { type: 'application/octet-stream' });
                    saveAs(file, filename);
                }, function errorCallback(response) {
                    console.log(response);
                });
        }

        $scope.$on('$stateChangeStart', function (event) {
            // if ($scope.formProcessing) {
            //     $scope.formProcessing = false;
            //     return;
            // }

            if (isDataChanged) {
                let confirmBack = confirm('Dữ liệu đã bị thay đổi. Bạn chắc chắn muốn chuyển?');
                if (confirmBack === false) {
                    isDataChanged = false;
                    event.preventDefault();
                }
            }
        });

        $scope.showConfirmSave = () => {
            swal({
                title: 'Dữ liệu đã bị thay đổi. Bạn chắc chắn muốn chuyển?',
                text: "",
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Có',
                cancelButtonText: 'Không',
            }).then((result) => {
                if (result.value) {

                } else {
                    isDataChanged = false;
                }
            });
        };

        $scope.showModalThuVe = (actuallyCollectedMoney, totalMoneyPaid) => {
            // let nowDate = moment($scope.filter.date, "YYYYMMDD");

            $scope.selectedCirculation.moneyContractOld = parseInt(actuallyCollectedMoney) - parseInt(totalMoneyPaid); // - parseInt(moneyPaid);
            $scope.selectedCirculation.createdAt = moment($scope.selectedCirculation.createdAt).format("DD/MM/YYYY");
            $scope.selectedCirculation.newPayMoney = 0;
            $scope.selectedCirculation.payMoneyOriginal = $scope.selectedCirculation.status > 0 ? 0 : numbro($scope.selectedCirculation.moneyPaid).format({thousandSeparated: true});
            $scope.selectedCirculation.totalMoney = $scope.selectedCirculation.moneyContractOld;
            $scope.selectedCirculation.contractCreatedAt = moment($scope.selectedCirculation.contractCreatedAt).utc().format("DD/MM/YYYY");
            $scope.selectedCirculation.newTransferDate = $scope.filter.date;

            $('#hopDongThuVeModal').on('shown.bs.modal', function () {
                $('.inputThuVeModal').focus();
            });

            $('#hopDongThuVeModal').modal('show');
        };

        $scope.showModalChot = (actuallyCollectedMoney, totalMoneyPaid) => {
            $scope.selectedCirculation.moneyContractOld = parseInt(actuallyCollectedMoney) - parseInt(totalMoneyPaid); // - parseInt(moneyPaid);
            $scope.selectedCirculation.newTransferDate = $scope.filter.date;
            $scope.selectedCirculation.newAppointmentDate = "";
            $scope.selectedCirculation.newPayMoney = 0;
            $scope.selectedCirculation.payMoneyOriginal = $scope.selectedCirculation.status > 0 ? 0 : numbro($scope.selectedCirculation.moneyPaid).format({thousandSeparated: true});
            $scope.selectedCirculation.contractCreatedAt = moment($scope.selectedCirculation.contractCreatedAt).utc().format("DD/MM/YYYY");
            $('.datepicker-ui').val('');

            $scope.selectedCirculation.totalMoney = $scope.selectedCirculation.moneyContractOld;

            $('#hopDongChotModal').on('shown.bs.modal', function () {
                $('.inputChotModal').focus();
            });

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
            $scope.selectedCirculation.payMoneyOriginal = $scope.selectedCirculation.status > 0 ? 0 : numbro($scope.selectedCirculation.moneyPaid).format({thousandSeparated: true});
            $('.datepicker-ui').val('');

            $scope.selectedCirculation.totalMoney = $scope.selectedCirculation.moneyContractOld;

            $('#hopDongBeModal').on('shown.bs.modal', function () {
                $('.inputBeModal').focus();
            });

            $('#hopDongBeModal').modal('show');
        };

        $scope.showModalKetThuc = (actuallyCollectedMoney, totalMoneyPaid) => {
            $scope.selectedCirculation.moneyContractOld = parseInt(actuallyCollectedMoney) - parseInt(totalMoneyPaid); // - parseInt(moneyPaid);
            $scope.selectedCirculation.newTransferDate = $scope.filter.date;
            $scope.selectedCirculation.payMoneyOriginal = $scope.selectedCirculation.status > 0 ? 0 : numbro($scope.selectedCirculation.moneyPaid).format({thousandSeparated: true});
            $scope.selectedCirculation.contractCreatedAt = moment($scope.selectedCirculation.contractCreatedAt).utc().format("DD/MM/YYYY");
            $('.datepicker-ui').val('');

            $scope.selectedCirculation.totalMoney = $scope.selectedCirculation.moneyContractOld;

            $('#ketThucModal').on('shown.bs.modal', function () {
                $('.inputKetThucModal').focus();
            });

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
        }

        function btnThuVeChotBe(instance, td, row, col, prop, value, cellProperties) {
            Handsontable.renderers.TextRenderer.apply(this, arguments);

            if ($scope.$parent.storeSelected.userId) {
                td.innerHTML = '<button class="btnAction btn btn-success btAction-' + 7 + '" value="' + 7 + '">' + 'Đáo' + '</button>&nbsp;&nbsp;';
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
                    case CONTRACT_STATUS.MATURITY:
                    case CONTRACT_STATUS.END:
                        td.innerHTML = '';
                        break;
                    default:
                        td.innerHTML += '<button class="btnAction btn btn-success btAction-' + 1 + '" value="' + 1 + '">' + 'Thu về' + '</button>&nbsp;&nbsp;' +
                            '<button class="btnAction btn btn-success btAction-' + 2 + '" value="' + 2 + '">' + 'Chốt' +
                            '</button>&nbsp;&nbsp;<button class="btnAction btn btn-success btAction-' + 3 + '" value="' + 3 + '">' + 'Bễ' + '</button>&nbsp;&nbsp;' +
                            '<button class="btnAction btn btn-success btAction-' + 4 + '" value="' + 4 + '">' + 'Kết thúc' + '</button>&nbsp;&nbsp;' +
                            '<button class="btnAction btn btn-success btAction-' + 6 + '" value="' + 6 + '">' + 'Đóng trước' + '</button>';
                        break;
                }

                if (value === CONTRACT_STATUS.NEW) {
                    td.innerHTML += '<button class="btnAction btn btn-success btAction-' + 8 + '" value="' + 8 + '">' + 'Sửa tiền đóng' + '</button>&nbsp;&nbsp;';
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
                return item.isActive === "true";
            });

            HdLuuThongManager
                .one("contract")
                .one("updateMany")
                .customPUT(contracts)
                .then((items) => {
                    $scope.checkedList = [];
                    $scope.totalMoneyPayDraft = 0;
                    isDataChanged = false;

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

            delete $scope.selectedCirculation.moneyHavePay;
            delete $scope.selectedCirculation.moneyPaid;

            HdLuuThongManager
                .one($scope.selectedCirculation.contractId)
                .one('updateLaiDung')
                .customPUT($scope.selectedCirculation)
                .then((contract) => {
                    toastr.success('Chốt lãi hợp đồng thành công!');

                    $scope.checkedList = [];
                    $scope.totalMoneyPayDraft = 0;
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
                    isDataChanged = false;
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
                    $scope.totalMoneyPayDraft = 0;
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
                    isDataChanged = false;
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
                    $scope.totalMoneyPayDraft = 0;
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
                    isDataChanged = false;
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

                    $scope.checkedList = [];
                    $scope.totalMoneyPayDraft = 0;
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
                    isDataChanged = false;
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

                    $scope.checkedList = [];
                    $scope.totalMoneyPayDraft = 0;
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
                    isDataChanged = false;
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
                .customPUT($scope.selectedCirculation)
                .then((contract) => {
                    toastr.success('Chuyển hợp đồng Kết Thúc thành công!');

                    $scope.checkedList = [];
                    $scope.totalMoneyPayDraft = 0;
                    $scope.selectedCirculation = {};

                    $('#ketThucModal').modal('hide');
                    $scope.getData();
                })
                .catch((error) => {
                    toastr.error("Có lỗi xảy ra! Hãy thử lại");
                })
                .finally(() => {
                    $scope.formProcessing = false;
                    isDataChanged = false;
                });
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

                    $scope.checkedList = [];
                    $scope.totalMoneyPayDraft = 0;
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
                    isDataChanged = false;
                });
        };

        $scope.saveSuaTienDongModal = () => {
            if ($scope.formProcessing)
                return;

            $scope.formProcessing = true;
            // $scope.selectedCirculation.createdAt = moment($scope.selectedCirculation.createdAt).format("DD/MM/YYYY");

            HdLuuThongManager
                .one($scope.selectedCirculation.contractId)
                .one('editMoneyPaidPerDay')
                .customPUT($scope.selectedCirculation)
                .then((contract) => {
                    toastr.success('Cập nhật tiền đóng thành công!');

                    $scope.selectedCirculation = {};

                    $('#suaTienDongModal').modal('hide');

                    $scope.getData();
                })
                .catch((error) => {
                    toastr.error("Có lỗi xảy ra! Hãy thử lại");
                })
                .finally(() => {
                    $scope.formProcessing = false;
                    isDataChanged = false;
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
