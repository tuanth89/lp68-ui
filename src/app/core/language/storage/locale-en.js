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
            "CLINIC": "Clinic",
            "DOCTOR": "Doctor",
            "ASSISTANT": "Assistant",
            "INSURER": "Insurer",
            "CAR_BRAND": "Car Brand",
            "DATE_RANGE": "Date Range",
            "START_DATE": "Start Date",
            "END_DATE": "End Date",
            "DATE": "Date",
            "HEALTH_CHECK_NEW": 'Health check new',
            "HEALTH_CHECK_AGAIN": 'Health check again',
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
                "CLINICS": "Clinics",
                "DOCTORS": "Doctors",
                "ASSISTANTS": "Assistants",
                "NEW_CLINIC": "New Clinic",
                "NEW_DOCTOR": "New Doctor",
                "NEW_ASSISTANT": "New Assistant",
                "MANAGEMENT": "Patient Requests",
                "TODAY_VISIT_REQUESTS": "Today Requests",
                "ALL_VISIT_REQUEST": "All Requests",
                "EARNING_REPORT": "Earning Report",
                "TODAY_WORKBOARD": "Today Workboard",
                STUDENTS: "Students",
                LECTURER: 'Lecturer',
                ACCOUNTANT_MANAGER: 'Accountant Manager',
                CUSTOMER_MANAGER: 'Customer Manager',
                CONTENT_MANAGER: 'Content Manager',
                ADMINISTRATOR: 'Administrator',
                LECTURER_MANAGER: 'Lecturer Manager',
                IMAGE_GALLERY: "Image gallery",
                CERTIFICATE: "Certificate",
                VOUCHERS: "Vouchers",
                NOTIFICATIONS: "Notifications",
                SHIP_COD: "Ship COD",
                SETTINGS: "Settings",
                CUSTOMER_REVIEW: "Customer review",
                CUSTOMER_FEEDBACK: "Customer feedback",
                BANNERS: "Banners",
                PAYMENT_HISTORY: "Payment history",
                DASHBOARD: "Dashboard",
                REPORTS: "Reports",
                VIOLATE_REPORT: "Violate report",
                EMAIL_MANAGER: "Email manager",
                ROSE_SETTING: "Rose setting",
                VISIBLE_COURSE_SETTING: "Visible course setting",
                HEADER_FOOTER_SETTING: "Header/Footer setting",
                HEADER_SETTING: "Header setting",
                FOOTER_SETTING: "Footer setting",
                EMAIL_TEMPLATE_SETTING: "Email template",
                EMAIL_RECEIVE_MANAGER: " Email receive manager",
                FREQUENTLY_ASKED_QUESTION: " Frequently asked questions",
                GENERAL_SETTING: "General setting",
                LIST_ROLE: "List role",

                COURSE_BY_TIME_REPORT: "Course by time",
                STUDEN_BY_COURSE_REPORT: "Student by course",
                REVENUE_BY_MONTH_REPORT: "Revenue by month",
                REVENUE_BY_COURSE_REPORT: "Revenue by course",
                NEW_STUDENT_REPORT: "New student",
                LEARN_HOUR_BY_STUDENT_REPORT: "Learn hour by student",
                STUDENT_BY_CATEGORY_REPORT: "Number Student by Category",
                NUMBER_COURSE_REPORT: "Number course",
                PARTNER_MANAGER: "Partner Manager"

            },
            "RESET_PASSWORD_MODULE": {
                "RESET": "Reset",
                "USERNAME_EMAIL": "Username or email",
                "NEW_PASSWORD": "New password",
                "REPEAT_PASSWORD": "Repeat password",
                "RESET_PASSWORD": "Reset password",

                "SEND_EMAIL_SUCCESS": "An email has been sent to '{{ username }}'. It contains a link you must click to reset your password",
                "SEND_EMAIL_FAIL": "Could not reset password for '{{ username }}'",
                "RESET_SUCCESS": "Change successful, login to continue",
                "TOKEN_NOT_EXISTED": "The token '{{ token }}' is not existed",
                "TOKEN_EXPIRED": "The token '{{ token }}' is expired. Please try to reset password again",
                "INTERNAL_ERROR": "Internal error. Please contact administrator for further instruction",

                "HELP_BLOCK_CHECK_EMAIL": "Enter your username or email address that you used to register. We'll send you an email with your username and a link to reset your password."
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
                "BILLING_RATE": "Billing Rate",
                "BILLING_RATE_NEW": "Billing Rate New",
                "BILLING_RATE_RETURN": "Billing Rate Return",
                "SPECIALIZED": "Specialized",
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

                "ADD_NEW_SUCCESS": "The doctor has been updated",
                "UPDATE_PROFILE_SUCCESS": "Your profile is updated successfully",
                "UPDATE_STATUS_FAIL": "Could not change doctor status",
                "PAUSE_STATUS_SUCCESS": "The doctor has been deactivated",
                "ACTIVE_STATUS_SUCCESS": "The doctor has been activated",
                "CURRENTLY_NO_DOCTOR": "There is currently no doctors",

                "BACK_TO_DOCTOR_LIST": "Back to doctor List",
                "SELECT_A_DOCTOR": "Select a doctor",
                "NEW_DOCTOR": "New Doctor",
                "LOGIN_AS_THIS_DOCTOR": "Login as this doctor",
                "LAST_LOGIN": "Last Login",
                "STATUS": "Status",
                "EDIT_DOCTOR": "Edit Doctor",
                "DEACTIVATE_DOCTOR": "Deactivate Doctor",
                "ACTIVATE_DOCTOR": "Activate doctor",
                "SELECT_A_SPECIALIZED": "Select a specialized",
                "SELECT_A_CITY": "Select a city",
                "SELECT_A_CLINIC": "Select a clinic",

                "HELP_BLOCK_SELECT_CLINIC": "Leave it blank if doctor doesn't belong to clinic.",
                "HELP_BLOCK_REPEAT_PASSWORD": "Leave it blank for no change",
                "HELP_BLOCK_BILLING_RATE_NEW": "You can set a custom billing rate for this doctor.",
                "HELP_BLOCK_BILLING_RATE_RETURN": "You can set a custom billing rate for this doctor."
            },
            "ASSISTANT_MODULE": {
                "ADD_NEW_SUCCESS": "The assistant has been updated",
                "UPDATE_PROFILE_SUCCESS": "Your profile is updated successfully",
                "UPDATE_STATUS_FAIL": "Could not change assistant status",
                "PAUSE_STATUS_SUCCESS": "The assistant has been deactivated",
                "ACTIVE_STATUS_SUCCESS": "The assistant has been activated",
                "CURRENTLY_NO_ASSISTANT": "There is currently no assistants",

                "BACK_TO_ASSISTANT_LIST": "Back to assistant List",
                "SELECT_A_ASSISTANT": "Select a assistant",
                "NEW_ASSISTANT": "New Assistant",
                "LOGIN_AS_THIS_ASSISTANT": "Login as this assistant",
                "EDIT_ASSISTANT": "Edit Assistant",
                "DEACTIVATE_ASSISTANT": "Deactivate Assistant",
                "ACTIVATE_ASSISTANT": "Activate Assistant",
                "CALL_FOR_DOCTOR": "Call For Doctor"
            },
            "CLINIC_MODULE": {
                "ADD_NEW_SUCCESS": "The clinics has been updated",
                "UPDATE_PROFILE_SUCCESS": "Your profile is updated successfully",
                "UPDATE_STATUS_FAIL": "Could not change clinic status",
                "PAUSE_STATUS_SUCCESS": "The clinic has been deactivated",
                "ACTIVE_STATUS_SUCCESS": "The clinic has been activated",
                "CURRENTLY_NO_CLINIC": "There is currently no clinic",

                "BACK_TO_CLINIC_LIST": "Back to clinic List",
                "SELECT_A_CLINIC": "Select a clinic",
                "NEW_CLINIC": "New Clinic",
                "LOGIN_AS_THIS_CLINIC": "Login as this clinic",
                "EDIT_CLINIC": "Edit Clinic",
                "DEACTIVATE_CLINIC": "Deactivate Clinic",
                "ACTIVATE_CLINIC": "Activate Clinic"
            },
            "PATIENT_MODULE": {
                "COMPLETED": "Completed",
                "HEALTH_CHECK": "Health Checking",
                "PRE_HEALTH_CHECK": "Pre-health check",
                "PRE_HEALTH_CHECK_COMPLETE": "Pre-health check complete",
                "WAITING": "Waiting",
                "SKIP": "Skip"
            },
            "REPORT_MODULE": {
                "REPORT_TYPE": "Report Type",
                "SELECT_A_REPORT_TYPE": "Select a report type",
                "BREAKDOWN": "Breakdown",
                "OPTION": "Option",
                "SELECT_A_OPTION": "Select a Option",
                'GET_REPORT': "Get Report",

                "TOTAL_COMPLETE": "Total Complete",
                "TOTAL_IN_COMPLETE": "Total In Complete",
                "TOTAL_EARNING_AMOUNT": "Total Earning Amount",
                "BILL_TYPE": "Bill Type",
                "BILL_VALUE": "Bill Value",
                "DETAILS": "Details",
                "REPORT_FAIL": "An error occurred trying to request the report",

                "ALL_DOCTOR": "All Doctor",
                "ALL_CLINIC": "All Clinic",
                "BY_DAY": "By Day",
                "BY_REQUEST": "By Request",
                "BY_DOCTOR": "By Doctor",
                "BY_CLINIC": "By Clinic"
            },
            "DOCTOR_VISIT_MODULE": {
                "SHOW_ASSISTANT_WORKBOARD": "Show Assistant Workboard",
                "CALL_FOR_DOCTOR": 'Call For Doctor',
                "PRE_HEALTH_CHECK": 'Pre Health Check',
                "HEALTH_CHECK": 'Health Check',
                "WAIT_FOR_PRE_HEALTH_CHECK": "Wait for Pre-health Check",
                "NEXT": "Next",
                "SKIP": "Skip",
                "TOTAL_REQUESTS": "Total Requests",
                "WAIT": "Wait",
                "PRE_HEALTH_CHECK_COMPLETED": "Pre Health Check Completed",
                "HEALTH_CHECK_COMPLETED": "Health Check Completed",

                "PRINT": "Print",
                "FILTER_BY_STATUS": "Filter By Status",
                "SELECT_A_TYPE_TO_SEARCH": "Select a type to search",
                "EXPORT_EXCEL": "Export Excel",
                "POSITION": "Position",
                "STATUS": "Status",
                "NO_PATIENTS": "No patients",
                "UPDATE_STATUS_FAIL": "An error occurred. The status could not be updated"
            },
            "LABEL_OPTIONS": {
                all: 'All',
                waiting: 'Waiting',
                skip: 'Skip',
                preHealthCheck: 'Pre Health Check',
                preHealthCheckComplete: 'Pre Health Check Complete',
                healthCheck: 'Health Check',
                completed: 'Health Check Complete'
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
            "CATEGORY_MODULE": {
                CATEGORY: 'Category',
                "NEW_CATEGORY": "New Category",
                "BACK_TO_CATEGORY_LIST": "Back to Category list",
                "NAME": "Name",
                "NAME_PLACEHOLDER": 'Name',
                "DESCRIPTION": "Description",
                "ICON": "Icon",
                "FEATURED_COURSE": "Featured Course",
                "FEATURED_COURSE_PLACEHOLDER": "Choose a featured course",
                "ICON_PLACEHOLDER": "Choose a icon",
                "EDIT_CATEGORY": "Edit Category",
                "DELETE_CATEGORY": "Delete Category",
                "ADD_NEW_SUCCESS": "Added successfully",
                "UPDATE_SUCCESS": "Updated successfully",
                "REMOVE_SUCCESS": "Deleted successfully",
                "DELETE_CONFIRM": "Are you sure want to delete this Category?",
                "DUPLICATE_NAME": "There is a category with this name already!",
                "LOAD_MORE": "Load more..."
            },
            "SUBCATEGORY_MODULE": {
                SUBCATEGORY: 'Subcategory',
                "CATEGORY": "Category",
                "NEW_SUBCATEGORY": "New Subcategory",
                "BACK_TO_SUBCATEGORY_LIST": "Back to Subcategory list",
                "NAME": "Name",
                "DESCRIPTION": "Description",
                "EDIT_SUBCATEGORY": "Edit Subcategory",
                "DELETE_SUBCATEGORY": "Delete Subcategory",
                "ADD_NEW_SUCCESS": "Added Subcategory successfully",
                "UPDATE_SUCCESS": "Updated Subcategory successfully",
                "REMOVE_SUCCESS": "Deleted Subcategory successfully",
                "DELETE_CONFIRM": "Are you sure want to delete this SubCategory?",
                "DUPLICATE_NAME": "There is a subcategory with this name already!",
                COURSE_TOTAL: 'Course total',
            },
            "TOPIC_MODULE": {
                TOPIC: 'Topic',
                "NEW_TOPIC": "New Topic",
                "BACK_TO_TOPIC_LIST": "Back to Topic list",
                "NAME": "Name",
                "DESCRIPTION": "Description",
                "EDIT_TOPIC": "Edit Topic",
                "DELETE_TOPIC": "Delete Topic",
                "ADD_NEW_SUCCESS": "Added Topic successfully",
                "UPDATE_SUCCESS": "Updated Topic successfully",
                "REMOVE_SUCCESS": "Deleted Topic successfully",
                "DELETE_CONFIRM": "Are you sure want to delete this Topic?",
                "DUPLICATE_NAME": "There is a Topic with this name already!",
                PUBLISH_SUCCESS: "Publish success",
                UNPUBLISH_SUCCESS: "Unpublish success",
            },
            "COURSE_MODULE": {
                COURSE: 'Course',
                "BACK_TO_COURSE_LIST": "Back to Course list",
                "NAME": "Name",
                "DESCRIPTION": "Description",
                "DATE_CREATED": "Created At",
                "TOTAL_ITEM": "Total Item",
                // "STATUS": "Status Publish",
                "INSTRUCTOR": "Instructor",
                "EDIT_COURSE": "Edit Course",
                "DELETE_COURSE": "Delete Course",
                "APPROVE_COURSE": "Approve Course",
                APPROVE_COURSE_SUCCESS: "Approve Course success",
                "UPDATE_SUCCESS": "Updated Course successfully",
                "REMOVE_SUCCESS": "Deleted Course successfully",
                "DELETE_CONFIRM": "Are you sure want to delete this course?",
                "DELETE_ERROR_CODE_1": "Xóa không thành công. Khóa học này đã có học viên.",
                CATEGORY_PLACEHOLDER: "Select Category",
                CATEGORY: 'Category',
                PUBLISHED: 'Published',
                UNPUBLISHED: 'Unpublished',
                PUBLISH_COURSE: "Publish Course",
                PUBLISH_COURSE_SUCCESS: "Publish Course success",
                UNPUBLISH_COURSE: "Unpublish Course",
                UNPUBLISH_COURSE_SUCCESS: "Unpublish Course success",
                APPROVED: 'Approved',
                UNAPPROVED: 'Unapproved',
                STATUS_APPROVED: 'Status approve',
                STATUS: "Status",
            },
            "PAGE_ACCESS_MODULE": {
                "NAME": "Page Name",
                "READ": "Read",
                "CREATE": "Create",
                "UPDATE": "Update",
                "DELETE": "Delete",
                "ROLE": "Role",
                "CHECK_ALL": "Check All",
                "UNCHECK_ALL": "Uncheck All",
                ROLE_ADMIN: "Admin",
                ROLE_ACCOUNTANT: "Accountant",
                ROLE_CONTENT_MANAGER: "Content Manager",
                ROLE_CUSTOMER_MANAGER: "Customer Manager",
                ROLE_LECTURER_MANAGER: "Lecturer Manager"
            },
            USERS_MANAGEMENT_MODULE: {
                USER_MANAGEMENT: 'User Management',
                ACTIVE_STATUS_SUCCESS: "User has been activated",
                DEACTIVE_STATUS_SUCCESS: "User has been deactivated",
                UPDATE_STATUS_FAIL: "Could not change user status",
                NEW_STUDENT: "New Student",
                EDIT_STUDENT: "Edit Student",
                BACK_TO_STUDENT_LIST: "Back to User list",
                USERNAME: 'Username',
                ADD_NEW_SUCCESS: "The user has been updated",
                CURRENTLY_NO_STUDENT: "There is currently no students",
                // Lecturer.
                CURRENTLY_NO_LECTURER: "There is currently no lecturers",
                BACK_TO_LECTURER_LIST: "Back to Lecturer list",
                NEW_LECTURER: "New Lecturer",
                EDIT_LECTURER: "Edit Lecturer",

                // Content manager
                EDIT_CONTENT_MANAGER: "Edit Content Manager",
                DELETE_CONTENT_MANAGER: "Delete Content Manager",
                CURRENTLY_NO_CONTENT_MANAGER: "There is currently no content manager",
                BACK_TO_CONTENT_MANAGER_LIST: "Back to Lecturer content manager",
                DELETE_CONFIRM: "Are you sure want to delete this account?",
                DELETE_SUCCESS: "Account has been deleted!"
            },
            CHANGE_PASSWORD_MODULE: {
                ENTER_CURRENT_PASSWORD: 'Current password',
                ENTER_NEW_PASSWORD: 'New password',
                RE_ENTER_NEW_PASSWORD: 'Re-Enter new password',
                CHANGE_PASSWORD_SUCCESS: 'Change password success'
            },
            "ACCOUNTANT_MODULE": {
                "NEW": "New Accountant",
                "BACK_TO_LIST": "Back to Accountant list"
            },
            "CONTENT_MANAGER_MODULE": {
                "NEW": "New Content Manager",
                "BACK_TO_LIST": "Back to Content Manager list"
            },
            "CUSTOMER_MANAGER_MODULE": {
                "NEW": "New Customer Manager",
                "BACK_TO_LIST": "Back to Customer Manager list"
            },
            "LECTURER_MANAGER_MODULE": {
                "NEW": "New Lecturer Manager",
                "BACK_TO_LIST": "Back to Lecturer Manager list"
            },
            "ADMIN_MODULE": {
                "NEW": "New Admin",
                "BACK_TO_LIST": "Back to Admin list"
            },
            "LECTURER_MODULE": {
                "NEW": "New Lecturer",
                "BACK_TO_LIST": "Back to Lecturer list"
            },
            "STUDENT_MODULE": {
                "NEW": "New Student",
                "BACK_TO_LIST": "Back to Student list"
            },
            DASHBOARD_MODULE: {
                TOTAL_STUDENT: "Total student",
                TOTAL_LECTURE: "Total lecture",
                TOTAL_COURSE: "Total course",
                TOTAL_COURSE_PUBLISHED: "Total course (Published)",
                TOTAL_COURSE_NOT_PUBLISHED: "Total course (Not publish)",
                TOTAL_NEW_STUDENT: "Total new student",
                TOTAL_SUBSCRIBE_COURSE: "Total subcribe course"
            },
            ADDNEW_MODULE: {
                "USERNAME": "Username (at least 6 characters)",
                "PASSWORD": "Password (at least 3 characters)",
                ENTER_PASSWORD_INVALID: "Password must be at least 3 characters.",
                DUPLICATE_USERNAME: "Username already exists!"
            },

            PARTNER_MODULE: {
                NEW_PARTNER: "New partner"
            }
        });
})();