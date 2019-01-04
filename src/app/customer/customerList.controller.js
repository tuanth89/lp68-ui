(function () {
    'use strict';

    angular.module('ati.customer')
        .controller('CustomerListController', CustomerListController);

    function CustomerListController($scope, Upload, $timeout, IMGUR_API, hotRegisterer, CustomerManager, Restangular) {
        $scope.settings = {rowHeaders: true, colHeaders: true, minSpareRows: 1};

        let hotInstance = "";
        let customerItem = {
            _id: "",
            name: "",
            address: "",
            phone: ""
        };

        $scope.customers = [];
        $scope.customers.push(angular.copy(customerItem));
        // $scope.customers = angular.copy(Restangular.stripRestangular(contracts));

        $scope.settings = {
            contextMenu: {
                items: {
                    'row_above': {name: 'Thêm dòng trên'},
                    'row_below': {name: 'Thêm dòng dưới'},
                    'remove_row': {name: 'Xóa'}
                }
                // callback: function (key, options) {
                //     if (key === 'remove_row') {
                //         if (hotInstance.countRows() > 1) {
                //             var indexArr = hot.getSelected();
                //             var selectedData = hot.getDataAtRow(indexArr[0]);
                //         }
                //     }
                // }
            },
            beforeRemoveRow: function (index, amount) {
                if (hotInstance.countRows() <= 1)
                    return false;
            },
            afterCreateRow: function (index) {
                setTimeout(function () {
                    hotInstance.selectCell(index, 0);
                }, 1);
            },
            // afterCreateRow: function (index) {
            //     setTimeout(function () {
            //         this.selectCell(index, 0, 0, 0, true);
            //     }, 1);
            // },
            cells: function (row, col) {
                let cellPrp = {};
                // if (col === 6) {
                cellPrp.className = "hot-normal";
                // cellPrp.readOnly = true;
                // }

                if (col === 5)
                    cellPrp.renderer = avatarRenderer;

                return cellPrp;
            },
            afterOnCellMouseDown: function (event, rowCol, TD) {
                if (event.realTarget.className.indexOf('avaRow') >= 0) {
                    if (!$scope.customers[rowCol.row].name) {
                        toastr.error("Bạn hãy nhập Họ và tên trước!");
                        return;
                    }

                    $scope.updateAvatar = angular.copy($scope.customers[rowCol.row]);
                    $scope.$apply();
                    $('#avatarModal').modal('show');
                }
            },
            stretchH: "all",
            autoWrapRow: true
        };

        function avatarRenderer(instance, td, row, col, prop, value, cellProperties) {
            Handsontable.renderers.TextRenderer.apply(this, arguments);
            if (col === 5) {
                if (value)
                    td.innerHTML = '<img src="' + value + '" style="width: 50px; height: 50px"/>&nbsp;&nbsp;<u><a class="linkable avaRow" value="' + value + '">Tải lên</a></u>';
                else
                    td.innerHTML = '<u><a class="linkable avaRow" value="' + value + '">Tải lên</a></u>';

            }
        }

        $scope.getData = function () {
            CustomerManager
                .getList("")
                .then(function (resp) {
                    $scope.customers = angular.copy(Restangular.stripRestangular(resp));
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
                        hotInstance.alter("insert_row", totalRows + 1);
                        $scope.customers[totalRows] = angular.copy(customerItem);
                    }
                }
            }, true);
        }, 0);

        $scope.saveCustomer = () => {
            let customers = angular.copy($scope.customers);
            _.remove(customers, function (item) {
                return !item.name;
            });

            CustomerManager.one('insert').one('new').customPOST(customers)
                .then((items) => {
                    $scope.customers = angular.copy(Restangular.stripRestangular(items));
                    $scope.customers.push(angular.copy(customerItem));
                    toastr.success('Tạo mới khách hàng thành công!');
                })
                .catch((error) => {
                    console.log(error);
                    toastr.error("Tạo mới khách hàng thất bại!");
                });
        };

        $scope.getData();

        $('#avatarModal').on('hidden.bs.modal', function () {
            $scope.fileUp = "";
            $scope.updateAvatar = {};
        });

        $scope.fileUp = "";
        $scope.formProcessing = false;
        $scope.saveAvatarModal = () => {
            if (!$scope.fileUp || $scope.formProcessing)
                return;

            $scope.formProcessing = true;
            Upload.http({
                url: IMGUR_API.URL,
                data: $scope.fileUp,
                headers: {'Authorization': IMGUR_API.CLIENT_ID, 'Content-Type': $scope.fileUp.type},
            })
                .progress(function (evt) {
                    // let progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    // $scope.log = 'progress: ' + progressPercentage + '% ' + evt.config.file.name + '\n' + $scope.log;
                    // console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                })
                .success(function (data, status, headers, config) {
                    CustomerManager
                        .one($scope.updateAvatar._id)
                        .customPUT({photo: data.data.link})
                        .then((item) => {
                            $scope.updateAvatar.photo = data.data.link;
                            toastr.success("Cập nhật Ảnh đại diện thành công!");

                            $('#avatarModal').modal('hide');
                            $scope.getData();
                        })
                        .catch((error) => {
                            toastr.error("Có lỗi xảy ra!");
                            // console.log(error);
                        });

                    // $scope.log = 'File ' + config.file.name + ' uploaded.';
                })
                .error(function (data, status, headers, config) {
                    // console.log("Error: " + data);
                })
                .finally(() => {
                    $scope.formProcessing = false;
                });
        };

    }
})();