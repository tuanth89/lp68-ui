(function () {
    'use strict';

    angular.module('ati.contract')
        .controller('CustomerCirculationController', CustomerCirculationController)
    ;

    function CustomerCirculationController($scope, $timeout, hotRegisterer, $state, ContractManager, moment) {

        let hotInstance = "";
        $scope.formProcessing = false;
        $scope.filter = {date: ""};
        $scope.selectedCirculation = {};

        $scope.newLoanMoney = 0;
        $scope.newActuallyCollectedMoney = 0;
        $scope.newLoanDate = 0;

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

        $scope.filter.date = new Date();

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
                if (col === 3) {
                    cellPrp.renderer = myBtns;
                    cellPrp.readOnly = true;
                }

                // if (col === 4) {
                //     cellPrp.renderer = myBtns;
                // }

                return cellPrp;
            },
            afterOnCellMouseDown: function (event, rowCol, TD) {
                if (event.realTarget.className.indexOf('btnPay') < 0) {
                    return;
                }
                hotInstance.setDataAtCell(rowCol.row, 4, event.realTarget.innerText);

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
            if (col === 3) {
                td.innerHTML = '<div><button class="btnPay btn btn-success bt-' + row + '">' + 0 + '</button>&nbsp;&nbsp;' +
                    '<button class="btnPay btn btn-success bt-' + row + '">' + 100 +
                    '</button>&nbsp;&nbsp;<button class="btnPay btn btn-success bt-' + row + '">' + 200 + '</button>' +
                    '</button>&nbsp;&nbsp;<button class="btnPay btn btn-success bt-' + row + '">' + 300 + '</button>' +
                    '</button>&nbsp;&nbsp;<button class="btnPay btn btn-success bt-' + row + '">' + 400 + '</button>' +
                    '</button>&nbsp;&nbsp;<button class="btnPay btn btn-success bt-' + row + '">' + 600 + '</button>' +
                    '</button>&nbsp;&nbsp;<button class="btnPay btn btn-success bt-' + row + '">' + 800 + '</button>' +
                    '</div>';

                return;
            }

        }

        $scope.getData = function () {
            ContractManager.one("circulation").one("all")
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
            ContractManager.one("circulation").one("update")
                .customPUT($scope.contracts)
                .then((items) => {
                    _.map($scope.contracts, function (x) {
                        x.isActive = false;
                        return x;
                    });

                    $scope.checkedList = [];
                    $scope.checkAll = false;
                    toastr.success('Lưu thành công!');
                })
                .catch((error) => {
                    console.log(error);
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
                        $scope.selectedCirculation = angular.copy($scope.contracts[value]);

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
                    $scope.selectedCirculation = angular.copy($scope.contracts[value]);

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
                        $scope.selectedCirculation = angular.copy($scope.contracts[value]);

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
                        $scope.selectedCirculation = angular.copy($scope.contracts[value]);

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

        };
    }
})();