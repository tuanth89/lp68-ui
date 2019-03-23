(function () {
    "use strict";

    angular.module("ati.core.language")
        .constant("LOCALE_EN", {
            "APP_NAME": "Lộc Phát 68",
            "LOGIN": "Log in",
            "LOGOUT": "Log Out",
            "EDIT_PROFILE": "Edit Profile",
            "RETURN_TO_ADMIN": "Return to admin account",
            "PASSWORD": "Password",
            "USERNAME": "Username",
            "REMEMBER_ME": "Remember me",
            "FORGOT_PASSWORD": "Forgot your password?",
            "CANCEL": "Cancel",
            "NO_CANCEL": "No, cancel",
            "YES_DELETE": "Yes, delete",
            "SUBMIT": "Submit",
            "VALID_FORM": "Submit button will be active only when all fields are valid.",
            "ACTIONS": "Actions",
            "CLOSE": "Close",
            "ALERTS": "Alerts",
            "SEARCH": 'Search',
            "ID": "ID",
            "RECORDS_FOUND": 'Records found',
            "HOME_PAGE": "Home Page",

            "NAME": "Name",
            "DATE_RANGE": "Date Range",
            "START_DATE": "Start Date",
            "END_DATE": "End Date",
            "DATE": "Date",
            "EXPORT_EXCEL": "Export Excel",
            CHANGE_PASSWORD: "Change password",
            PROFILE: 'Profile',
            LIST: 'List',
            CREATE_NEW: 'Create New',
            USER_ROLES: 'User Roles',
            CHANGES_YOU_MADE_MAY_NOT_BE_SAVED: 'Changes you made may not be saved.',
            UPLOAD_FILE_VALID: "has an invalid extension. Valid extension(s):",
            REQUEST_FAIL: "An error occurred, please try again!",
            ENTER_PHONE_INVALID: "Invalid phone number format.",
            ENTER_EMAIL_INVALID: "The email format is invalid.",
            ENTER_USERNAME_INVALID: "Username must be at least 6 characters.",
            COURSE_TOTAL: 'Course total',
            SUBCATEGORY: 'Subcategory',

            "ERROR_PAGE": {
                "400": "An invalid request was sent to the server",
                "403": "You do not have the required permissions to access this",
                "404": "The requested resource could not be found",
                "500": "An error occurred"
            },
            "EVENT_LISTENER": {
                "LOGIN_FAIL": "Login failed, did you provide an invalid username and/or password?",
                "LOGOUT_SUCCESS": "You are now logged out",
                "SESSION_EXPIRED": "You are not authenticated. This could mean your session expired, please log in again"
            },
            "NAV_MODULE": {
                "USERS_MANAGEMENT": "Users Management",
                "ASSISTANT_MANAGEMENT": "Assistants Management",
                "ASSISTANTS": "Assistants",
                ACCOUNTANT_MANAGER: 'Accountant Manager',
                CUSTOMER_MANAGER: 'Customer Manager',
                CONTENT_MANAGER: 'Content Manager',
                ADMINISTRATOR: 'Administrator',
                IMAGE_GALLERY: "Image gallery",
                SETTINGS: "Settings",
                ROSE_SETTING: "Rose setting",
                GENERAL_SETTING: "General setting",
                LIST_ROLE: "List role"
            },
            "DOCTOR_MODULE": {
                "USERNAME": "Username",
                "PASSWORD": "Password",
                "REPEAT_PASSWORD": "Repeat Password",
                "COMPANY": "Company",
                "EMAIL": "Email",
                "FIRST_NAME": "First Name",
                "LAST_NAME": "Last Name",
                "FULL_NAME": "Full Name",
                "DATE_IN": "Date in",
                "DOB": "Date of birth",
                "HOMETOWN": "Hometown",
                "NUMBER_ID": "Number identification",
                "DATE_OF_ISSUE": "Date of issue",
                "PLACE_OF_ISSUE": "Place of issue",
                "TITLE": "Title",
                "PHONE": "Phone",
                "ADDRESS": "Address",
                "POSTAL_CODE": "Postal Code",
                "CITY": "City",
                "STATE": "State",
                "COUNTRY": "Country",
                "ENABLED": "Enabled",
                "GENDER": 'Gender',
                "MALE": "Male",
                "FEMALE": "Female",
                "AVATAR": "Avatar",
                "CHANGE_AVATAR": "Change avatar",
                "UPLOAD": "Upload",
                "INACTIVE": "Inactive",
                "ACTIVE": "Active",
                "NONE": "None",
                "DOMAIN": "Domain",
                "ROOT_DOMAIN": "Root Domain",
                "CHANGE_AVATAR_CONFIRM": "Are you want to update avatar?",

                "UPDATE_PROFILE_SUCCESS": "Your profile is updated successfully",
                "UPDATE_STATUS_FAIL": "Could not change doctor status",

                "LAST_LOGIN": "Last Login",
                "STATUS": "Status",

            },
            "DATE_RANGE_PICKER": {
                "TOMORROW": "Tomorrow",
                "TODAY": 'Today',
                "YESTERDAY": "Yesterday",
                "LAST7DAYS": "Last 7 Days",
                "LAST30DAYS": "Last 30 Days",
                "THIS_MONTH": "This Month",
                "LAST_MONTH": "Last Month",
                "APPLY": "Apply",
                "CANCEL": "Cancel",
                "FROM": "From",
                "TO": "To",
                "CUSTOM_RANGE": "Custom range",

                "DAY": {
                    "SU": 'Su',
                    "MO": 'Mo',
                    "TU": 'Tu',
                    "WE": 'We',
                    "TH": 'Th',
                    "FR": 'Fr',
                    "SA": 'Sa'
                },

                "MONTH": {
                    "JANUARY": "January, ",
                    "FEBRUARY": "February, ",
                    "MARCH": "March, ",
                    "APRIL": "April, ",
                    "MAY": "May, ",
                    "JUNE": "June, ",
                    "JULY": "July, ",
                    "AUGUST": "August, ",
                    "SEPTEMBER": "September, ",
                    "OCTOBER": "October, ",
                    "NOVEMBER": "November, ",
                    "DECEMBER": "December, "
                },

                "MONTH_SINGLE_DATE": {
                    "JANUARY": "January",
                    "FEBRUARY": "February",
                    "MARCH": "March",
                    "APRIL": "April",
                    "MAY": "May",
                    "JUNE": "June",
                    "JULY": "July",
                    "AUGUST": "August",
                    "SEPTEMBER": "September",
                    "OCTOBER": "October",
                    "NOVEMBER": "November",
                    "DECEMBER": "December"
                },

                "FIRST_DAY": '0'
            },
        });
})();