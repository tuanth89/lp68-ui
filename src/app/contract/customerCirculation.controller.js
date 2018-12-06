(function () {
    'use strict';

    angular.module('ati.contract')
        .controller('CustomerCirculationController', CustomerCirculationController)
    ;

    function CustomerCirculationController($scope, $timeout, hotRegisterer, $state, ContractManager, moment, Restangular, HdLuuThong) {

        let hotInstance = "";
        $scope.formProcessing = false;
        $scope.filter = {date: ""};
        $scope.selectedCirculation = {};

        $scope.checkedList = [];
        $scope.checkAll = false;
        $scope.$watch('checkAll', function (newValue, oldValue) {
            if (newValue != oldValue) {
                _.map($scope.contracts, function (x) {
                    x.isActive = newValue;
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
                if ($scope.contracts.length > 0) {
                    let item = $scope.contracts[row];
                    if (item && item.status > 0) {
                        cellPrp.readOnly = true;
                        cellPrp.className = "handsontable-cell-disable";
                        return cellPrp;
                    }
                }

                if (col === 5) {
                    cellPrp.renderer = myBtns;
                    cellPrp.readOnly = true;
                }

                if (col === 4) {
                    cellPrp.className = "hot-normal";
                }

                if (col === 3) {
                    cellPrp.className = "handsontable-td-red";
                }

                return cellPrp;
            },
            afterOnCellMouseDown: function (event, rowCol, TD) {
                // if (event.realTarget.className.indexOf('btnPay') >= 0) {
                //     hotInstance.setDataAtCell(rowCol.row, 5, parseInt(event.realTarget.innerText) * 1000);
                //     return;
                // }

                if (event.realTarget.className.indexOf('btnAction') >= 0) {
                    $scope.selectedCirculation = {};

                    switch (parseInt(event.realTarget.value)) {
                        case 0:
                            $scope.selectedCirculation = angular.copy(Restangular.stripRestangular($scope.contracts[rowCol.row]));
                            $scope.selectedCirculation.totalMoney = 0;
                            $scope.selectedCirculation.newDailyMoney = 0;
                            $scope.selectedCirculation.newDailyMoney = 0;

                            let nowDate = moment();
                            let dateContract = moment($scope.selectedCirculation.createdAt, "YYYYMMDD");
                            let diffDays = nowDate.diff(dateContract, 'days');
                            let {actuallyCollectedMoney, dailyMoney} = $scope.selectedCirculation;
                            $scope.selectedCirculation.moneyContractOld = parseInt(actuallyCollectedMoney) - (parseInt(dailyMoney) * diffDays);
                            $scope.selectedCirculation.createdAt = moment($scope.selectedCirculation.createdAt).format("DD/MM/YYYY");

                            $scope.selectedCirculation.totalMoney = $scope.selectedCirculation.moneyContractOld;

                            $scope.$apply();
                            $('#hopDongDaoModal').modal('show');
                            break;
                        case 1:
                            break;
                        case 2:
                            break;
                        case 3:
                            break;
                        case 4:
                            break;

                    }

                    return;
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

        // function negativeValueRenderer(instance, td, row, col, prop, value, cellProperties) {
        //     Handsontable.renderers.TextRenderer.apply(this, arguments);
        //
        //     // if row contains negative number
        //     if (parseInt(value, 10) < 0) {
        //         // add class "negative"
        //         td.className = 'make-me-red';
        //     }
        //
        //     if (!value || value === '') {
        //         td.style.background = '#EEE';
        //     }
        //     else {
        //         if (value === 'Nissan') {
        //             td.style.fontStyle = 'italic';
        //         }
        //         td.style.background = '';
        //     }
        // }

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

            if (col === 5) {
                td.innerHTML = '<div><button class="btnAction btn btn-success btAction-' + row + '" value="' + 0 + '">' + 'Đáo' + '</button>&nbsp;&nbsp;' +
                    '<button class="btnAction btn btn-success btAction-' + row + '" value="' + 1 + '">' + 'Thu về' +
                    '<button class="btnAction btn btn-success btAction-' + row + '" value="' + 2 + '">' + 'Chốt' +
                    '</button>&nbsp;&nbsp;<button class="btnAction btn btn-success btAction-' + row + '" value="' + 3 + '">' + 'Bễ' + '</button>' +
                    '</button>&nbsp;&nbsp;<button class="btnAction btn btn-success btAction-' + row + '" value="' + 4 + '">' + 'Kết thúc' + '</button>' +
                    '</div>';
            }

        }

        $scope.getData = function () {
            HdLuuThong
                .one('listByDate')
                .one('all')
                .getList("", {date: $scope.filter.date})
                .then(function (resp) {
                    $scope.contracts = resp;
                });
        };

        $scope.convertToDate = function (stringDate) {
            let dateOut = new Date(stringDate);
            dateOut.setDate(dateOut.getDate());
            return dateOut;
        };

        $scope.saveCirculation = () => {
            let contracts = _.filter($scope.contracts, (item) => {
                return item.isActive;
            });

            HdLuuThong.one("contract").one("updateMany")
                .customPUT(contracts)
                .then((items) => {
                    // _.map($scope.contracts, function (x) {
                    //     x.isActive = false;
                    //     return x;
                    // });

                    _.remove($scope.contracts, (item, index) => {
                        if (item.isActive)
                            $scope.checkedList.splice(index, 1);

                        return item.isActive;
                    });

                    $scope.checkedList = [];
                    $scope.checkAll = false;
                    toastr.success('Cập nhật thành công!');
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

        $scope.showModal = (type) => {
            switch (type) {
                case 0:
                    if ($scope.checkedList.length === 1) {
                        let [value] = $scope.checkedList;
                        $scope.selectedCirculation = angular.copy(Restangular.stripRestangular($scope.contracts[value]));
                        $scope.selectedCirculation.totalMoney = 0;
                        $scope.selectedCirculation.newDailyMoney = 0;
                        $scope.selectedCirculation.newDailyMoney = 0;

                        let nowDate = moment();
                        let dateContract = moment($scope.selectedCirculation.createdAt, "YYYYMMDD");
                        let diffDays = nowDate.diff(dateContract, 'days');
                        let {actuallyCollectedMoney, dailyMoney} = $scope.selectedCirculation;
                        $scope.selectedCirculation.moneyContractOld = parseInt(actuallyCollectedMoney) - (parseInt(dailyMoney) * diffDays);
                        $scope.selectedCirculation.createdAt = moment($scope.selectedCirculation.createdAt).format("DD/MM/YYYY");

                        $scope.selectedCirculation.totalMoney = $scope.selectedCirculation.moneyContractOld;
                        $('#hopDongDaoModal').modal('show');
                    }
                    break;

                case 1:
                    let [value] = $scope.checkedList;
                    $scope.selectedCirculation = angular.copy(Restangular.stripRestangular($scope.contracts[value]));

                    let nowDate = moment();
                    let dateContract = moment($scope.selectedCirculation.createdAt, "YYYYMMDD");
                    let diffDays = nowDate.diff(dateContract, 'days');
                    let {actuallyCollectedMoney, dailyMoney} = $scope.selectedCirculation;
                    $scope.selectedCirculation.moneyContractOld = parseInt(actuallyCollectedMoney) - (parseInt(dailyMoney) * diffDays);
                    $scope.selectedCirculation.createdAt = moment($scope.selectedCirculation.createdAt).format("DD/MM/YYYY");

                    $scope.selectedCirculation.totalMoney = $scope.selectedCirculation.moneyContractOld;
                    $('#hopDongThuVeModal').modal('show');
                    break;

                case 2:
                    if ($scope.checkedList.length === 1) {
                        let [value] = $scope.checkedList;
                        $scope.selectedCirculation = angular.copy(Restangular.stripRestangular($scope.contracts[value]));

                        let nowDate = moment();
                        let dateContract = moment($scope.selectedCirculation.createdAt, "YYYYMMDD");
                        let diffDays = nowDate.diff(dateContract, 'days');
                        let {actuallyCollectedMoney, dailyMoney} = $scope.selectedCirculation;
                        $scope.selectedCirculation.moneyContractOld = parseInt(actuallyCollectedMoney) - (parseInt(dailyMoney) * diffDays);
                        $scope.selectedCirculation.createdAt = moment($scope.selectedCirculation.createdAt).format("DD/MM/YYYY");

                        $scope.selectedCirculation.totalMoney = $scope.selectedCirculation.moneyContractOld;
                        $('#hopDongChotModal').modal('show');
                    }

                    break;

                case 3:
                    if ($scope.checkedList.length === 1) {
                        let [value] = $scope.checkedList;
                        $scope.selectedCirculation = angular.copy(Restangular.stripRestangular($scope.contracts[value]));

                        let nowDate = moment();
                        let dateContract = moment($scope.selectedCirculation.createdAt, "YYYYMMDD");
                        let diffDays = nowDate.diff(dateContract, 'days');
                        let {actuallyCollectedMoney, dailyMoney} = $scope.selectedCirculation;
                        $scope.selectedCirculation.moneyContractOld = parseInt(actuallyCollectedMoney) - (parseInt(dailyMoney) * diffDays);
                        $scope.selectedCirculation.createdAt = moment($scope.selectedCirculation.createdAt).format("DD/MM/YYYY");

                        $scope.selectedCirculation.totalMoney = $scope.selectedCirculation.moneyContractOld;
                        $('#hopDongBeModal').modal('show');
                    }
                    break;

            }

        };

        $scope.saveDaoModal = () => {
            if (!$scope.selectedCirculation.newLoanMoney
                || parseInt($scope.selectedCirculation.newLoanMoney) <= 0) {
                toastr.error("Số tiền vay không được <= 0");
                return;
            }

            ContractManager
                .one($scope.selectedCirculation._id)
                .one('circulationContract')
                .customPOST($scope.selectedCirculation)
                .then((contract) => {
                    toastr.success('Đáo hạn hợp đồng thành công!');

                    _.map($scope.contracts, function (x) {
                        x.isActive = false;
                        return x;
                    });
                    $scope.checkedList = [];
                    $scope.checkAll = false;
                    $scope.selectedCirculation = {};
                    $('#hopDongDaoModal').modal('hide');

                    $scope.getData();
                })
                .catch((error) => {
                    console.log(error);
                    toastr.error("Đáo hạn hợp đồng thất bại!");
                });
        };
    }
})();