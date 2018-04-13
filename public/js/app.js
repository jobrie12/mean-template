// public/js/app.js
angular.module('meanApp', ['ui.router', 'ngRoute', 'MainCtrl', 'AuthCtrl', 'AuthService'])
    .config([
        '$stateProvider',
        '$urlRouterProvider',
        '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {

            $stateProvider
            // home page
            .state('home', {
                url: '/home',
                templateUrl: 'views/home.tpl.html',
                controller: 'MainController'
            }).state('login', {
                url: '/login',
                templateUrl: 'views/login.tpl.html',
                controller: 'AuthController'
            }).state('signup', {
                url: '/signup',
                templateUrl: 'views/signup.tpl.html',
                controller: 'AuthController'
            });

            $urlRouterProvider.otherwise('home');

            // use the HTML5 History API
            $locationProvider.html5Mode(true);

        }]);