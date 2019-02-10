(function () {
    'use strict';

    angular
        .module('ati.admin')
        .directive("validDate", function ($timeout) {
            return {
                require: "ngModel",
                restrict: "A", // Attributes only
                link: function (scope, elem, attr, ctrl) {
                    $timeout(function () {

                        ctrl.$validators.cValidDate = function (value) {
                            if (value === undefined || value === null || value === "" || value.startDate === null) {
                                return true;
                            }

                            return moment(value, ["D-M-YYYY"], true).isValid();
                        }

                        ctrl.$validators.isYearInvalid = function (value) {
                            var invalidYearDate = new Date();
                            invalidYearDate.setFullYear(0o01, 0, 0);
                            var selectedDate = moment(value, ["D-M-YYYY"], true);

                            if (moment(value, ["D-M-YYYY"], true).isValid()) {
                                if (selectedDate <= invalidYearDate) {
                                    return false;
                                } else {
                                    return true;
                                }
                            } else
                                return true;

                        }
                    }, 100);
                }
            }
        })
        .controller('AdminProfileForm', AdminProfileForm);

    function AdminProfileForm($scope, $timeout, $anchorScroll, SPECIAL_CHARACTER_PATTERN, API_UPDATE_IMAGES, FileUploader, Auth, $translate, $state, AlertService, ServerErrorProcessor, admin, moment, dialogModal) {
        $('html, body').animate({
            scrollTop: 0
        }, 'fast');

        let user = Auth.getSession();

        $scope.fieldNameTranslations = {
            username: 'Username',
            plainPassword: 'Password'
        };
        $scope.confirmDelete = $translate.instant('CATEGORY_MODULE.DELETE_CONFIRM');

        $scope.formProcessing = false;
        if (admin.dateIn)
            admin.dateIn = moment(admin.dateIn).format("DD/MM/YYYY");
        if (admin.dob)
            admin.dob = moment(admin.dob).format("DD/MM/YYYY");
        if (admin.dateOfIssue)
            admin.dateOfIssue = moment(admin.dateOfIssue).format("DD/MM/YYYY");
        $scope.admin = admin;

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


        $scope.isFormValid = function () {
            if ($scope.admin.plainPassword !== null || $scope.repeatPassword !== null) {
                return $scope.adminForm.$valid && $scope.repeatPassword === $scope.admin.plainPassword && !$scope.invalidExtension;
            }

            return $scope.adminForm.$valid;
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

            $scope.formProcessing = true;

            delete $scope.admin.enabled;
            delete $scope.admin.lastLogin;
            delete $scope.admin.doctor;
            delete $scope.admin.roles;
            delete $scope.admin.email;

            let date;
            date = moment($scope.admin.dateIn);
            if ($scope.admin.dateIn && date.isValid()) {
                $scope.admin.dateIn = date.format("YYYY-DD-MM");
            } else
                $scope.admin.dateIn = "";

            date = moment($scope.admin.dob);
            if ($scope.admin.dob && date.isValid()) {
                $scope.admin.dob = date.format("YYYY-DD-MM");
            } else
                $scope.admin.dob = "";

            date = moment($scope.admin.dateOfIssue);
            if ($scope.admin.dateOfIssue && date.isValid()) {
                $scope.admin.dateOfIssue = date.format("YYYY-DD-MM");
            } else
                $scope.admin.dateOfIssue = "";

            let saveUser = $scope.admin.one($scope.admin.username).customPUT($scope.admin);

            saveUser
                .catch(
                    function (response) {
                        let errorCheck = ServerErrorProcessor.setFormValidationErrors(response, $scope.adminForm, $scope.fieldNameTranslations);
                        $scope.formProcessing = false;

                        return errorCheck;
                    })
                .then(
                    function () {
                        AlertService.addFlash({
                            type: 'success',
                            message: $translate.instant('ASSISTANT_MODULE.UPDATE_PROFILE_SUCCESS')
                        });
                    })
                .then(
                    function () {
                        Auth.setSessionPropery($scope.admin.name, $scope.admin.photo);
                        $state.reload();
                    });
        };

        let uploader = $scope.uploader = new FileUploader({
            url: API_UPDATE_IMAGES,
            headers: {
                Authorization: 'Bearer ' + user.token
            },
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
            fn: function (item /*{File|FileLikeObject}*/ , options) {
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
            uploader.uploadAll();
            // dialogModal($translate.instant("DOCTOR_MODULE.CHANGE_AVATAR_CONFIRM")).result.then(function (confirm) {
            //     if (confirm) {
            //         uploader.uploadAll();
            //     }
            //
            // });
        };

        $scope.uploaded = false;

        uploader.onCompleteItem = function (fileItem, response, status, headers) {
            $scope.admin.photo = response[0].link;
            $scope.uploaded = true;
        };

        $timeout(function () {
            Inputmask().mask(document.querySelectorAll("input"));
        }, 0);

    }
})();