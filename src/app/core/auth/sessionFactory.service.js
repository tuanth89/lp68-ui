(function () {
    'use strict';

    angular.module('ati.core.auth')
        .factory('sessionFactory', sessionFactory)
    ;

    function sessionFactory(USER_ROLES) {
        let api = {
            /**
             * @param {String|Object} token
             * @param {String} id
             * @param {String} fullName
             * @param {String} username
             * @param {String} email
             * @param {String} photo
             * @param {Array} [userRoles]
             * @param {String} selectedStoreId
             * @param {String} selectedUserId
             * @param {Boolean} isAccountant
             * @param {String} selectedStoreName
             * @param {String} selectedUserCode
             * @param {String} selectedUserName
             */
            createNew: function (token, id, fullName, username, email, userRoles, photo, selectedStoreId, selectedUserId, isAccountant, selectedStoreName, selectedUserCode, selectedUserName) {
                return new Session(token, id, fullName, username, email, userRoles, photo, selectedStoreId, selectedUserId, isAccountant, selectedStoreName, selectedUserCode, selectedUserName);
            },

            /**
             * @param {Object} data
             */
            createNewFrom: function (data) {
                if (!data.token) {
                    throw new Error('missing token');
                }

                if (!data.id) {
                    throw new Error('missing id');
                }

                // if (!data.username) {
                //     throw new Error('missing username');
                // }

                if (!data.email) {
                    throw new Error('missing email');
                }

                if (!data.fullName) {
                    throw new Error('missing name');
                }

                if (!data.photo) {
                    data.photo = '/assets/images/anonymous.png';
                }

                return this.createNew(data.token, data.id, data.fullName, data.username, data.email, data.userRoles, data.photo, data.selectedStoreId, data.selectedUserId, data.isAccountant, data.selectedStoreName, data.selectedUserCode, data.selectedUserName);
            },

            isSession: function (session) {
                return session instanceof Session;
            }
        };

        function Session(token, id, fullName, username, email, userRoles, photo, selectedStoreId, selectedUserId, isAccountant, selectedStoreName, selectedUserCode, selectedUserName) {
            this.token = token;
            this.id = id || null;
            this.username = username;
            this.fullName = fullName;
            this.email = email;
            this.selectedStoreId = selectedStoreId;
            this.selectedStoreName = selectedStoreName;
            this.selectedUserId = selectedUserId;
            this.selectedUserCode = selectedUserCode;
            this.selectedUserName = selectedUserName;
            this.isAccountant = isAccountant;

            if (!angular.isArray(userRoles)) {
                userRoles = [];
            }

            this.userRoles = userRoles;
            this.photo = photo;
        }

        Session.prototype.hasUserRole = function (role) {
            return this.userRoles.indexOf(role) !== -1;
        };

        // Session.prototype.isAdmin = function () {
        //     return this.userRoles.indexOf(USER_ROLES.admin) !== -1;
        // };

        Session.prototype.hasRoleAccountant = function () {
            return this.isAccountant;
        };

        // Session.prototype.isSuperAdmin = function () {
        //     return this.userRoles.indexOf(USER_ROLES.superAdmin) !== -1;
        // };

        return api;
    }
})();