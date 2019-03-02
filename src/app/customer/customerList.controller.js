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

    function CustomerListController($scope, Upload, $timeout, CONTRACT_EVENT, IMGUR_API, hotRegisterer, CustomerManager, Restangular, FileUploader, StoreManager, Auth, AlertService, AdminService) {
        $scope.settings = {rowHeaders: true, colHeaders: true, minSpareRows: 1};

        AdminService.checkRole(['customer.remove']).then(function (allowRole) {
            $scope.roleRemove = allowRole;
        });

        let isAccountant = $scope.$parent.isAccountant;
        let isRoot = $scope.$parent.isRoot;

        // let currentUser = Auth.getSession();
        let hotInstance = "";
        let customerItem = {
            _id: "",
            name: "",
            address: "",
            phone: "",
            photo: "",
            imgDocs: [],
            storeId: $scope.storeSelected.storeId,
            visitor: $scope.storeSelected.userId
        };
        let avatarIndex = -1;
        let imgDocsIndex = -1;

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
            $scope.userSelected.storeId = item._id;
            $scope.userSelected.id = "";
            StoreManager.one(item._id).one('listUserByStore').get()
                .then((store) => {
                    $scope.usersByStore = _.map(store.staffs, (item) => {
                        if (!item.isAccountant)
                            return item;
                    });

                    $scope.getData();
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
                if (!$scope.$parent.storeSelected.userId) {
                    cellPrp.readOnly = true;
                }

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
                    avatarIndex = rowCol.row;
                    $scope.$apply();
                    $('#avatarModal').modal('show');
                }

                if (event.realTarget.className.indexOf('resourceRow') >= 0) {
                    if (!$scope.customers[rowCol.row].name) {
                        toastr.error("Bạn hãy nhập Họ và tên trước!");
                        hotInstance.selectCell(rowCol.row, 0);
                        return;
                    }

                    imgDocsIndex = rowCol.row;
                    $scope.infoCus = $scope.customers[rowCol.row];
                    // $scope.showResource = true;

                    $scope.$apply();
                    $('#imageDoc').modal('show');
                }

                if (event.realTarget.className.indexOf('delRow') >= 0) {
                    $scope.delCustomer(rowCol.row, $scope.customers[rowCol.row]._id);
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

            if (cellProperties.prop === "actionDel") {
                td.innerHTML = '<button class="btnAction btn btn-danger delRow" value="' + value + '"><span class="fa fa-trash"></span>&nbsp;Xóa</button>';
                return;
            }

        }

        $scope.delCustomer = function (rowIndex, customerId) {
            if (!customerId && $scope.customers.length === 1) {
                return;
            }

            if (!customerId) {
                $scope.customers.splice(rowIndex, 1);

                setTimeout(function () {
                    $scope.$apply();
                    hotInstance.render();
                }, 0);
            }
            else {
                swal({
                    title: 'Bạn có chắc chắn muốn xóa khách hàng này ?',
                    text: "",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Có',
                    cancelButtonText: 'Không',
                }).then((result) => {
                    if (result.value) {
                        CustomerManager.one(customerId).remove()
                            .then(function (result) {
                                if (result.removed) {
                                    $scope.customers.splice(rowIndex, 1);

                                    if ($scope.customers === 0) {
                                        $scope.customers.push(angular.copy(customerItem));
                                        setTimeout(function () {
                                            hotInstance.render();
                                        }, 0);
                                    }

                                    AlertService.replaceAlerts({
                                        type: 'success',
                                        message: "Xóa khách hàng thành công!"
                                    });
                                }
                                else {
                                    AlertService.replaceAlerts({
                                        type: 'error',
                                        message: "Xóa thất bại. Khách hàng đã tồn tại số hợp đồng"
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
            let storeId = "";
            if ($scope.$parent.isRoot)
                storeId = !$scope.userSelected.storeId ? "none" : $scope.userSelected.storeId;
            else
                storeId = $scope.$parent.storeSelected.storeId;

            CustomerManager
                .one('list')
                .getList("", {storeId: storeId, userId: $scope.$parent.storeSelected.userId})
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
                        if (!$scope.customers[rowIndex].name) {
                            toastr.error("Họ và tên không được để trống!");
                            setTimeout(function () {
                                hotInstance.selectCell(rowIndex, 0);
                            }, 1);

                            return;
                        }
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
            if ((isAccountant || isRoot) && !$scope.userSelected.id) {
                toastr.error("Hãy chọn nhân viên thuộc cửa hàng!");
                return;
            }

            let removeCustomerInvalid = angular.copy($scope.customers);
            _.remove(removeCustomerInvalid, function (item) {
                return !item.name;
            });

            if (removeCustomerInvalid.length === 0) {
                hotInstance.selectCell(0, 0);
                toastr.error("Hãy nhập đầy đủ thông tin khách hàng!");
                return;
            }

            let customers = _.map(removeCustomerInvalid, (item) => {
                if ((isAccountant || isRoot) && !item._id) {
                    item.storeId = $scope.userSelected.storeId;
                    item.visitor = $scope.userSelected.id;
                }

                return item;
            });

            CustomerManager.one('insert').one('new').customPOST(customers)
                .then((items) => {
                    // $scope.customers = angular.copy(Restangular.stripRestangular(items));
                    // $scope.customers.push(angular.copy(customerItem));
                    $scope.$parent.newUsers.push(...angular.copy(items));

                    $('#avatarModal').modal('hide');

                    toastr.success('Cập nhật thành công!');
                    $scope.getData();
                })
                .catch((error) => {
                    console.log(error);
                    toastr.error("Cập nhật thất bại!");
                });
        };

        $('#avatarModal').on('hidden.bs.modal', function () {
            $scope.fileUp = "";
            $scope.updateAvatar = {};
            avatarIndex = -1;
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
            $scope.customers[imgDocsIndex].imgDocs.push(imgDoc);
        };
        uploader.onCompleteAll = function () {
            if (!$scope.customers[imgDocsIndex]._id) {
                $scope.saveCustomer();
                $('#imageDoc').modal('hide');

                $('.selectFile').css("display", "block");
                $('.changeFile').css("display", "none");

                $scope.formProcessing = false;
            }
            else {
                CustomerManager
                    .one($scope.customers[imgDocsIndex]._id)
                    .one("imgDocs")
                    .customPUT({imgDocs: $scope.customers[imgDocsIndex].imgDocs, isAdd: 1})
                    .then((item) => {
                        toastr.success("Thêm tài liệu ảnh thành công!");
                        $('#imageDoc').modal('hide');
                        $scope.getData();

                        $('.selectFile').css("display", "block");
                        $('.changeFile').css("display", "none");
                    })
                    .catch((error) => {
                        toastr.error("Có lỗi xảy ra!");
                    })
                    .finally(() => {
                        $scope.formProcessing = false;
                    });
            }
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
                .one($scope.customers[imgDocsIndex]._id)
                .one("imgDocs")
                .customPUT({imgDocs: item, isAdd: 0})
                .then((item) => {
                    toastr.success("Xóa tài liệu ảnh thành công!");
                    $scope.customers[imgDocsIndex].imgDocs.splice(index, 1);
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
                    if (!$scope.customers[avatarIndex]._id) {
                        $scope.customers[avatarIndex].photo = data.data.link;
                        $scope.saveCustomer();
                    }
                    else {
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
                    }
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