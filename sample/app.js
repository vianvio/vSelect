'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'vSelect'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/index', {
      templateUrl: 'sample/vSelectSample/vSelectSample.html',
      controller: 'vSelectSampleCtrl'
    })
    .otherwise({
      redirectTo: '/index'
    });
}]);