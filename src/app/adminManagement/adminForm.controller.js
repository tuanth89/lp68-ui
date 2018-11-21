(function () {
    'use strict';

    angular.module('ati.adminManagement')
        .controller('AdminForm', AdminForm)
    ;

    function AdminForm($scope, $translate, $state, FileUploader, AlertService, StudentManager, ServerErrorProcessor, Auth,
                       admin, $anchorScroll, API_END_POINT, API_UPDATE_IMAGES, SPECIAL_CHARACTER_PATTERN, moment, USER_ROLES, UserManager, $timeout, admins) {
        let user = Auth.getSession();
        let adminList = angular.copy(admins);

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

        $scope.isNew = admin === null;
        $scope.formProcessing = false;
        $scope.repeatPassword = null;

        if (admin) {
            admin.password = null;
            if (admin.dateIn)
                admin.dateIn = moment(admin.dateIn).format("DD/MM/YYYY");
            if (admin.dob)
                admin.dob = moment(admin.dob).format("DD/MM/YYYY");
            if (admin.dateOfIssue)
                admin.dateOfIssue = moment(admin.dateOfIssue).format("DD/MM/YYYY");
        }

        $scope.admin = admin || {
            name: null,
            username: null,
            email: null,
            enabled: true,
            phone: null,
            photo: null,
            gender: "0",
            dateIn: null,
            dob: null,
            hometown: null,
            numberId: null,
            dateOfIssue: null,
            placeOfIssue: null,
            title: null,
            password: null
        };

        $scope.isFormValid = function () {
            return $scope.editForm.$valid && !$scope.invalidExtension;
        };

        $scope.submit = function () {
            if ($scope.formProcessing) {
                // already running, prevent duplicates
                return;
            }

            if ($scope.admin.name.match(SPECIAL_CHARACTER_PATTERN)) {
                AlertService.replaceAlerts({
                    type: 'error',
                    message: 'Tên không được chứa ký tự đặc biệt!'
                });

                $anchorScroll();
                return false;
            }

            let date;

            date = moment($scope.admin.dateIn);
            if ($scope.admin.dateIn && date.isValid()) {
                $scope.admin.dateIn = date.format("YYYY-DD-MM");
            }
            else
                $scope.admin.dateIn = "";

            date = moment($scope.admin.dob);
            if ($scope.admin.dob && date.isValid()) {
                $scope.admin.dob = date.format("YYYY-DD-MM");
            }
            else
                $scope.admin.dob = "";

            date = moment($scope.admin.dateOfIssue);
            if ($scope.admin.dateOfIssue && date.isValid()) {
                $scope.admin.dateOfIssue = date.format("YYYY-DD-MM");
            }
            else
                $scope.admin.dateOfIssue = "";

            if ($scope.isNew) {
                $scope.admin.roles = [USER_ROLES.admin];
            }

            if (!$scope.admin.password) {
                delete $scope.admin.password;
            }

            let exist = adminList.filter(admin => {
                if ($scope.isNew) {
                    return admin.username.toLowerCase() === $scope.admin.username.toLowerCase();
                }

                return admin.username.toLowerCase() === $scope.admin.username.toLowerCase() && admin._id !== $scope.admin._id;
            });

            if (exist.length > 0) {
                AlertService.replaceAlerts({
                    type: 'error',
                    message: $translate.instant('ADDNEW_MODULE.DUPLICATE_USERNAME')
                });

                return false;
            }

            $scope.formProcessing = true;

            var saveUser = $scope.isNew ? UserManager.post($scope.admin) : StudentManager.one(admin._id).customPUT($scope.admin);
            ;

            saveUser
                .then(
                    function () {
                        AlertService.addFlash({
                            type: 'success',
                            message: $scope.isNew ? $translate.instant('USERS_MANAGEMENT_MODULE.ADD_NEW_SUCCESS') : $translate.instant('USERS_MANAGEMENT_MODULE.UPDATE_SUCCESS')
                        });
                    })
                .then(function () {
                    $state.go('^.list');
                })
                .catch(function (response) {
                    $scope.formProcessing = false;
                    document.documentElement.scrollTop = 0;

                    if (response.data.message) {
                        AlertService.replaceAlerts({
                            type: 'error',
                            message: response.data.message
                        });

                        return;
                    }

                    var errorCheck = ServerErrorProcessor.setFormValidationErrors(response, $scope.editForm, $scope.fieldNameTranslations);

                    return errorCheck;
                });
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
            url: API_UPDATE_IMAGES,
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

        $timeout(function () {
            Inputmask().mask(document.querySelectorAll("input"));
            $scope.form_original_data = $("#editForm").serialize();
        }, 0);
    }
})();