(function () {
    'use strict';

    angular.module('ati.contract')
        .controller('ContractChotController', ContractChotController);

    function ContractChotController($scope, $stateParams, $timeout, $state, hotRegisterer, contracts, Restangular) {
        $scope.rowHeaders = true;
        $scope.colHeaders = true;
        $scope.contracts = angular.copy(Restangular.stripRestangular(contracts));

        let hotInstance = "";

        $scope.settings = {
            stretchH: "all",
            autoWrapRow: true,
            rowHeaders: true,
            colHeaders: true,
            minSpareRows: 0,
            cells: function (row, col) {
                let cellPrp = {};
                if (col === 1) {
                    cellPrp.renderer = myBtns;
                    cellPrp.readOnly = true;
                }

                if (col === 2 || col === 3) {
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
            }
        };

        function myBtns(instance, td, row, col, prop, value, cellProperties) {
            Handsontable.renderers.TextRenderer.apply(this, arguments);
            if (col === 1) {
                // td.innerHTML = '<u><a ng-click="viewCustomerCalendar(' + value + ')">' + value + '</a></u>';
                td.innerHTML = '<u><a class="linkable cusRow" value="' + value + '" ng-click="viewCustomerCalendar(' + value + ')">' + value + '</a></u>';

            }
        }

        $timeout(function () {
            hotInstance = hotRegisterer.getInstance('my-handsontable');
        }, 0);

    }
})();