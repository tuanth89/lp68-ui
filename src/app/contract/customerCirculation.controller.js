(function () {
    'use strict';

    angular.module('ati.contract')
        .controller('CustomerCirculationController', CustomerCirculationController);

    function CustomerCirculationController($scope, $timeout, hotRegisterer, $state, contracts, ContractManager, Restangular) {

        let hotInstance = "";
        $scope.contracts = angular.copy(Restangular.stripRestangular(contracts));
        


        $timeout(function () {
            hotInstance = hotRegisterer.getInstance('my-handsontable');

            $scope.onAfterInit = function() {
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
            //
            // document.addEventListener('keydown', function (e) {
            //     if (e.which === 9 && hotInstance) {
            //         if (!hotInstance.getSelected())
            //             return;
            //
            //         let rowIndex = $('.current').parent().index();
            //         let colIndex = hotInstance.getSelected()[1];
            //         let totalCols = hotInstance.countCols();
            //         let totalRows = hotInstance.countRows();
            //         if (colIndex === (totalCols - 1) && rowIndex === (totalRows - 1))
            //             hotInstance.alter("insert_row", totalRows + 1);
            //     }
            // }, true);
        }, 0);

    }
})();