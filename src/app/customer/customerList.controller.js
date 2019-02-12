(function () {
    'use strict';

    angular.module('ati.customer')
        .directive('ngThumb', ['$window', function ($window) {
            var helper = {
                support: !!($window.FileReader && $window.CanvasRenderingContext2D),
                isFile: function (item) {
                    return angular.isObject(item) && item instanceof $window.File;
                },
                isImage: function (file) {
                    var type = '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
                    return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
                }
            };

            return {
                restrict: 'A',
                template: '<canvas/>',
                link: function (scope, element, attributes) {
                    if (!helper.support) return;

                    var params = scope.$eval(attributes.ngThumb);

                    if (!helper.isFile(params.file)) return;
                    if (!helper.isImage(params.file)) return;

                    var canvas = element.find('canvas');
                    var reader = new FileReader();

                    reader.onload = onLoadFile;
                    reader.readAsDataURL(params.file);

                    function onLoadFile(event) {
                        var img = new Image();
                        img.onload = onLoadImage;
                        img.src = event.target.result;
                    }

                    function onLoadImage() {
                        var width = params.width || this.width / this.height * params.height;
                        var height = params.height || this.height / this.width * params.width;
                        canvas.attr({width: width, height: height});
                        canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
                    }
                }
            };
        }])
        .controller('CustomerListController', CustomerListController);

    function CustomerListController($scope, Upload, $timeout, CONTRACT_EVENT, IMGUR_API, hotRegisterer, CustomerManager, Restangular, FileUploader, StoreManager) {
        $scope.settings = {rowHeaders: true, colHeaders: true, minSpareRows: 1};

        let hotInstance = "";
        let customerItem = {
            _id: "",
            name: "",
            address: "",
            phone: "",
            storeId: $scope.storeSelected.storeId
        };

        $scope.userSelected = {storeId: "", id: ""};
        $scope.stores = [];
        $scope.usersByStore = [];

        $scope.$on('$viewContentLoaded', function (event, data) {
            StoreManager.one('listActive').getList()
                .then((stores) => {
                    $scope.stores = angular.copy(Restangular.stripRestangular(stores));
                });
        });

        $scope.selectedStoreEvent = function (item) {
            $scope.userSelected.id = "";
            StoreManager.one(item._id).one('listUserByStore').get()
                .then((store) => {
                    $scope.usersByStore = angular.copy(Restangular.stripRestangular(store.staffs));
                }, (error) => {
                })
                .finally(() => {
                });
        };

        $scope.$on(CONTRACT_EVENT.RESIZE_TABLE, function (event, data) {
            hotInstance.render();
        });

        $scope.formProcessing = false;
        $scope.fileImgDoc = "";
        $scope.showResource = false;
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
                cellPrp.className = "hot-normal";

                if (col !== 0)
                    cellPrp.renderer = columnRenderer;

                return cellPrp;
            },
            afterOnCellMouseDown: function (event, rowCol, TD) {
                if (event.realTarget.className.indexOf('avaRow') >= 0) {
                    if (!$scope.customers[rowCol.row].name) {
                        toastr.error("Bạn hãy nhập Họ và tên trước!");
                        hotInstance.selectCell(rowCol.row, 0);
                        return;
                    }

                    $scope.updateAvatar = angular.copy($scope.customers[rowCol.row]);
                    $scope.$apply();
                    $('#avatarModal').modal('show');
                }

                if (event.realTarget.className.indexOf('resourceRow') >= 0) {
                    if (!$scope.customers[rowCol.row].name) {
                        toastr.error("Bạn hãy nhập Họ và tên trước!");
                        hotInstance.selectCell(rowCol.row, 0);
                        return;
                    }

                    $scope.infoCus = $scope.customers[rowCol.row];
                    // $scope.showResource = true;

                    $scope.$apply();
                    $('#imageDoc').modal('show');
                }
            },
            afterChange: function (source, changes) {
                if (changes === 'edit') {
                    let row = source[0][0];
                    let newValue = source[0][3];
                    if (source[0][1] === "numberId") {
                        $scope.checkPersonalIdExists(row, newValue, true);
                        // console.log('row: ' + source[0][0]);
                        // console.log('col: ' + source[0][1]);
                        // console.log('old value: ' + source[0][2]);
                        // console.log('new value: ' + source[0][3]);
                    }

                    if (source[0][1] === "houseHolderNo") {
                        $scope.checkPersonalIdExists(row, newValue, false);
                    }
                }
            },
            stretchH: "all",
            autoWrapRow: true
        };

        function columnRenderer(instance, td, row, col, prop, value, cellProperties) {
            Handsontable.renderers.TextRenderer.apply(this, arguments);
            if (cellProperties.prop === "photo") {
                if (value)
                    td.innerHTML = '<img src="' + value + '" style="width: 50px; height: 50px"/>&nbsp;&nbsp;<button class="btnAction btn btn-success avaRow" value="' + value + '">Tải lên</button>';
                else
                    td.innerHTML = '<div class="ht-center"><button class="btnAction btn btn-success avaRow" value="' + value + '">Tải lên</button></div>';
                return;
            }

            if (cellProperties.prop === "imgResource") {
                td.innerHTML = '<div class="ht-center"><button class="btnAction btn btn-success resourceRow" value="' + value + '">Xem</button></div>';
                return;
            }

            // if (col === 7) {
            //     td.innerHTML = '<button class="btnAction btn btn-danger delRow" value="' + value + '">Xóa</button>';
            // }
        }

        $scope.checkPersonalIdExists = (rowIndex, value, isNumberId) => {
            let customerItem = $scope.customers[rowIndex];
            $scope.customers.forEach((item) => {
                if (customerItem._id === item._id || !item._id)
                    return;

                if (isNumberId && customerItem.numberId && customerItem.numberId === item.numberId) {
                    toastr.error("Số CMT không được trùng!");
                    hotInstance.selectCell(rowIndex, 1);
                    hotInstance.setDataAtCell(rowIndex, 1, "");

                    // setTimeout(function () {
                    //     // hotInstance.selectCell(rowIndex, 2);
                    //
                    //     let cell = hotInstance.getCell(rowIndex, 1);   // get the cell for the row and column
                    //     cell.style.backgroundColor = "#00FF90";  // set
                    // }, 1);

                    return false;
                }

                if (!isNumberId && customerItem.houseHolderNo && customerItem.houseHolderNo === item.houseHolderNo) {
                    toastr.error("Số sổ hộ khẩu không được trùng!");
                    hotInstance.selectCell(rowIndex, 2);
                    hotInstance.setDataAtCell(rowIndex, 2, "");

                    return false;
                }
            });

            // CustomerManager
            //     .one(customerItem._id)
            //     .one("checkExists")
            //     .customPOST(isNumberId ? {numberId: value} : {houseHolderNo: value})
            //     .then(function (resp) {
            //         if(resp)
            //             toastr.error((isNumberId ? "Số CMT" : "Số sổ hộ khẩu") + " đã tồn tại!");
            //     });
        };

        $scope.getData = function () {
            CustomerManager
                .one($scope.$parent.storeSelected.storeId)
                .one('list')
                .getList()
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

        // $scope.hideImageResource = (() => {
        //     $scope.showResource = false;
        // });

        $scope.saveCustomer = () => {
            if ($scope.$parent.isAccountant && !$scope.userSelected.id) {
                toastr.error("Hãy chọn nhân viên thuộc cửa hàng!");
                return;
            }

            let customers = angular.copy($scope.customers);
            _.remove(customers, function (item) {
                return !item.name;
            });

            CustomerManager.one('insert').one('new').customPOST(customers)
                .then((items) => {
                    $scope.customers = angular.copy(Restangular.stripRestangular(items));
                    $scope.customers.push(angular.copy(customerItem));
                    toastr.success('Cập nhật khách hàng thành công!');
                })
                .catch((error) => {
                    console.log(error);
                    toastr.error("Cập nhật khách hàng thất bại!");
                });
        };

        $scope.getData();

        $('#avatarModal').on('hidden.bs.modal', function () {
            $scope.fileUp = "";
            $scope.updateAvatar = {};
        });

        $scope.fileUp = "";
        $scope.formProcessing = false;

        let uploader = $scope.imgDocUploader = new FileUploader({
            url: IMGUR_API.URL,
            alias: 'image',
            headers: {'Authorization': IMGUR_API.CLIENT_ID},
            autoUpload: true
        });

        uploader.filters.push({
            name: 'imageFilter',
            fn: function (item /*{File|FileLikeObject}*/, options) {
                $scope.invalidExtension = false;
                let type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                let result = '|jpg|png|jpeg|gif|'.indexOf(type) !== -1;

                // if (!result) {
                //     $scope.invalidExtension = true;
                //     $scope.invalidFileName = item.name;
                // }

                return result;
            }
        });

        $scope.filters = ['jpg', 'jpeg', 'gif', 'png'];

        uploader.onAfterAddingFile = function (fileItem) {
            $scope.progressUpload = 0;
            $('.selectFile').css("display", "none");
            $('.changeFile').css("display", "block");
        };
        uploader.onBeforeUploadItem = function (item) {
            $scope.formProcessing = true;
        };
        uploader.onProgressAll = function (progress) {
            $scope.progressUpload = progress;
            console.log(progress);
        };
        uploader.onCompleteItem = function (fileItem, response, status, headers) {
            let data = response.data;
            let imgDoc = {id: data.id, name: fileItem.file.name, deletehash: data.deletehash, link: data.link};
            $scope.infoCus.imgDocs.push(imgDoc);
        };
        uploader.onCompleteAll = function () {
            CustomerManager
                .one($scope.infoCus._id)
                .one("imgDocs")
                .customPUT({imgDocs: $scope.infoCus.imgDocs, isAdd: 1})
                .then((item) => {
                    toastr.success("Thêm tài liệu ảnh thành công!");

                    $('.selectFile').css("display", "block");
                    $('.changeFile').css("display", "none");
                })
                .catch((error) => {
                    toastr.error("Có lỗi xảy ra!");
                })
                .finally(() => {
                    $scope.formProcessing = false;
                });
        };

        $scope.removeImgDoc = (item, index) => {
            $.ajax({
                url: IMGUR_API.URL + "/" + item.deletehash,
                headers: {'Authorization': IMGUR_API.CLIENT_ID},
                type: "DELETE",
                success: function (data) {
                },
                error: function (xhr, status) {
                    console.log("error del imgur: " + status);
                },
                complete: function (xhr, status) {
                }
            });


            CustomerManager
                .one($scope.infoCus._id)
                .one("imgDocs")
                .customPUT({imgDocs: item, isAdd: 0})
                .then((item) => {
                    toastr.success("Xóa tài liệu ảnh thành công!");
                    $scope.infoCus.imgDocs.splice(index, 1);
                })
                .catch((error) => {
                    toastr.error("Có lỗi xảy ra!");
                })
                .finally(() => {
                    $scope.formProcessing = false;
                });
        };

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