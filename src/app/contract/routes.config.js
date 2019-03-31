(function () {
    'use strict';
    angular.module('ati.contract')
        .config(addStates);

    function addStates(UserStateHelperProvider) {
        UserStateHelperProvider
            .state('contract', {
                abstract: true,
                url: '/hop-dong',
                views: {
                    'content@app': {
                        controller: 'ContractController',
                        templateUrl: 'contract/contract.tpl.html'
                    }
                }
            })
            // .state('contract.cusNew', {
            //     url: '/hop-dong-moi-cu',
            //     views: {
            //         'content@app.root.contract': {
            //             controller: 'CustomerNewController',
            //             templateUrl: 'contract/customerNew.tpl.html'
            //         }
            //     },
            //     resolve: {
            //         customerSource: function ($stateParams, CustomerManager, Auth) {
            //             return CustomerManager.one('list').one('autoComplete').getList("", {storeId: Auth.getSession().selectedStoreId, userId: Auth.getSession().selectedUserId});
            //         }
            //     }
            // })
            // .state('contract.cusOld', {
            //     url: '/hop-dong-cu',
            //     views: {
            //         'content@app.root.contract': {
            //             controller: 'ContractOldController',
            //             templateUrl: 'contract/hopDongCu/contractOld.tpl.html'
            //         }
            //     },
            //     resolve: {
            //         customerSource: function ($stateParams, CustomerManager, Auth) {
            //             return CustomerManager.one('list').one('autoComplete').getList("", {storeId: Auth.getSession().selectedStoreId, userId: Auth.getSession().selectedUserId});
            //         }
            //     }
            // })
            .state('contract.contractNew', {
                url: '/hop-dong-moi',
                views: {
                    'content@app.root.contract': {
                        controller: 'ContractNewController',
                        templateUrl: 'contract/hopDongMoi/contractNew.tpl.html'
                    }
                }
            })
            .state('contract.contractOld', {
                url: '/hop-dong-cu',
                views: {
                    'content@app.root.contract': {
                        controller: 'ContractTypeOldController',
                        templateUrl: 'contract/hopDongMoi/contractOld.tpl.html'
                    }
                }
            })
            .state('contract.cusCirculation', {
                url: '/luu-thong?q&date&p',
                views: {
                    'content@app.root.contract': {
                        controller: 'CustomerCirculationController',
                        templateUrl: 'contract/customerCirculation.tpl.html'
                    }
                }
            })
            .state('contract.daoHan', {
                url: '/dao-han',
                views: {
                    'content@app.root.contract': {
                        controller: 'ContractDaoHanController',
                        templateUrl: 'contract/daoHan/contractDaoHan.tpl.html'
                        // resolve: {
                        //     contracts: function($stateParams, ContractManager) {
                        //         return ContractManager.one('allContract').one('byType').getList("",{type: 1});
                        //     }
                        // }
                    }
                }
            })
            .state('contract.laiDung', {
                url: '/lai-dung',
                views: {
                    'content@app.root.contract': {
                        controller: 'ContractLaiDungController',
                        templateUrl: 'contract/laiDung/contractLaiDung.tpl.html',
                        // resolve: {
                        //     contracts: function($stateParams, ContractManager) {
                        //         return ContractManager.one('allContract').one('byType').getList("",{type: 2});
                        //     }
                        // }
                    }
                }
            })
            .state('contract.thuVe', {
                url: '/thu-ve',
                views: {
                    'content@app.root.contract': {
                        controller: 'ContractThuVeController',
                        templateUrl: 'contract/thuVe/contractThuVe.tpl.html',
                        // resolve: {
                        //     contracts: function($stateParams, ContractManager) {
                        //         return ContractManager.one('allContract').one('byType').getList("",{type: 3});
                        //     }
                        // }
                    }
                }
            })
            .state('contract.chot', {
                url: '/chot',
                views: {
                    'content@app.root.contract': {
                        controller: 'ContractChotController',
                        templateUrl: 'contract/chot/contractChot.tpl.html',
                        // resolve: {
                        //     contracts: function($stateParams, ContractManager) {
                        //         return ContractManager.one('allContract').one('byType').getList("",{type: 4});
                        //     }
                        // }
                    }
                }
            })
            .state('contract.be', {
                url: '/be',
                views: {
                    'content@app.root.contract': {
                        controller: 'ContractBeController',
                        templateUrl: 'contract/be/contractBe.tpl.html',
                        // resolve: {
                        //     contracts: function($stateParams, ContractManager) {
                        //         return ContractManager.one('allContract').one('byType').getList("",{type: 5});
                        //     }
                        // }
                    }
                }
            })
            .state('contract.ketThuc', {
                url: '/ket-thuc',
                views: {
                    'content@app.root.contract': {
                        controller: 'ContractKetThucController',
                        templateUrl: 'contract/ketThuc/contractKetThuc.tpl.html',
                        // resolve: {
                        //     contracts: function($stateParams, ContractManager) {
                        //         return ContractManager.one('allContract').one('byType').getList("",{type: 6});
                        //     }
                        // }
                    }
                }
            })
            .state('contract.hetHo', {
                url: '/het-ho',
                views: {
                    'content@app.root.contract': {
                        controller: 'ContractHetHoController',
                        templateUrl: 'contract/hetHo/contractHetHo.tpl.html',
                        // resolve: {
                        //     contracts: function($stateParams, ContractManager) {
                        //         return ContractManager.one('allContract').one('byType').getList("",{type: 6});
                        //     }
                        // }
                    }
                }
            })
        // .state('contract.test', {
        //     url: '/calendar-test',
        //     views: {
        //         'content@app.root.contract': {
        //             controller: 'CalendarTestController',
        //             templateUrl: 'contract/test/calendarTest.tpl.html'
        //         }
        //     }
        // })
    }
})();