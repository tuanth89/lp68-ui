(function () {
    'use strict';

    angular.module('ati.contract')
        .controller('ContractOldController', ContractOldController);

    function ContractOldController($scope, CONTRACT_EVENT, $timeout, StoreManager, hotRegisterer, customerSource, ContractManager, Restangular, Auth, AlertService, CustomerManager, storeList) {
        let currentUser = Auth.getSession();
        let storeArr = angular.copy(Restangular.stripRestangular(storeList));
        let customerS = angular.copy(Restangular.stripRestangular(customerSource));
        // $scope.customerSource = _.map(customerS, 'name').join(',');
        let typeContract = [
            {name: "Lãi đứng", value: true},
            {name: "Đáo", value: true}
        ];

        let selectedStoreId = $scope.$parent.storeSelected.storeId;
        let storeCode = "";
        let storeItem = _.find(storeArr, {_id: selectedStoreId});
        if (storeItem) {
            storeCode = storeItem.storeId;
        }

        $scope.userSelected = {storeId: $scope.$parent.storeSelected.storeId, id: $scope.$parent.storeSelected.userId};
        $scope.stores = [];
        $scope.usersByStore = [];

        $scope.selectedStoreEvent = function (item) {
            $scope.userSelected.id = "";
            StoreManager.one(item._id).one('listUserByStore').get()
                .then((store) => {
                    $scope.usersByStore = _.map(store.staffs, (item) => {
                        if (!item.isAccountant)
                            return item;
                    });
                    // $scope.usersByStore = angular.copy(Restangular.stripRestangular(store.staffs));
                }, (error) => {
                })
                .finally(() => {
                });

            // CustomerManager.one('list').one('autoComplete').getList("", {storeId: item._id})
            //     .then((customers) => {
            //         customerS = angular.copy(Restangular.stripRestangular(customers));
            //     }, (error) => {
            //     })
            //     .finally(() => {
            //     });
        };

        $scope.selectedStaffEvent = function (item) {
            CustomerManager.one('list').one('autoComplete').getList("", {
                storeId: $scope.userSelected.storeId,
                userId: item._id
            })
                .then((customers) => {
                    customerS = angular.copy(Restangular.stripRestangular(customers));
                }, (error) => {
                })
                .finally(() => {
                });
        };

        $scope.$on(CONTRACT_EVENT.RESIZE_TABLE, function (event, data) {
            hotInstance.render();
        });

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
            isCustomerNew: false,
            paidMoney: "",
            storeId: selectedStoreId,
            storeCode: storeCode,
            customerCode: $scope.$parent.storeSelected.userCode,
            creator: $scope.$parent.storeSelected.userId
        };

        $scope.customers = [];
        $scope.customers.push(angular.copy(customerItem));
        // $scope.customers = angular.copy(Restangular.stripRestangular(contracts));

        $scope.settings = {
            // contextMenu: {
            //     items: {
            //         'row_above': {name: 'Thêm dòng trên'},
            //         'row_below': {name: 'Thêm dòng dưới'},
            //         'remove_row': {name: 'Xóa'}
            //     }
            //     // callback: function (key, options) {
            //     //     if (key === 'remove_row') {
            //     //         if (hotInstance.countRows() > 1) {
            //     //             var indexArr = hot.getSelected();
            //     //             var selectedData = hot.getDataAtRow(indexArr[0]);
            //     //         }
            //     //     }
            //     // }
            // },
            beforeRemoveRow: function (index, amount) {
                if (hotInstance.countRows() <= 1)
                    return false;
            },
            afterCreateRow: function (index) {
                if (hotInstance.getSelected().length === 0)
                    return;
                setTimeout(function () {
                    let colIndex = hotInstance.getSelected()[1];
                    if (colIndex === 4)
                        hotInstance.selectCell(index, 0);
                }, 1);
            },
            cells: function (row, col) {
                let cellPrp = {};
                let item = $scope.customers[row];
                if (typeof item === 'object' && item._id) {
                    cellPrp.readOnly = true;
                }
                else
                    cellPrp.className = "hot-normal";

                if (col === 0) {
                    cellPrp.type = 'dropdown';
                    cellPrp.source = _.map(typeContract, 'name');
                    cellPrp.strict = true;
                }

                if (col === 1) {
                    cellPrp.type = 'dropdown';
                    cellPrp.source = _.map(customerS, 'name');
                    cellPrp.strict = true;
                }

                if (col === 10) {
                    cellPrp.renderer = columnRenderer;
                }

                if (!$scope.$parent.storeSelected.userId)
                    cellPrp.readOnly = true;

                return cellPrp;
            },
            afterOnCellMouseDown: function (event, rowCol, td) {
                if (event.realTarget.className.indexOf('delRow') >= 0) {
                    $scope.delContract(rowCol.row, $scope.customers[rowCol.row]._id);
                }

                let now = new Date().getTime();
                if (!(td.lastClick && now - td.lastClick < 200)) {
                    td.lastClick = now;
                    return;
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

            // beforeAutofill: (data, coords) => {
            //     _.forEach(data, (item, index) => {
            //         if (!item.customerId) {
            //             let customerItem = _.find(customerS, {name: item.customer.name});
            //             if (customerItem) {
            //                 item.customerId = customerItem._id;
            //                 item.customer = customerItem;
            //             }
            //         }
            //
            //         if (!item.customerCode || !item.creator || !item.storeCode || !item.storeId) {
            //             item.customerCode = $scope.$parent.storeSelected.userCode;
            //             item.creator = $scope.$parent.storeSelected.userId;
            //             item.storeId = selectedStoreId;
            //             item.storeCode = storeCode;
            //         }
            //
            //         if (item.isCustomerNew === "TRUE" || item.isCustomerNew === "FALSE") {
            //             item.isCustomerNew = item.isCustomerNew === "TRUE";
            //         }
            //
            //     });
            // }
            // ,
            afterChange: function (source, changes) {
                if (changes === 'edit') {
                    let rowChecked = source[0][0];
                    let newValue = source[0][3];

                    if (source[0][1] === "statusType") {
                        let typeItem = _.find(typeContract, {name: newValue});
                        $scope.customers[rowChecked].isHdLaiDung = false;
                        $scope.customers[rowChecked].isHdDao = false;
                        if (typeItem) {
                            if (typeItem.name === "Đáo") {
                                $scope.customers[rowChecked].isHdDao = true;
                            }
                            else {
                                $scope.customers[rowChecked].isHdLaiDung = true;
                            }
                        }
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
                            hotInstance.setDataAtCell(rowChecked, 7, totalMoneyNeedPay >= 0 ? totalMoneyNeedPay : 0);
                        }
                    }

                    if (source[0][1] === "totalMoneyNeedPay" && isNeedPay) {
                        let realMoney = parseInt($scope.customers[rowChecked].actuallyCollectedMoney);
                        if (realMoney > 0) {
                            let totalMoneyNeedPay = parseInt($scope.customers[rowChecked].totalMoneyNeedPay);
                            let moneyPaid = realMoney - totalMoneyNeedPay;
                            hotInstance.setDataAtCell(rowChecked, 6, moneyPaid >= 0 ? moneyPaid : 0);
                        }
                    }

                }
            },
            stretchH: "all",
            autoWrapRow: true,
            colHeaders: true,
            minSpareRows: 0
            // strict: true
        };

        let isPaid = false, isNeedPay = false, currRow = 0, currCol = 0;

        function columnRenderer(instance, td, row, col, prop, value, cellProperties) {
            Handsontable.renderers.TextRenderer.apply(this, arguments);

            if (cellProperties.prop === "actionDel") {
                td.innerHTML = '<button class="btnAction btn btn-danger delRow" value="' + value + '" style="width:22px;"><span class="fa fa-trash"></span>&nbsp;</button>';
                return;
            }
        }

        $timeout(function () {
            hotInstance = hotRegisterer.getInstance('my-handsontable');

            $scope.onAfterInit = function () {
                hotInstance.validateCells();
            };

            // hotInstance.addHook('afterSelectionEnd',
            //     function (rowId, colId, rowEndId, colEndId) {
            //         if (colId === 2 || colId === 3)
            //             hotInstance.setDataAtCell(rowId, 4, 100);
            //     });

            // hotInstance.addHook('afterChange',
            //     function(changes, source) {
            //         if (changes !== null) {
            //             changes.forEach(function(item) {
            //                 if (hotInstance.propToCol(item[1]) === 2 || hotInstance.propToCol(item[1]) === 3) {
            //                     hotInstance.setDataAtCell(item[0], 4, 100);
            //                 }
            //             });
            //         }
            //     }), hotInstance;

            // hotInstance.addHook('afterCreateRow', function (index, amount) {
            //     hotInstance.selectCell(index, 0);
            // });

            document.addEventListener('keydown', function (e) {
                if (e.which === 9 && hotInstance) {
                    if (!hotInstance.getSelected())
                        return;

                    let rowIndex = $('.current').parent().index();
                    let colIndex = hotInstance.getSelected()[1];
                    let totalCols = hotInstance.countCols();
                    let totalRows = hotInstance.countRows();
                    if (colIndex === (totalCols - 1) && rowIndex === (totalRows - 1)) {
                        if (!$scope.customers[rowIndex].customerId) {
                            toastr.error("Chưa nhập khách hàng hoặc không tồn tại khách hàng!");
                            setTimeout(function () {
                                hotInstance.selectCell(rowIndex, 1);
                            }, 1);

                            return;
                        }

                        // customerItem.createdAt = $scope.filter.date;
                        $scope.customers.push(angular.copy(customerItem));
                        // hotInstance.alter("insert_row", totalRows + 1);
                    }
                }
            }, true);

        }, 0);


        $scope.saveContract = () => {
            let checkValid = true;
            let indexInvalid = -1;
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

            });

            let validCustomers = angular.copy($scope.customers);

            _.filter(validCustomers, (item, index) => {
                if (!item.customerId || !item.loanMoney || !item.actuallyCollectedMoney || !item.loanDate
                    || !item.paidMoney || !item.totalMoneyNeedPay || !item.dateEnd) {

                    checkValid = false;
                    indexInvalid = index;
                    return false;
                }
            });

            if (!checkValid) {
                hotInstance.selectCell(indexInvalid, 1);

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

            console.log(validCustomers);

            //
            ContractManager.one("contractOld").customPOST(customers)
                .then((results) => {
                    $scope.customers = [];
                    $scope.customers.push(angular.copy(customerItem));

                    AlertService.replaceAlerts({
                        type: 'success',
                        message: "Tạo hợp đồng cũ thành công!"
                    });
                })
                .catch((error) => {
                    console.log(error);
                    AlertService.replaceAlerts({
                        type: 'error',
                        message: "Tạo hợp đồng cũ thất bại. Hãy thử lại sau!"
                    });
                })
                .finally(err => {
                });
        };

        $scope.delContract = function (rowIndex, contractId) {
            if (!contractId && $scope.customers.length === 1) {
                return;
            }

            if (!contractId) {
                $scope.customers.splice(rowIndex, 1);
                setTimeout(function () {
                    $scope.$apply();
                }, 0);

                hotInstance.render();
            }
        };
    }
})();