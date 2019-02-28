(function () {
    'use strict';

    angular.module('ati.contract')
        .controller('CustomerNewController', CustomerNewController);

    function CustomerNewController($scope, CONTRACT_EVENT, $timeout, StoreManager, hotRegisterer, customerSource, ContractManager, Restangular, Auth, AlertService, CustomerManager, AdminService) {
        let currentUser = Auth.getSession();
        let customerS = angular.copy(Restangular.stripRestangular(customerSource));
        $scope.customerSource = _.map(customerS, 'name').join(',');

        let selectedStoreId = $scope.$parent.storeSelected.storeId;

        AdminService.checkRole(['contract.remove']).then(function (allowRole) {
            $scope.roleRemove = allowRole;
        });

        $scope.userSelected = {storeId: $scope.$parent.storeSelected.storeId, id: $scope.$parent.storeSelected.userId};
        $scope.stores = [];
        $scope.usersByStore = [];

        $scope.$on('$viewContentLoaded', function (event, data) {
            $scope.getData();

            // StoreManager.one('listForUser').getList()
            //     .then((stores) => {
            //         $scope.stores = angular.copy(Restangular.stripRestangular(stores));
            //     });
        });

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


        $scope.filter = {date: ""};
        $scope.$watch('filter.date', function (newValue, oldValue) {
            $timeout(function () {
                if (newValue != oldValue) {
                    $scope.getData();
                }
            }, 100);
        });

        $scope.$on(CONTRACT_EVENT.RESIZE_TABLE, function (event, data) {
            hotInstance.render();
        });

        $scope.onAfterInit = function () {
            hotInstance.validateCells();
        };

        if ($scope.$parent.isAccountant)
            $scope.filter.date = moment(new Date()).subtract(1, "days").format("YYYY-MM-DD");
        else
            $scope.filter.date = moment(new Date()).format("YYYY-MM-DD");

        let hotInstance = "";
        let customerItem = {
            _id: "",
            contractNo: "",
            customer: {
                name: "",
                phone: "",
                _id: ""
            },
            customerId: "",
            loanMoney: "",
            actuallyCollectedMoney: "",
            loanDate: "",
            createdAt: $scope.filter.date,
            isHdLaiDung: false,
            isCustomerNew: true,
            payNow: "",
            storeId: selectedStoreId,
            creator: currentUser._id
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

                // if (moment($scope.filter.date, "YYYY-MM-DD").isBefore(moment().format("YYYY-MM-DD"))) {
                //     cellPrp.readOnly = true;
                //     cellPrp.className = "handsontable-cell-disable";
                //     return cellPrp;
                // }

                // cellPrp.readOnly = true;

                if (col === 1) {
                    cellPrp.type = 'dropdown';
                    cellPrp.source = _.map(customerS, 'name');
                    cellPrp.strict = true;

                    // hotInstance.updateSettings($scope.settings);
                    // cellPrp.datarows = $scope.customerSource;
                    // cellPrp.editor = 'select2';
                    // cellPrp.renderer = customDropdownRenderer;
                    // cellPrp.width = '200px';
                    // cellPrp.select2Options = {
                    //     data: optionsList,
                    //     dropdownAutoWidth: true,
                    //     width: 'resolve'
                    // };
                }
                if (col === 7) {
                    cellPrp.renderer = columnRenderer;
                }

                if (!$scope.$parent.storeSelected.userId)
                    cellPrp.readOnly = true;

                return cellPrp;
            },
            afterOnCellMouseDown: function (event, rowCol, TD) {
                if (event.realTarget.className.indexOf('delRow') >= 0) {
                    $scope.delContract(rowCol.row, $scope.customers[rowCol.row]._id);
                }
            },
            afterChange: function (source, changes) {
                if (changes === 'edit') {
                    let rowChecked = source[0][0];
                    let newValue = source[0][3];

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

                    // if (source[0][1] === "payNow") {
                    //     if (newValue > $scope.customers[rowChecked].loanDate) {
                    //         toastr.error("Số ngày đóng không được lớn hơn số ngày vay!");
                    //         hotInstance.selectCell(rowChecked, 5);
                    //         hotInstance.setDataAtCell(rowChecked, 5, "");
                    //     }
                    // }
                    // if (source[0][1] === "loanDate") {
                    //     if (newValue < $scope.customers[rowChecked].payNow) {
                    //         toastr.error("Số ngày đóng không được lớn hơn số ngày vay!");
                    //         hotInstance.selectCell(rowChecked, 5);
                    //         hotInstance.setDataAtCell(rowChecked, 5, "");
                    //     }
                    // }
                }
            },
            stretchH: "all",
            autoWrapRow: true,
            colHeaders: true,
            minSpareRows: 0
            // strict: true
        };

        function columnRenderer(instance, td, row, col, prop, value, cellProperties) {
            Handsontable.renderers.TextRenderer.apply(this, arguments);
            if (cellProperties.prop === "actionDel") {
                td.innerHTML = '<button class="btnAction btn btn-danger delRow" value="' + value + '"><span class="fa fa-trash"></span>&nbsp;Xóa</button>';
                return;
            }
        }

        $scope.getData = function () {
            ContractManager.one("circulation").one("all")
                .getList("", {date: $scope.filter.date, type: 0, storeId: selectedStoreId})
                .then(function (resp) {
                    $scope.customers = angular.copy(Restangular.stripRestangular(resp));

                    customerItem.createdAt = $scope.filter.date;
                    // if (!moment($scope.filter.date, "YYYY-MM-DD").isBefore(moment().format("YYYY-MM-DD"))) {
                    //
                    // }

                    // $scope.customers.push(angular.copy(customerItem));
                    let userNews = angular.copy($scope.$parent.newUsers);
                    if (userNews.length > 0) {
                        _.each(userNews, (customer) => {
                            let customerItem = {
                                _id: "",
                                contractNo: "",
                                customer: {
                                    name: customer.name,
                                    phone: "",
                                    _id: customer._id
                                },
                                customerId: customer._id,
                                loanMoney: "",
                                actuallyCollectedMoney: "",
                                loanDate: "",
                                createdAt: $scope.filter.date,
                                isHdLaiDung: false,
                                isCustomerNew: true,
                                payNow: "",
                                storeId: selectedStoreId,
                                creator: currentUser._id
                            };

                            $scope.customers.push(customerItem);
                        });
                    }
                    else
                        $scope.customers.push(angular.copy(customerItem));

                    setTimeout(function () {
                        hotInstance.render();
                    }, 0);
                });
        };

        $timeout(function () {
            hotInstance = hotRegisterer.getInstance('my-handsontable');

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

                        customerItem.createdAt = $scope.filter.date;
                        $scope.customers.push(angular.copy(customerItem));
                        // hotInstance.alter("insert_row", totalRows + 1);
                    }
                }
            }, true);
        }, 0);

        $scope.saveContract = () => {
            if (($scope.$parent.isAccountant || $scope.$parent.isRoot) && !$scope.userSelected.id) {
                AlertService.replaceAlerts({
                    type: 'error',
                    message: "Hãy chọn nhân viên thuộc cửa hàng!"
                });
                return;
            }

            let validCustomers = angular.copy($scope.customers);
            _.remove(validCustomers, function (item) {
                return item._id;
            });

            let checkValid = true;
            _.filter(validCustomers, (item) => {
                if (!item.customer.name || !item.loanMoney || !item.actuallyCollectedMoney || !item.loanDate) {
                    checkValid = false;
                    return false;
                }
            });

            if (!checkValid) {
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

            ContractManager.post(customers)
                .then((results) => {
                    _.remove(results, (item) => {
                        return !item.isRemove;
                    });

                    if (results.length > 0) {
                        let userNews = angular.copy($scope.$parent.newUsers);
                        _.forEach(results, (itemResult) => {
                            let foundIndex = _.findIndex(userNews, function (customer) {
                                return customer._id === itemResult.customerId;
                            });

                            if (foundIndex >= 0)
                                $scope.$parent.newUsers.splice(foundIndex, 1);
                        });
                    }
                    else
                        $scope.$parent.newUsers = [];

                    $scope.getData();

                    AlertService.replaceAlerts({
                        type: 'success',
                        message: "Tạo mới hợp đồng thành công!"
                    });
                })
                .catch((error) => {
                    console.log(error);
                    AlertService.replaceAlerts({
                        type: 'error',
                        message: "Tạo mới hợp đồng thất bại. Hãy thử lại sau!"
                    });
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
                    hotInstance.render();
                }, 0);
            }
            else {
                swal({
                    title: 'Bạn có chắc chắn muốn xóa hợp đồng này ?',
                    text: "",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Có',
                    cancelButtonText: 'Không',
                }).then((result) => {
                    if (result.value) {
                        ContractManager.one(contractId).remove()
                            .then(function (result) {
                                if (result.removed) {
                                    $scope.customers.splice(rowIndex, 1);

                                    AlertService.replaceAlerts({
                                        type: 'success',
                                        message: "Xóa hợp đồng thành công!"
                                    });
                                }
                                else {
                                    AlertService.replaceAlerts({
                                        type: 'error',
                                        message: "Xóa thất bại. Hợp đồng đã chuyển trạng thái!"
                                    });
                                }
                            })
                            .catch(function () {
                                AlertService.replaceAlerts({
                                    type: 'error',
                                    message: "Có lỗi xảy ra!"
                                });
                            });
                    }
                });
            }
        };
    }
})();