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
            "ID": "ID",
            "RECORDS_FOUND": 'bản ghi được tìm thấy',
            "HOME_PAGE": "Trang Chủ",

            "NAME": "Tên",
            "DOCTOR": "Bác Sỹ",
            "CLINIC": "Phòng Khám",
            "ASSISTANT": "Trợ Lý",
            "DATE_RANGE": "Khoảng thời gian",
            "START_DATE": "Thời gian bắt đầu",
            "END_DATE": "Thời gian kết thúc",
            "DATE": "Thời gian",
            "HEALTH_CHECK_NEW": 'Khám mới',
            "HEALTH_CHECK_AGAIN": 'Khám lại',
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
            COURSE_TOTAL: 'Tổng khóa học',
            SUBCATEGORY: 'Danh Mục cấp 2',
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
                "CLINICS": "Danh sách Phòng khám",
                "USERS_MANAGEMENT": "Quản lý Người dùng",
                "ASSISTANT_MANAGEMENT": "Quản lý Trợ lý",
                "DOCTORS": "Danh sách Bác sỹ",
                "ASSISTANTS": "Danh sách Trợ lý",
                "NEW_CLINIC": "Thêm mới Phòng khám",
                "NEW_DOCTOR": "Thêm mới Bác sỹ",
                "NEW_ASSISTANT": "Thêm mới Trợ lý",
                "MANAGEMENT": "Danh sách Bệnh nhân",
                "TODAY_VISIT_REQUESTS": "Bệnh nhân Hôm nay",
                "ALL_VISIT_REQUEST": "Tất cả Bệnh nhân",
                "EARNING_REPORT": "Báo cáo Thu nhập",
                "TODAY_WORKBOARD": "Gọi Bệnh nhân",
                STUDENTS: "Học viên",
                LECTURER: 'Giảng viên',
                ACCOUNTANT_MANAGER: 'Kế toán',
                CUSTOMER_MANAGER: 'Chăm sóc khách hàng',
                CONTENT_MANAGER: 'Quản trị nội dung',
                ADMINISTRATOR: 'Người quản lý',
                LECTURER_MANAGER: 'Quản lý giảng viên',

                IMAGE_GALLERY: "Thư viện ảnh",
                CERTIFICATE: "Chứng chỉ",
                VOUCHERS: "Voucher",
                NOTIFICATIONS: "Quản lý thông báo",
                SHIP_COD: "Ship COD",
                SETTINGS: "Cấu hình website",
                CUSTOMER_REVIEW: "Nhận xét của khách hàng",
                CUSTOMER_FEEDBACK: "Thông tin góp ý",
                BANNERS: "Quản lý banner",
                PAYMENT_HISTORY: "Lịch sử thanh toán",
                DASHBOARD: "Dashboard",
                REPORTS: "Báo cáo thống kê",
                VIOLATE_REPORT: "Quản lý báo cáo vi phạm",
                EMAIL_MANAGER: "Quản lý email",
                ROSE_SETTING: "Cấu hình hoa hồng",
                VISIBLE_COURSE_SETTING: "Danh sách khóa học",
                HEADER_FOOTER_SETTING: "Quản lý header/footer",
                HEADER_SETTING: "Header",
                FOOTER_SETTING: "Footer",
                EMAIL_TEMPLATE_SETTING: "Cấu hình mẫu email",
                EMAIL_RECEIVE_MANAGER: "Quản lý nhận email",
                FREQUENTLY_ASKED_QUESTION: "Câu hỏi thường gặp",
                GENERAL_SETTING: "Cấu hình chung",
                LIST_ROLE: "Danh sách nhóm quyền",

                COURSE_BY_TIME_REPORT: "Thống kê số lượng khóa học theo thời gian",
                STUDEN_BY_COURSE_REPORT: "Thống kê số lượng học viên theo khóa học",
                REVENUE_BY_MONTH_REPORT: "Báo cáo doanh thutháng",
                REVENUE_BY_COURSE_REPORT: "Báo cáo doanh thu theo khóa học",
                NEW_STUDENT_REPORT: "Báo cáo số lượng học viên mới",
                LEARN_HOUR_BY_STUDENT_REPORT: "Báo cáo số giờ học viên đã học",
                STUDENT_BY_CATEGORY_REPORT: "Thống kê số lượng học viên theo danh mục",
                PARTNER_MANAGER: "Quản lý đối tác"
            },
            "RESET_PASSWORD_MODULE": {
                "RESET": "Làm mới",
                "USERNAME_EMAIL": "Tên đăng nhập hoặc email",
                "NEW_PASSWORD": "Mật khẩu mới",
                "REPEAT_PASSWORD": "Nhặc lại mật khẩu",
                "RESET_PASSWORD": "Làm mới mật khẩu",

                "SEND_EMAIL_SUCCESS": "Một email đã được gửi tới '{{ username }}'. Trong đó chứa đường dẫn để bạn làm mới mật khẩu của mình",
                "SEND_EMAIL_FAIL": "Không thể làm mới mật khẩu cho '{{ username }}'",
                "RESET_SUCCESS": "Thay đổi thành công, đăng nhập để tiếp tục",
                "TOKEN_NOT_EXISTED": "Thẻ '{{ token }}' không tồn tại",
                "TOKEN_EXPIRED": "Thẻ '{{ token }}' đã hết hạn. Xin vui lòng làm mới lại mật khẩu",
                "INTERNAL_ERROR": "Lỗi cục bộ. Xin vui lòng liên hệ với quản trị viên để được hướng dẫn",

                "HELP_BLOCK_CHECK_EMAIL": "Điền tên đăng nhập hoặc địa chỉ email của bạn cần làm mới. Chúng tôi sẽ gửi cho bạn mội email với tên đăng nhập của bạn và một đường dẫn để bạn làm mới mật khẩu của mình."
            },
            DASHBOARD_MODULE: {
                TOTAL_STUDENT: "Tổng số học viên",
                TOTAL_LECTURE: "Tổng số giảng viên",
                TOTAL_COURSE: "Tổng số khóa học",
                TOTAL_COURSE_PUBLISHED: "Tổng khóa học (đã duyệt)",
                TOTAL_COURSE_NOT_PUBLISHED: "Tổng khóa học (chưa duyệt)",
                TOTAL_NEW_STUDENT: "Tổng số học viên mới",
                TOTAL_SUBSCRIBE_COURSE: "Tổng số đăng ký học"
            },
            ADDNEW_MODULE: {
                "USERNAME": "Tên đăng nhập (ít nhất 6 ký tự)",
                "PASSWORD": "Mật khẩu (ít nhất 3 ký tự)",
                ENTER_PASSWORD_INVALID: "Mật khẩu phải có ít nhất 3 ký tự.",
                DUPLICATE_USERNAME: "Tên đăng nhập đã tồn tại!"
            }
        });
})();