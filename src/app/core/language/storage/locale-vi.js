(function () {
    "use strict";

    angular.module("ati.core.language")
        .constant("LOCALE_VI", {
            "APP_NAME": "Lộc Phát 68",
            "LOGIN": "Đăng Nhập",
            "LOGOUT": "Đăng Xuất",
            "EDIT_PROFILE": "Sửa hồ sơ Cá nhân",
            "RETURN_TO_ADMIN": "Quay trở lại",
            "PASSWORD": "Mật khẩu",
            "USERNAME": "Tên đăng nhập",
            "REMEMBER_ME": "Nhớ thông tin",
            "FORGOT_PASSWORD": "Quên mật khẩu?",
            "CANCEL": "Hủy bỏ",
            "NO_CANCEL": "Hủy bỏ",
            "YES_DELETE": "Đồng ý",
            "SUBMIT": "Gửi đi",
            "VALID_FORM": "Nút này sẽ hoạt động nếu tất cả các trường có dấu (*) được điền.",
            "ACTIONS": "Thao tác",
            "CLOSE": "Thoát",
            "ALERTS": "Thông Báo",
            "SEARCH": 'Tìm kiếm',
            "RECORDS_FOUND": 'bản ghi được tìm thấy',
            "HOME_PAGE": "Trang Chủ",

            "NAME": "Tên",
            "DATE_RANGE": "Khoảng thời gian",
            "START_DATE": "Thời gian bắt đầu",
            "END_DATE": "Thời gian kết thúc",
            "DATE": "Thời gian",
            "EXPORT_EXCEL": "Tải excel",
            CHANGE_PASSWORD: "Đổi mật khẩu",
            PROFILE: 'Thông tin',
            LIST: 'Danh sách',
            CREATE_NEW: 'Thêm mới',
            USER_ROLES: 'Phân quyền',
            CHANGES_YOU_MADE_MAY_NOT_BE_SAVED: 'Các thay đổi bạn đã thực hiện có thể không được lưu.',
            UPLOAD_FILE_VALID: "có định dạng không phù hợp. Các định dạng cho phép:",
            REQUEST_FAIL: "Có lỗi xảy ra, hãy thử lại sau!",
            ENTER_PHONE_INVALID: "Số điện thoại không đúng định dạng.",
            ENTER_EMAIL_INVALID: "Email không đúng định dạng.",
            ENTER_USERNAME_INVALID: "Tên đăng nhập phải có ít nhất 6 ký tự.",
            FILTER_BY: "Lọc theo",
            "ERROR_PAGE": {
                "400": "Yêu cầu gửi lên máy chủ không hợp lệ",
                "403": "Bạn không có quyền yêu cầu để truy cập trang này",
                "404": "Các nguồn yêu cầu không thể tìm thấy",
                "500": "Có lỗi xảy ra"
            },
            "EVENT_LISTENER": {
                "LOGIN_FAIL": "Lỗi đăng nhập, vui lòng kiểm tra lại thông tin đăng nhập!",
                "LOGOUT_SUCCESS": "Đăng xuất thành công",
                "SESSION_EXPIRED": "Bạn không được xác thực, phiên làm việc của bạn đã hết hạn, mời đăng nhập lại!"
            },
            "NAV_MODULE": {
                "USERS_MANAGEMENT": "Quản lý Người dùng",
                ACCOUNTANT_MANAGER: 'Kế toán',
                ADMINISTRATOR: 'Người quản lý',

                GENERAL_SETTING: "Cấu hình chung",
                LIST_ROLE: "Danh sách nhóm quyền"
            }
        });
})();