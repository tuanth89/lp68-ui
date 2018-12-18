(function () {
    'use strict';
    angular.module('ati.contract')
        .config(addStates);

    function addStates(UserStateHelperProvider) {
        UserStateHelperProvider
            .state('contract', {
                abstract: true,
                url: '/contract',
                views: {
                    'content@app': {
                        controller: 'ContractController',
                        templateUrl: 'contract/contract.tpl.html'
                    }
                }
            })
            .state('contract.cusNew', {
                url: '/customer-new',
                views: {
                    'content@app.root.contract': {
                        controller: 'CustomerNewController',
                        templateUrl: 'contract/customerNew.tpl.html'
                    }
                },
                resolve: {
                    customerSource: function($stateParams, CustomerManager) {
                        return CustomerManager.one('list').one('autoComplete').getList();
                    }
                }
            })
            .state('contract.cusCirculation', {
                url: '/customer-circulation',
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
                        templateUrl: 'contract/daoHan/contractDaoHan.tpl.html',
                        resolve: {
                            contracts: function($stateParams, ContractManager) {
                                return ContractManager.one('allContract').one('byType').getList("",{type: 1});
                            }
                        }
                    }
                }
            })
            .state('contract.thuVe', {
                url: '/thu-ve',
                views: {
                    'content@app.root.contract': {
                        controller: 'ContractThuVeController',
                        templateUrl: 'contract/thuVe/contractThuVe.tpl.html',
                        resolve: {
                            contracts: function($stateParams, ContractManager) {
                                return ContractManager.one('allContract').one('byType').getList("",{type: 2});
                            }
                        }
                    }
                }
            })
            .state('contract.chot', {
                url: '/chot',
                views: {
                    'content@app.root.contract': {
                        controller: 'ContractChotController',
                        templateUrl: 'contract/chot/contractChot.tpl.html',
                        resolve: {
                            contracts: function($stateParams, ContractManager) {
                                return ContractManager.one('allContract').one('byType').getList("",{type: 3});
                            }
                        }
                    }
                }
            })
            .state('contract.be', {
                url: '/be',
                views: {
                    'content@app.root.contract': {
                        controller: 'ContractBeController',
                        templateUrl: 'contract/be/contractBe.tpl.html',
                        resolve: {
                            contracts: function($stateParams, ContractManager) {
                                return ContractManager.one('allContract').one('byType').getList("",{type: 4});
                            }
                        }
                    }
                }
            })
            .state('contract.ketThuc', {
                url: '/ket-thuc',
                views: {
                    'content@app.root.contract': {
                        controller: 'ContractKetThucController',
                        templateUrl: 'contract/ketThuc/contractKetThuc.tpl.html',
                        resolve: {
                            contracts: function($stateParams, ContractManager) {
                                return ContractManager.one('allContract').one('byType').getList("",{type: 5});
                            }
                        }
                    }
                }
            })
            .state('contract.test', {
                url: '/calendar-test',
                views: {
                    'content@app.root.contract': {
                        controller: 'CalendarTestController',
                        templateUrl: 'contract/test/calendarTest.tpl.html'
                    }
                }
            })
    }
})();