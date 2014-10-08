/// <reference path="../../typings/tsd.d.ts" />

var app = angular.module('app', ['ngRoute', 'ngSanitize']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
    .when('/', {
        controller: 'HomeCtrl',
        templateUrl: 'views/home'})
    .otherwise({
        redirectTo: '/'
    });
}]);
