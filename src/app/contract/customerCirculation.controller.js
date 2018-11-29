(function () {
    'use strict';

    angular.module('ati.contract')
        .controller('CustomerCirculationController', CustomerCirculationController);

    function CustomerCirculationController($scope, $timeout, hotRegisterer, $state, ContractManager, Restangular) {

        $scope.filter = {date: ""};

        $scope.$watch('filter.date', function (newValue, oldValue) {
            if (newValue != oldValue) {
                $scope.getData();
            }
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
                if (col === 4) {
                    cellPrp.renderer = myBtns;
                    cellPrp.readOnly = true;
                }

                return cellPrp;
            },
            afterOnCellMouseDown: function (event, cords, TD) {
                if (event.realTarget.className.indexOf('btnPay') < 0) {
                    return;
                }

                $scope.clickPay(event.realTarget.innerText);
            }
        };

        function myBtns(instance, td, row, col, prop, value, cellProperties) {
            Handsontable.renderers.TextRenderer.apply(this, arguments);
            td.innerHTML = '<div style="text-align: center;"><button class="btnPay btn btn-success bt-' + row + '">' + 100 + '</button>&nbsp;&nbsp;<button class="btnPay btn btn-success bt-' + row + '">' + 200 + '</button>&nbsp;&nbsp;<button class="btnPay btn btn-success bt-' + row + '">' + 300 + '</button></div>';

        }

        $scope.clickPay = function (value) {
            alert(value);
        };

        let hotInstance = "";

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

        $timeout(function () {
            hotInstance = hotRegisterer.getInstance('my-handsontable');

            $scope.onAfterInit = function () {
                hotInstance.validateCells();
            };


        }, 0);

        $scope.getData();
    }
})();