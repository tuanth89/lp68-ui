(function () {
    'use strict';

    angular.module('ati.contract')
        .controller('LuuThongController', LuuThongController)
    ;

    function LuuThongController($scope, $rootScope, $state, $stateParams, $timeout, CONTRACT_STATUS, ContractManager, moment, Restangular, HdLuuThongManager, CONTRACT_EVENT) {
        $scope.formProcessing = false;
        $scope.filter = {
            date: "",
            status: "",
            storeId: $scope.$parent.storeSelected.storeId,
            userId: $scope.$parent.storeSelected.userId,
        };

        if ($scope.$parent.isAccountant)
            $scope.filter.date = moment(new Date()).subtract(1, "days").format("YYYY-MM-DD");
        else
            $scope.filter.date = moment(new Date()).format("YYYY-MM-DD");

        $scope.contracts = [];
        $scope.formTableProcessing = false;
        let totalLuuThong = 0;
        let isDataChanged = false;
        let grid = null;

        $scope.$watch('filter.date', function (newValue, oldValue) {
            if (newValue !== oldValue) {
                $scope.getData();
            }
        });

        $scope.$on('$viewContentLoaded', function (event, data) {
            $scope.getData();
        });

        $scope.gridOptions = {
            bindingOptions: {
                dataSource: 'contracts'
            },
            onInitialized: function (e) {
                grid = e.component;
            },
            allowColumnReordering: true,
            allowColumnResizing: true,
            columnAutoWidth: true,
            // rowAlternationEnabled: true,
            wordWrapEnabled: true,
            showBorders: true,
            showColumnLines: true,
            showRowLines: true,
            paging: {
                enabled: true,
                pageSize: 10,
            },
            pager: {
                showPageSizeSelector: true,
                allowedPageSizes: [10, 30, 50, 100],
                showInfo: true,
                visible: true,
                infoText: "Trang {0} của {1} ({2} bản ghi)",
            },
            columnFixing: {
                enabled: true,
                texts: {
                    fix: 'Giữ cột',
                    unfix: 'Bỏ',
                    leftPosition: 'Bên trái',
                    rightPosition: 'Bên phải',
                }
            },
            sorting: {
                ascendingText: 'Tăng dần',
                descendingText: 'Giảm dần',
                clearText: 'Mặc định',
            },
            columnChooser: {
                enabled: true,
                title: 'Ẩn cột',
                emptyPanelText: 'Kéo cột vào đây để ẩn bớt',
            },
            editing: {
                mode: "row",
                refreshMode: "full",
                allowUpdating: function (e) {
                    const {row: {data}} = e;
                    return data.status <= 0;
                },
                useIcons: true,
                selectTextOnEditStart: true,
                texts: {
                    editRow: 'Sửa',
                    saveRowChanges: 'Lưu',
                    cancelRowChanges: 'Hủy',
                },
            },
            headerFilter: {
                visible: true,
                texts: {
                    ok: 'Đồng ý',
                    cancel: 'Hủy',
                    emptyValue: 'Giá trị rỗng',
                },
            },
            export: {
                enabled: true,
                fileName: `Lưu thông ngày ${moment($scope.filter.date).format("DD/MM/YYYY")}`,
                allowExportSelectedData: true,
                texts: {
                    exportAll: 'Xuất tất cả',
                    exportSelectedRows: 'Xuất theo dòng chọn',
                    exportTo: 'Xuất excel',
                }
            },
            noDataText: 'Không có dữ liệu',
            onCellClick: function (e) {
                console.log(e)
                const {event: {target}, rowIndex} = e;
                if (target.className.indexOf('btnAction') >= 0 && $scope.$parent.storeSelected.userId) {
                    // if (isDataChanged) {
                    //     $scope.showConfirmSave();
                    //     return;
                    // }

                    $scope.selectedCirculation = {};
                    let nowDate = moment($scope.filter.date, "YYYYMMDD");
                    $scope.selectedCirculation = angular.copy(Restangular.stripRestangular($scope.contracts[rowIndex]));
                    let {actuallyCollectedMoney, totalMoneyPaid, moneyPaid} = $scope.selectedCirculation;

                    switch (parseInt(target.value)) {
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

                            $('#dongNhieuNgayModal').modal('show');
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
                    }, 0);


                }
            },
            columns: [
                {
                    caption: 'Họ và tên',
                    dataField: "customer.name",
                    readOnly: true,
                    fixed: true,
                    allowEditing: false,
                    width: 130,
                    cellTemplate: function (container, options) {
                        const {row: {data}, rowIndex} = options;

                        $('<u><a class="linkable cusRow"></a></u>').addClass('dx-link')
                            .text(data.customer.name)
                            .on('dxclick', function () {
                                $scope.showContractInfoById(data);
                            })
                            .appendTo(container);
                    }
                },
                {
                    caption: 'Ngày vay',
                    dataField: "contractCreatedAt",
                    dataType: "date",
                    format: 'dd/MM/yyyy',
                    readOnly: true,
                    allowEditing: false,
                    fixed: true,
                    width: 100,
                },
                {
                    caption: 'Gói vay',
                    dataField: "loanMoney",
                    dataType: "number",
                    format: 'fixedPoint',
                    readOnly: true,
                    fixed: true,
                    allowEditing: false,
                    allowFiltering: false,
                    width: 100,
                },
                {
                    caption: 'Thực thu',
                    dataField: "actuallyCollectedMoney",
                    format: 'fixedPoint',
                    dataType: "number",
                    readOnly: true,
                    allowEditing: false,
                    allowFiltering: false,
                    width: 100,
                },
                {
                    caption: 'Dư nợ',
                    dataField: "totalHavePay",
                    format: 'fixedPoint',
                    dataType: "number",
                    readOnly: true,
                    allowEditing: false,
                    allowFiltering: false,
                    width: 100,
                },
                {
                    caption: 'Đã đóng',
                    dataField: "totalMoneyPaid",
                    format: 'fixedPoint',
                    dataType: "number",
                    readOnly: true,
                    allowEditing: false,
                    allowFiltering: false,
                    width: 100,
                },
                {
                    caption: 'Đóng trong ngày',
                    dataField: "moneyPaid",
                    format: 'fixedPoint',
                    dataType: "number",
                    editorOptions: {
                        format: 'fixedPoint',
                        mode: 'number',
                    },
                    allowFiltering: false,
                    width: 140,
                },
                {
                    caption: 'Thao tác',
                    dataField: "contractStatus",
                    alignment: 'left',
                    allowEditing: false,
                    allowFiltering: false,
                    allowSorting: false,
                    width: 300,
                    cellTemplate: function (container, options) {
                        const {row: {data}, rowIndex} = options;
                        let fieldHtml = "";
                        if (!$scope.$parent.storeSelected.userId) {
                            fieldHtml = "";
                            return;
                        }

                        if (data.status > 0) {
                            if (data.contractStatus !== CONTRACT_STATUS.STAND && data.contractStatus !== CONTRACT_STATUS.END) {
                                fieldHtml = '<button class="btnAction btn btn-success btAction-' + 7 + '" value="' + 7 + '">' + 'Đáo' + '</button>';
                                switch (data.contractStatus) {
                                    case CONTRACT_STATUS.STAND:
                                        fieldHtml = '<button class="btnAction btn btn-success btAction-' + 5 + '" value="' + 5 + '">' + 'Chốt lãi' + '</button>';
                                        break;
                                    case CONTRACT_STATUS.COLLECT:
                                        fieldHtml = '<button class="btnAction btn btn-success btAction-' + 2 + '" value="' + 2 + '">' + 'Chốt' +
                                            '</button><button class="btnAction btn btn-success btAction-' + 3 + '" value="' + 3 + '">' + 'Bễ' + '</button>' +
                                            '<button class="btnAction btn btn-success btAction-' + 4 + '" value="' + 4 + '">' + 'Kết thúc' + '</button>';
                                        break;
                                    case CONTRACT_STATUS.CLOSE_DEAL:
                                        fieldHtml = '<button class="btnAction btn btn-success btAction-' + 1 + '" value="' + 1 + '">' + 'Thu về' + '</button>' +
                                            '</button><button class="btnAction btn btn-success btAction-' + 3 + '" value="' + 3 + '">' + 'Bễ' + '</button>' +
                                            '<button class="btnAction btn btn-success btAction-' + 4 + '" value="' + 4 + '">' + 'Kết thúc' + '</button>';
                                        break;
                                    case CONTRACT_STATUS.ESCAPE:
                                        fieldHtml = '<button class="btnAction btn btn-success btAction-' + row + '" value="' + 1 + '">' + 'Thu về' + '</button>' +
                                            '<button class="btnAction btn btn-success btAction-' + 2 + '" value="' + 2 + '">' + 'Chốt' + '</button>' +
                                            '<button class="btnAction btn btn-success btAction-' + 4 + '" value="' + 4 + '">' + 'Kết thúc' + '</button>';
                                        break;
                                    case CONTRACT_STATUS.MATURITY:
                                    case CONTRACT_STATUS.END:
                                        fieldHtml = '';
                                        break;
                                    default:
                                        fieldHtml += '<button class="btnAction btn btn-success btAction-' + 1 + '" value="' + 1 + '">' + 'Thu về' + '</button>' +
                                            '<button class="btnAction btn btn-success btAction-' + 2 + '" value="' + 2 + '">' + 'Chốt' +
                                            '</button><button class="btnAction btn btn-success btAction-' + 3 + '" value="' + 3 + '">' + 'Bễ' + '</button>' +
                                            '<button class="btnAction btn btn-success btAction-' + 4 + '" value="' + 4 + '">' + 'Kết thúc' + '</button>' +
                                            '<button class="btnAction btn btn-success btAction-' + 6 + '" value="' + 6 + '">' + 'Đóng trước' + '</button>';
                                        break;
                                }

                                if (data.contractStatus === CONTRACT_STATUS.NEW) {
                                    fieldHtml += '<button class="btnAction btn btn-success btAction-' + 8 + '" value="' + 8 + '">' + 'Sửa tiền đóng' + '</button>';
                                }
                            }
                        } else {
                            switch (data.contractStatus) {
                                case 2:
                                    fieldHtml = '<button class="btnAction btn btn-success btAction-' + rowIndex + '" value="' + 5 + '">' + 'Chốt lãi' + '</button>';
                                    break;
                                case 0:
                                    fieldHtml = '<button class="btnAction btn btn-success btAction-' + 0 + '" value="' + 0 + '">' + 'Đáo' + '</button>&nbsp;&nbsp;' +
                                        '<button class="btnAction btn btn-success btAction-' + 1 + '" value="' + 1 + '">' + 'Thu về' + '</button>&nbsp;&nbsp;' +
                                        '<button class="btnAction btn btn-success btAction-' + 2 + '" value="' + 2 + '">' + 'Chốt' + '</button>&nbsp;&nbsp;' +
                                        '<button class="btnAction btn btn-success btAction-' + 3 + '" value="' + 3 + '">' + 'Bễ' + '</button>&nbsp;&nbsp;' +
                                        '<button class="btnAction btn btn-success btAction-' + 4 + '" value="' + 4 + '">' + 'Kết thúc' + '</button>&nbsp;&nbsp;' +
                                        '<button class="btnAction btn btn-success btAction-' + 6 + '" value="' + 6 + '">' + 'Đóng trước' + '</button>';
                                    break;
                                default:
                                    fieldHtml = '';
                                    break;
                            }
                        }

                        $(fieldHtml).appendTo(container);
                    }
                },
                {
                    caption: 'Số hợp đồng',
                    dataField: "contractNo",
                    readOnly: true,
                    allowEditing: false,
                    width: 150,
                },
                {
                    caption: 'Ghi chú',
                    dataField: "note",
                    readOnly: true,
                    allowEditing: false,
                    allowFiltering: false,
                    allowSorting: false,
                    width: 200,
                }
            ]
        };

        $scope.getData = function () {
            $scope.formTableProcessing = true;

            HdLuuThongManager
                .one('listByDate')
                .customGET("all", $scope.filter)
                .then(function (resp) {
                    if (resp) {
                        let data = resp.plain();
                        $scope.contracts = angular.copy(data.docs);
                        // $scope.pagination.totalItems = data.totalItems;
                        $scope.totalMoneyPaid = data.totalMoneyStatusEnd;
                        $scope.totalMoneyHavePayEnd = data.totalMoneyHavePayEnd;

                        // let totalContract = $scope.contracts.length;

                        // if ($scope.filter.page > 1) {
                        //     $scope.pagination.totalByPages = (($scope.filter.page - 1) * $scope.filter.per_page) + totalContract;
                        // } else {
                        //     $scope.pagination.totalByPages = totalContract;
                        // }
                    } else {
                        $scope.contracts = [];
                        // $scope.pagination.totalItems = 0;
                        // $scope.pagination.totalByPages = 0;
                        $scope.totalMoneyPaid = 0;
                        $scope.totalMoneyHavePayEnd = 0;
                    }

                    grid.refresh();

                    $scope.totalMoneyPayDraft = 0;
                    totalLuuThong = _.filter($scope.contracts, function (item) {
                        return item.status === 0;
                    }).length;

                })
                .finally(() => {
                    $scope.formTableProcessing = false;
                });
        };

        $scope.$on('$stateChangeStart', function (event) {
            if (isDataChanged) {
                let confirmBack = confirm('Dữ liệu đã bị thay đổi. Bạn chắc chắn muốn chuyển?');
                if (confirmBack === false) {
                    isDataChanged = false;
                    event.preventDefault();
                }
            }
        });

        $scope.showContractInfoById = function (data) {
            // let selectedCus = angular.copy($scope.contracts[rowIndex]);
            $scope.$parent.getContractsByCus(data);
        };

        $scope.handleByCellBtn = function (e) {

        };

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
