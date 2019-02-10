(function () {
    'use strict';

    angular.module('ati.adminManagement')
        .controller('AdminForm', AdminForm)
    ;

    function AdminForm($scope, $translate, $state, FileUploader, AlertService, userProfile, Auth,
                       $anchorScroll, moment, $timeout, adminRestangular, isNew, AdminManager) {
        let user = Auth.getSession();
        $scope.visitedBirthday = false;
        $scope.isNew = isNew;
        $scope.admin = !$scope.isNew ? userProfile : {
            fullName: null,
            email: null,
            enabled: true,
            phone: null,
            photo: null,
            gender: 1,
            dateIn: null,
            title: null,
            password: null,
            isAccountant: false
        };

        $scope.userRole = {friendlyName: ""};
        $scope.fieldNameTranslations = {
            username: 'Username',
            password: 'Password',
            email: 'Email'
        };

        $scope.options = {
            singleDatePicker: true,
            showDropdowns: true,
            locale: {
                format: "DD-MM-YYYY",
                "daysOfWeek": [
                    $translate.instant('DATE_RANGE_PICKER.DAY.SU'),
                    $translate.instant('DATE_RANGE_PICKER.DAY.MO'),
                    $translate.instant('DATE_RANGE_PICKER.DAY.TU'),
                    $translate.instant('DATE_RANGE_PICKER.DAY.WE'),
                    $translate.instant('DATE_RANGE_PICKER.DAY.TH'),
                    $translate.instant('DATE_RANGE_PICKER.DAY.FR'),
                    $translate.instant('DATE_RANGE_PICKER.DAY.SA')
                ],
                "monthNames": [
                    $translate.instant('DATE_RANGE_PICKER.MONTH_SINGLE_DATE.JANUARY'),
                    $translate.instant('DATE_RANGE_PICKER.MONTH_SINGLE_DATE.FEBRUARY'),
                    $translate.instant('DATE_RANGE_PICKER.MONTH_SINGLE_DATE.MARCH'),
                    $translate.instant('DATE_RANGE_PICKER.MONTH_SINGLE_DATE.APRIL'),
                    $translate.instant('DATE_RANGE_PICKER.MONTH_SINGLE_DATE.MAY'),
                    $translate.instant('DATE_RANGE_PICKER.MONTH_SINGLE_DATE.JUNE'),
                    $translate.instant('DATE_RANGE_PICKER.MONTH_SINGLE_DATE.JULY'),
                    $translate.instant('DATE_RANGE_PICKER.MONTH_SINGLE_DATE.AUGUST'),
                    $translate.instant('DATE_RANGE_PICKER.MONTH_SINGLE_DATE.SEPTEMBER'),
                    $translate.instant('DATE_RANGE_PICKER.MONTH_SINGLE_DATE.OCTOBER'),
                    $translate.instant('DATE_RANGE_PICKER.MONTH_SINGLE_DATE.NOVEMBER'),
                    $translate.instant('DATE_RANGE_PICKER.MONTH_SINGLE_DATE.DECEMBER')
                ],
            }
            // eventHandlers: {
            //     'showCalendar.daterangepicker': function () {
            //         alert("OK");
            //     }
            // }
        };

        $scope.formProcessing = false;
        $scope.repeatPassword = null;

        $scope.$on('$viewContentLoaded', function (event, data) {
            adminRestangular
                .all("roles")
                .one("listRole")
                .get()
                .then(function (resp) {
                    let roles = resp.plain();
                    if (roles.length > 0) {
                        $scope.roleApprove = roles;
                        if ($scope.isNew)
                            $scope.userRole.friendlyName = $scope.roleApprove[0].friendlyName;
                        else {
                            let roleFindIndex = _.findIndex($scope.roleApprove, {friendlyName: $scope.admin.roles[0]});
                            if (roleFindIndex >= 0)
                                $scope.userRole.friendlyName = $scope.roleApprove[roleFindIndex].friendlyName;
                        }
                    }
                });
        });

        // (function () {
        //
        // })();

        $scope.isFormValid = function () {
            return $scope.editForm.$valid && !$scope.invalidExtension;
        };

        $scope.submit = function () {
            if ($scope.formProcessing) {
                // already running, prevent duplicates
                return;
            }

            // if ($scope.admin.name.match(SPECIAL_CHARACTER_PATTERN)) {
            //     AlertService.replaceAlerts({
            //         type: 'error',
            //         message: 'Tên không được chứa ký tự đặc biệt!'
            //     });
            //
            //     $anchorScroll();
            //     return false;
            // }

            // let birdthday = moment($scope.admin.birthday, "dd/MM/yyyy").toDate();
            let birdthday = new Date($scope.admin.birthday);
            let today = moment();
            if (birdthday > today) {
                toastr.error("Ngày sinh không được lớn hơn ngày hiện tại!");
                return;
            }

            $scope.admin.roles = [$scope.userRole.friendlyName];

            if (!$scope.admin.password) {
                delete $scope.admin.password;
            }

            $scope.formProcessing = true;
            let saveUser = $scope.isNew ? AdminManager.post($scope.admin) :
                AdminManager.one($scope.admin._id).customPUT($scope.admin);

            saveUser
                .then(function (data) {
                    $scope.formProcessing = false;
                    if (data && data.message) {
                        document.documentElement.scrollTop = 0;
                        AlertService.replaceAlerts({
                            type: 'error',
                            message: data.message
                        });

                        return;
                    }

                    $scope.form_original_data = $("#editForm").serialize();

                    AlertService.addFlash({
                        type: 'success',
                        message: $scope.isNew ? "Thêm mới tài khoản thành công" : "Cập nhật tài khoản thành công"
                    });

                    $state.go('^.list');
                })
            // .catch(function (response) {
            //     $scope.formProcessing = false;
            //     document.documentElement.scrollTop = 0;
            //
            //     // if (response.data.message) {
            //     AlertService.replaceAlerts({
            //         type: 'error',
            //         message: "Có lỗi xảy ra! Hãy thử cập nhật lại."
            //     });
            //
            //     // return;
            //     // }
            //
            //     // var errorCheck = ServerErrorProcessor.setFormValidationErrors(response, $scope.editForm, $scope.fieldNameTranslations);
            //     //
            //     // return errorCheck;
            //
            // });
        };

        $scope.backToList = function () {
            $state.go('^.list');
        };

        $scope.$on('$stateChangeStart', function (event) {
            if ($scope.formProcessing) {
                $scope.formProcessing = false;
                return;
            }

            if ($("#editForm").serialize() !== $scope.form_original_data || imageChange) {
                let confirmBack = confirm($translate.instant("CHANGES_YOU_MADE_MAY_NOT_BE_SAVED"));
                if (confirmBack === false) {
                    event.preventDefault();
                }
            }
        });

        let imageChange = false;
        let uploader = $scope.uploader = new FileUploader({
            // url: API_UPDATE_IMAGES,
            headers: {Authorization: 'Bearer ' + user.token},
            removeAfterUpload: true,
            alias: 'image'
        });

        $scope.invalidExtension = false;
        $scope.filters = ['gif', 'jpg', 'jpeg', 'png'];
        let _URL = "";
        $(document).ready(function () {
            _URL = window.URL || window.webkitURL;
        });

        uploader.filters.push({
            name: 'imageFilter',
            fn: function (item /*{File|FileLikeObject}*/, options) {
                $scope.invalidExtension = false;
                let type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                let result = '|jpg|png|jpeg|gif|'.indexOf(type) !== -1;
                if (!result) {
                    $scope.invalidExtension = true;
                    $scope.invalidFileName = item.name;
                }

                return result;
            }
        });

        uploader.onAfterAddingFile = function (item) {
            if ($scope.uploader.queue.length > 1)
                $scope.uploader.queue[0].remove();

            imageChange = true;
            uploader.uploadAll();
        };

        uploader.onProgressItem = function (item, progress) {
            $scope.progressUpload = progress;
        };

        $scope.uploaded = false;

        uploader.onCompleteItem = function (fileItem, response, status, headers) {
            let photo = response[0].link;
            $scope.admin.photo = photo;
            $scope.uploaded = true;
        };

        $scope.clearAllSelected = () => {

        };

        $timeout(function () {
            // Inputmask().mask(document.querySelectorAll("input"));
            $scope.form_original_data = $("#editForm").serialize();
        }, 0);

    }
})();