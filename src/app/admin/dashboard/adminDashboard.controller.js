(function () {
    'use strict';

    angular
        .module('ati.admin')
        .controller('AdminDashboard', AdminDashboard);

    function AdminDashboard($scope, UserStateHelper) {
        $scope.dashboardItem = [];
        let baseSate = UserStateHelper.getBaseState();
        $scope.studentListUrl = baseSate + '.studentManagement.list';
        $scope.courseListUrl = baseSate + '.course.list';

        const drawSparklines = () => {
            if ($('#sparklinedash').length > 0) {
                $('#sparklinedash').sparkline([0, 5, 6, 10, 9, 12, 4, 9], {
                    type: 'bar',
                    height: '20',
                    barWidth: '3',
                    resize: true,
                    barSpacing: '3',
                    barColor: '#4caf50',
                });
            }

            if ($('#sparklinedash2').length > 0) {
                $('#sparklinedash2').sparkline([0, 5, 6, 10, 9, 12, 4, 9], {
                    type: 'bar',
                    height: '20',
                    barWidth: '3',
                    resize: true,
                    barSpacing: '3',
                    barColor: '#9675ce',
                });
            }

            if ($('#sparklinedash3').length > 0) {
                $('#sparklinedash3').sparkline([0, 5, 6, 10, 9, 12, 4, 9], {
                    type: 'bar',
                    height: '20',
                    barWidth: '3',
                    resize: true,
                    barSpacing: '3',
                    barColor: '#03a9f3',
                });
            }

            if ($('#sparklinedash4').length > 0) {
                $('#sparklinedash4').sparkline([0, 5, 6, 10, 9, 12, 4, 9], {
                    type: 'bar',
                    height: '20',
                    barWidth: '3',
                    resize: true,
                    barSpacing: '3',
                    barColor: '#f96262',
                });
            }
        };

        drawSparklines();

        // Redraw sparklines on resize
        // $(window).resize(debounce(drawSparklines, 150));
    }
})();