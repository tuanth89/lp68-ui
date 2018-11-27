(function () {
    'use strict';

    angular.module('ati.core.auth')
        .factory('sessionFactory', sessionFactory)
        ;

    function sessionFactory(USER_ROLES) {
        var api = {
            /**
             * @param {String|Object} token
             * @param {String} id
             * @param {String} fullName
             * @param {String} username
             * @param {String} email
             * @param {String} photo
             * @param {Array} [userRoles]
             */
            createNew: function(token, id, fullName, username, email, userRoles, photo) {
                return new Session(token, id, fullName, username, email, userRoles, photo);
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

                if (!data.username) {
                    throw new Error('missing username');
                }

                if (!data.email) {
                    throw new Error('missing email');
                }

                if (!data.fullName) {
                    throw new Error('missing name');
                }

                if(!data.photo) {
                    data.photo = '/assets/images/45611310_7ad3.jpg';
                }

                return this.createNew(data.token, data.id, data.fullName, data.username, data.email, data.userRoles, data.photo);
            },

            isSession: function (session) {
                return session instanceof Session;
            }
        };

        function Session(token, id, fullName, username, email, userRoles, photo) {
            this.token = token;
            this.id = id || null;
            this.username = username;
            this.fullName = fullName;
            this.email = email;

            if (!angular.isArray(userRoles)) {
                userRoles = [];
            }

            this.userRoles = userRoles;
            this.photo = photo;
        }

        Session.prototype.hasUserRole = function (role) {
            return this.userRoles.indexOf(role) !== -1;
        };

        Session.prototype.isAdmin = function () {
            return this.userRoles.indexOf(USER_ROLES.admin) !== -1;
        };

        Session.prototype.isSuperAdmin = function () {
            return this.userRoles.indexOf(USER_ROLES.superAdmin) !== -1;
        };

        return api;
    }
})();