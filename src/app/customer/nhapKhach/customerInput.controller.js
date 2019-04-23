(function () {
    'use strict';

    angular.module('ati.customer')
        .controller('CustomerInputController', CustomerInputController);

    function CustomerInputController($scope, $timeout, ContractManager, Restangular, storeList, customerSource, AlertService, AdminService) {
        let storeArr = angular.copy(Restangular.stripRestangular(storeList));
        let customerS = angular.copy(Restangular.stripRestangular(customerSource));

        let typeContract = [
            {name: "", value: false},
            {name: "Đáo", value: true},
            {name: "Thu về", value: true},
            {name: "Lãi đứng", value: true},
            {name: "Chốt", value: true},
            {name: "Bễ", value: true}
        ];

        // AdminService.checkRole(['customer.remove']).then(function (allowRole) {
        //     $scope.roleRemove = allowRole;
        // });

        $scope.userSelected = {storeId: $scope.$parent.storeSelected.storeId, id: $scope.$parent.storeSelected.userId};
        $scope.stores = [];
        $scope.usersByStore = [];

        let isPaid = false, isNeedPay = false, currRow = 0, currCol = 0;
        $scope.isPaste = false;
        $scope.$watch('isPaste', function (newValue, oldValue) {
            if (newValue) {
                _.forEach($scope.customers, (item, index) => {
                    if (!item.customerId) {
                        let customerItem = _.find(customerS, {name: item.customer.name});
                        if (customerItem) {
                            item.customerId = customerItem._id;
                            item.customer = customerItem;
                        }
                    }

                    if (!item.customerCode || !item.creator || !item.storeCode || !item.storeId) {
                        item.customerCode = $scope.$parent.storeSelected.userCode;
                        item.creator = $scope.$parent.storeSelected.userId;
                        item.storeId = selectedStoreId;
                        item.storeCode = storeCode;
                    }

                    if (item.isCustomerNew === "TRUE" || item.isCustomerNew === "FALSE") {
                        item.isCustomerNew = item.isCustomerNew === "TRUE";
                    }

                    item.isHdThuVe = item.statusType === "Thu về";
                    item.isHdChot = item.statusType === "Chốt";
                    item.isHdBe = item.statusType === "Bễ";
                    item.isHdDao = item.statusType === "Đáo";
                    item.isHdLaiDung = item.statusType === "Lãi đứng";

                    if (item.isHdLaiDung) {
                        item.actuallyCollectedMoney = item.loanMoney;
                    }

                    if (item.totalMoneyNeedPay === "" || item.totalMoneyNeedPay === 0) {
                        if (item.paidMoney > 0) {
                            item.totalMoneyNeedPay = item.actuallyCollectedMoney - item.paidMoney;
                        }
                    }

                });

                $scope.isPaste = false;
                hotTableInstance.getInstance().render();
            }
        });

        let selectedStoreId = $scope.$parent.storeSelected.storeId;
        let storeCode = "";
        let storeItem = _.find(storeArr, {_id: selectedStoreId});
        if (storeItem) {
            storeCode = storeItem.storeId;
        }

        let customerItem = {
            _id: "",
            customer: {
                name: "",
                _id: ""
            },
            customerId: "",
            loanMoney: "",
            actuallyCollectedMoney: "",
            loanDate: "",
            createdAt: "",
            dateEnd: "",
            isHdLaiDung: false,
            isHdDao: false,
            isHdThuVe: false,
            isHdChot: false,
            isHdBe: false,
            isCustomerNew: false,
            paidMoney: "",
            storeId: selectedStoreId,
            storeCode: storeCode,
            customerCode: $scope.$parent.storeSelected.userCode,
            creator: $scope.$parent.storeSelected.userId
        };

        $scope.customers = [];
        $scope.customers.push(angular.copy(customerItem));

        const container = document.getElementById('hotTable');
        let columnsSetting = [
            {
                data: 'statusType',
                type: 'dropdown',
                width: 70
            },
            {
                data: 'customer.name',
                type: 'text',
                width: 100
            },
            {
                data: 'createdAt',
                type: 'date',
                dateFormat: 'DD/MM/YYYY',
                correctFormat: true,
                width: 70,
            },
            {
                data: 'loanMoney',
                type: 'numeric',
                numericFormat: {
                    pattern: '#,###',
                    culture: 'en-US' // this is the default culture, set up for USD
                },
                width: 60
            },
            {
                data: 'actuallyCollectedMoney',
                type: 'numeric',
                numericFormat: {
                    pattern: '#,###'
                },
                width: 60,
            },
            {
                data: 'loanDate',
                type: 'numeric',
                numericFormat: {
                    pattern: '#,###'
                },
                width: 60,
            },
            {
                data: 'paidMoney',
                type: 'numeric',
                numericFormat: {
                    pattern: '#,###'
                },
                width: 60,
            },
            {
                data: 'totalMoneyNeedPay',
                type: 'numeric',
                numericFormat: {
                    pattern: '#,###'
                },
                width: 60,
            },
            {
                data: 'dateEnd',
                type: 'date',
                dateFormat: 'DD/MM/YYYY',
                correctFormat: true,
                width: 70,
            },
            {
                data: 'isCustomerNew',
                type: 'checkbox',
                checkedTemplate: 'true',
                uncheckedTemplate: 'false',
                width: 55,
            },
            {
                data: 'actionDel',
                type: 'text',
                width: 25,
                readOnly: true
            }
        ];
        let colHeaderSetting = [
            'Loại',
            'Họ và tên',
            'Ngày vay',
            'Gói vay',
            'Thực thu',
            'Số ngày vay',
            'Đã đóng',
            'Dư nợ',
            'Ngày chốt',
            'Khách mới',
            ' '
        ];
        let userIdSelected = $scope.$parent.storeSelected.userId;
        const hotTableInstance = new Handsontable(container, {
            data: $scope.customers,
            columns: columnsSetting,
            stretchH: 'all',
            copyPaste: true,
            // autoWrapRow: true,
            // wordWrap: false,
            // preventOverflow: 'horizontal',
            // fixedColumnsLeft: 3,
            // manualColumnFreeze: true,
            // viewportColumnRenderingOffset: 100,
            // viewportRowRenderingOffset: 100,
            rowHeights: 35,
            licenseKey: 'non-commercial-and-evaluation',
            colHeaders: colHeaderSetting,
            beforeRemoveRow: function (index, amount) {
                if (hotTableInstance.countRows() <= 1)
                    return false;
            },
            afterCreateRow: function (index) {
                setTimeout(function () {
                    hotTableInstance.selectCell(index, 0);
                }, 1);
            },
            cells: function (row, col) {
                let cellPrp = {};
                cellPrp.className = "hot-normal";
                if (!userIdSelected) {
                    cellPrp.readOnly = true;
                }

                if (col === 10)
                    cellPrp.renderer = columnRenderer;

                if (col === 0) {
                    cellPrp.type = 'dropdown';
                    cellPrp.source = _.map(typeContract, 'name');
                    cellPrp.strict = true;
                }

                if (col === 1) {
                    cellPrp.type = 'dropdown';
                    cellPrp.source = _.map(customerS, 'name');
                    cellPrp.allowInvalid = true;
                    cellPrp.strict = false;
                }

                // if (col === 3) {
                //     cellPrp.renderer = columnNumericRenderer;
                // }

                // if (col === 3) {
                //     cellPrp = {
                //         format: '#,###',
                //         language: 'en-US'
                //     };
                // }

                // if (col === 3) {
                //     cellPrp.type = 'date';
                //     cellPrp.dateFormat = 'DD/MM/YYYY';
                //     cellPrp.defaultDate = '01/01/1900';
                //     cellPrp.correctFormat = true;
                // }

                if (!userIdSelected)
                    cellPrp.readOnly = true;

                return cellPrp;
            },
            afterOnCellMouseDown: function (event, rowCol, TD) {
                if (event.realTarget.className.indexOf('delRow') >= 0) {
                    $scope.delCustomer(rowCol.row, $scope.customers[rowCol.row]);
                }
            },
            beforeKeyDown: function (event) {
                if (event.keyCode === 13 || event.keyCode === 9) {
                    isPaid = currCol === 6;
                    isNeedPay = currCol === 7;
                }
            },
            afterSelection: function (row, col, row2, col2) {
                currRow = row;
                currCol = col;
            },
            afterChange: function (source, changes) {
                $scope.isPaste = changes === 'paste';
                if (changes === 'edit') {
                    let rowChecked = source[0][0];
                    let newValue = source[0][3];

                    if (source[0][1] === "statusType") {
                        let typeItem = _.find(typeContract, {name: newValue});
                        $scope.customers[rowChecked].isHdLaiDung = false;
                        $scope.customers[rowChecked].isHdDao = false;
                        if (typeItem) {
                            $scope.customers[rowChecked].isHdDao = typeItem.name === "Đáo";
                            $scope.customers[rowChecked].isHdLaiDung = typeItem.name === "Lãi đứng";
                            $scope.customers[rowChecked].isHdThuVe = typeItem.name === "Thu về";
                            $scope.customers[rowChecked].isHdChot = typeItem.name === "Chốt";
                            $scope.customers[rowChecked].isHdBe = typeItem.name === "Bễ";
                        }
                    }

                    if (source[0][1] === "loanMoney" && $scope.customers[rowChecked].isHdLaiDung) {
                        $scope.customers[rowChecked].actuallyCollectedMoney = newValue;
                    }

                    if (source[0][1] === "customer.name") {
                        let cusItem = _.find(customerS, {name: newValue});
                        if (cusItem) {
                            $scope.customers[rowChecked].customer._id = cusItem._id;
                            $scope.customers[rowChecked].customerId = cusItem._id;
                        }
                        else {
                            $scope.customers[rowChecked].customer._id = "";
                            $scope.customers[rowChecked].customerId = "";
                        }

                        // console.log('row: ' + source[0][0]);
                        // console.log('col: ' + source[0][1]);
                        // console.log('old value: ' + source[0][2]);
                        // console.log('new value: ' + source[0][3]);
                    }

                    if (source[0][1] === "actuallyCollectedMoney") {
                        hotTableInstance.setDataAtCell(rowChecked, 6, "");
                        hotTableInstance.setDataAtCell(rowChecked, 7, "");
                    }

                    if (source[0][1] === "paidMoney" && isPaid) {
                        let realMoney = parseInt($scope.customers[rowChecked].actuallyCollectedMoney);
                        if (realMoney > 0) {
                            let paidMoney = parseInt($scope.customers[rowChecked].paidMoney);
                            let totalMoneyNeedPay = realMoney - paidMoney;
                            hotTableInstance.setDataAtCell(rowChecked, 7, totalMoneyNeedPay >= 0 ? totalMoneyNeedPay : "");
                        }
                    }

                    if (source[0][1] === "totalMoneyNeedPay" && isNeedPay) {
                        let realMoney = parseInt($scope.customers[rowChecked].actuallyCollectedMoney);
                        if (realMoney > 0) {
                            let totalMoneyNeedPay = parseInt($scope.customers[rowChecked].totalMoneyNeedPay);
                            let moneyPaid = realMoney - totalMoneyNeedPay;
                            hotTableInstance.setDataAtCell(rowChecked, 6, moneyPaid >= 0 ? moneyPaid : "");
                        }
                    }

                }
            }
        });

        AdminService.checkRole(['customer.remove']).then(function (allowRole) {
            $scope.roleRemove = allowRole;

            if (!allowRole) {
                columnsSetting.splice(-1, 1);
                colHeaderSetting.splice(-1, 1);

                hotTableInstance.updateSettings({
                    columns: columnsSetting,
                    colHeaders: colHeaderSetting
                });

                hotTableInstance.getInstance().render();
            }
        });

        $scope.formProcessing = false;
        $scope.fileImgDoc = "";
        $scope.showResource = false;

        function columnRenderer(instance, td, row, col, prop, value, cellProperties) {
            Handsontable.renderers.TextRenderer.apply(this, arguments);
            if (cellProperties.prop === "actionDel") {
                td.innerHTML = '<button class="btnAction btn btn-danger delRow" value="' + value + '" style="width:22px;"><span class="fa fa-trash delRow"></span></button>';
                return;
            }
        }

        $scope.delCustomer = function (rowIndex, customer) {
            if ($scope.customers.length === 1) {
                $scope.customers[0] = angular.copy(customerItem);

                hotTableInstance.updateSettings({
                    data: $scope.customers

                });

                hotTableInstance.getInstance().render();

                return;
            }

            $scope.customers.splice(rowIndex, 1);

            hotTableInstance.updateSettings({
                data: $scope.customers

            });

            hotTableInstance.getInstance().render();
        };

        $timeout(function () {
            // hotTableInstance = hotRegisterer.getInstance('my-handsontable');

            document.addEventListener('keydown', function (e) {
                if (e.which === 9 && hotTableInstance) {
                    if (!hotTableInstance.getSelected())
                        return;

                    let rowIndex = $('.current').parent().index();
                    let colIndex = hotTableInstance.getSelected()[1];
                    let totalCols = hotTableInstance.countCols();
                    let totalRows = hotTableInstance.countRows();
                    if (colIndex === (totalCols - 1) && rowIndex === (totalRows - 1)) {
                        // if (!$scope.customers[rowIndex].name) {
                        //     toastr.error("Họ và tên không được để trống!");
                        //     setTimeout(function () {
                        //         hotTableInstance.selectCell(rowIndex, 0);
                        //     }, 1);
                        //
                        //     return;
                        // }

                        hotTableInstance.alter("insert_row", totalRows + 1);
                        $scope.customers[totalRows] = angular.copy(customerItem);
                    }
                }
            }, true);

        }, 0);

        $scope.saveCustomer = () => {
            let checkValid = true;
            let indexInvalid = -1;
            let colIndex = -1;
            let validCustomers = angular.copy($scope.customers);

            _.filter(validCustomers, (item, index) => {
                if (!item.customer.name || !item.loanMoney
                    // || !item.paidMoney
                    // || !item.totalMoneyNeedPay
                    || (!item.isHdLaiDung && (!item.actuallyCollectedMoney || !item.loanDate))) {

                    if (!item.customer.name)
                        colIndex = 1;
                    else if (!item.loanMoney)
                        colIndex = 3;
                    // else if (!item.paidMoney)
                    //     colIndex = 6;
                    // else if (!item.totalMoneyNeedPay)
                    //     colIndex = 7;

                    if (!item.isHdLaiDung && colIndex < 0) {
                        if (!item.actuallyCollectedMoney)
                            colIndex = 4;
                        else if (!item.loanDate)
                            colIndex = 5;
                        else if (!item.dateEnd)
                            colIndex = 8;
                    }

                    checkValid = false;
                    indexInvalid = index;
                    return false;
                }
            });

            if (!checkValid) {
                hotTableInstance.selectCell(indexInvalid, colIndex);

                AlertService.replaceAlerts({
                    type: 'error',
                    message: "Chưa nhập đủ thông tin hợp đồng!"
                });
                return;
            }

            let customers = _.map(validCustomers, (item) => {
                if (($scope.$parent.isAccountant || $scope.$parent.isRoot) && !item._id) {
                    item.storeId = $scope.userSelected.storeId;
                    item.creator = $scope.userSelected.id;
                    item.isRemove = true;
                }

                return item;
            });

            ContractManager
                .one('insertCusAndContract')
                .customPOST(customers)
                .then((items) => {
                    $scope.customers = [];
                    $scope.customers.push(angular.copy(customerItem));
                    toastr.success('Thêm dữ liệu khách thành công!');

                    hotTableInstance.updateSettings({
                        data: $scope.customers

                    });

                    hotTableInstance.getInstance().render();
                })
                .catch((error) => {
                    toastr.error("Có lỗi xảy ra! Hãy thử lại");
                });
        };

    }
})();