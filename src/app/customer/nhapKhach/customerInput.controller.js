(function () {
    'use strict';

    angular.module('ati.customer')
        .controller('CustomerInputController', CustomerInputController);

    function CustomerInputController($scope, $timeout, CONTRACT_EVENT, hotRegisterer, ContractManager, Restangular, storeList, customerSource, AlertService, AdminService) {
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

        AdminService.checkRole(['customer.remove']).then(function (allowRole) {
            $scope.roleRemove = allowRole;
        });

        $scope.userSelected = {storeId: $scope.$parent.storeSelected.storeId, id: $scope.$parent.storeSelected.userId};
        $scope.stores = [];
        $scope.usersByStore = [];

        $scope.$on(CONTRACT_EVENT.RESIZE_TABLE, function (event, data) {
            hotInstance.render();
        });

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
                hotInstance.render();
            }
        });

        let selectedStoreId = $scope.$parent.storeSelected.storeId;
        let storeCode = "";
        let storeItem = _.find(storeArr, {_id: selectedStoreId});
        if (storeItem) {
            storeCode = storeItem.storeId;
        }

        // let isAccountant = $scope.$parent.isAccountant;
        // let isRoot = $scope.$parent.isRoot;

        // let currentUser = Auth.getSession();
        let hotInstance = "";
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

        $scope.formProcessing = false;
        $scope.fileImgDoc = "";
        $scope.showResource = false;
        $scope.customers = [];
        $scope.customers.push(angular.copy(customerItem));

        $scope.settings = {
            beforeRemoveRow: function (index, amount) {
                if (hotInstance.countRows() <= 1)
                    return false;
            },
            afterCreateRow: function (index) {
                setTimeout(function () {
                    hotInstance.selectCell(index, 0);
                }, 1);
            },
            cells: function (row, col) {
                let cellPrp = {};
                cellPrp.className = "hot-normal";
                if (!$scope.$parent.storeSelected.userId) {
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
                //     cellPrp.type = 'date';
                //     cellPrp.dateFormat = 'DD/MM/YYYY';
                //     cellPrp.defaultDate = '01/01/1900';
                //     cellPrp.correctFormat = true;
                // }

                if (!$scope.$parent.storeSelected.userId)
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
                        let customerItem = _.find(customerS, {name: newValue});
                        if (customerItem) {
                            $scope.customers[rowChecked].customer._id = customerItem._id;
                            $scope.customers[rowChecked].customerId = customerItem._id;
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
                        hotInstance.setDataAtCell(rowChecked, 6, "");
                        hotInstance.setDataAtCell(rowChecked, 7, "");
                    }

                    if (source[0][1] === "paidMoney" && isPaid) {
                        let realMoney = parseInt($scope.customers[rowChecked].actuallyCollectedMoney);
                        if (realMoney > 0) {
                            let paidMoney = parseInt($scope.customers[rowChecked].paidMoney);
                            let totalMoneyNeedPay = realMoney - paidMoney;
                            hotInstance.setDataAtCell(rowChecked, 7, totalMoneyNeedPay >= 0 ? totalMoneyNeedPay : "");
                        }
                    }

                    if (source[0][1] === "totalMoneyNeedPay" && isNeedPay) {
                        let realMoney = parseInt($scope.customers[rowChecked].actuallyCollectedMoney);
                        if (realMoney > 0) {
                            let totalMoneyNeedPay = parseInt($scope.customers[rowChecked].totalMoneyNeedPay);
                            let moneyPaid = realMoney - totalMoneyNeedPay;
                            hotInstance.setDataAtCell(rowChecked, 6, moneyPaid >= 0 ? moneyPaid : "");
                        }
                    }

                }
            },
            stretchH: "all",
            autoWrapRow: true,
            colHeaders: true,
            minSpareRows: 0,
            // wordWrap: false,
            // fixedColumnsLeft: 3,
            // manualColumnFreeze: true
        };

        function columnRenderer(instance, td, row, col, prop, value, cellProperties) {
            Handsontable.renderers.TextRenderer.apply(this, arguments);
            if (cellProperties.prop === "actionDel") {
                td.innerHTML = '<button class="btnAction btn btn-danger delRow" value="' + value + '"><span class="fa fa-trash"></span>&nbsp;Xóa</button>';
                return;
            }
        }

        $scope.delCustomer = function (rowIndex, customer) {
            if ($scope.customers.length === 1) {
                $scope.customers[0] = angular.copy(customerItem);

                setTimeout(function () {
                    $scope.$apply();
                    hotInstance.render();
                }, 0);
                return;
            }

            $scope.customers.splice(rowIndex, 1);

            setTimeout(function () {
                $scope.$apply();
                hotInstance.render();
            }, 0);
        };

        $timeout(function () {
            hotInstance = hotRegisterer.getInstance('my-handsontable');

            document.addEventListener('keydown', function (e) {
                if (e.which === 9 && hotInstance) {
                    if (!hotInstance.getSelected())
                        return;

                    let rowIndex = $('.current').parent().index();
                    let colIndex = hotInstance.getSelected()[1];
                    let totalCols = hotInstance.countCols();
                    let totalRows = hotInstance.countRows();
                    if (colIndex === (totalCols - 1) && rowIndex === (totalRows - 1)) {
                        // if (!$scope.customers[rowIndex].name) {
                        //     toastr.error("Họ và tên không được để trống!");
                        //     setTimeout(function () {
                        //         hotInstance.selectCell(rowIndex, 0);
                        //     }, 1);
                        //
                        //     return;
                        // }

                        hotInstance.alter("insert_row", totalRows + 1);
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
                hotInstance.selectCell(indexInvalid, colIndex);

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
                })
                .catch((error) => {
                    toastr.error("Có lỗi xảy ra! Hãy thử lại");
                });
        };

    }
})();