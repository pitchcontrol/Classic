(function () {
    "use strict";
    var modalService = function ($http, $uibModal,generator) {
        //Подтвеждение
        this.confirm = function (title, message) {
            return $uibModal.open({
                templateUrl: 'views/confirmModal.html',
                controller: 'confirmModalCtrl',
                resolve: {
                    data: function () {
                        return {
                            title: title,
                            message: message
                        };
                    }
                }
            }).result;
        }
        ;
        this.info = function (title, message) {
            return $uibModal.open({
                templateUrl: 'views/infoModal.html',
                controller: 'infoModalCtrl',
                resolve: {
                    data: function () {
                        return {
                            title: title,
                            message: message
                        };
                    }
                }
            }).result;
        };
        this.selectGenerator = function (title, message, promise){
            return $uibModal.open({
                templateUrl: 'views/selectGeneratorModal.html',
                controller: 'selectModalCtrl',
                resolve: {
                    data: function () {
                        return {
                            title: title,
                            message: message
                        };
                    },
                    promise: function () {
                        return promise;
                    }
                }
            }).result;
        };
        this.select = function (title, message, promise) {
            return $uibModal.open({
                templateUrl: 'views/selectModal.html',
                controller: 'selectModalCtrl',
                resolve: {
                    data: function () {
                        return {
                            title: title,
                            message: message
                        };
                    },
                    promise: function () {
                        return promise;
                    }
                }
            }).result;
        };
        this.wizard = function (title, message, promise) {
            return $uibModal.open({
                templateUrl: 'views/wizardCtrl.html',
                controller: 'wizardCtrl',
                resolve: {
                    data: function () {
                        return {
                            title: title,
                            message: message
                        };
                    },
                    promise: function () {
                        return promise;
                    }
                }
            }).result;
        };
        this.addViewModal = function () {
            $uibModal.open({
                templateUrl: 'views/addViewModal.html',
                controller: 'addViewModalCtrl',
                resolve: {
                    data: null
                }
            });
        }
        ;
        this.editViewModal = function (view) {
            $uibModal.open({
                templateUrl: 'views/addViewModal.html',
                controller: 'addViewModalCtrl',
                resolve: {
                    data: function () {
                        return view;
                    }
                }
            });
        };
        this.signUp = function () {
            return $uibModal.open({
                templateUrl: 'views/signUpModal.html',
                controller: 'signUpModalCtrl'
            }).result;
        };
        this.addEnum = function (model) {
            return $uibModal.open({
                templateUrl: 'views/enumModal.html',
                controller: 'enumModalCtrl',
                resolve: {
                    data: function () {
                        return model;
                    }
                }
            }).result;
        };
        this.addGenerator = function () {
            var data = generator.create();
            data.method = data.save;
            return $uibModal.open({
                //templateUrl: 'views/addTemplateModal.html',
                //controller: 'addTemplateModalCtrl',
                templateUrl: 'views/universalModal.html',
                controller: 'universalModalCtrl',
                resolve: {
                    data: function () {
                        return data
                    }
                }
            }).result;
        };
    };
    angular.module('app').service('modalService', ['$http', '$uibModal', 'generator',modalService]);
})();
