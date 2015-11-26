'use strict';

angular.module('myApp').controller('vSelectSampleCtrl', ['$scope',
  function($scope) {
    $scope.selectTest = {};

    $scope.selectConfig = {
      displayField: 'name',
      singleSelect: false
    };

    $scope.selectTestContent = JSON.stringify([{
      "name": "a"
    }, {
      "name": "b"
    }, {
      "name": "c"
    }, {
      "name": "d"
    }]);

    $scope.haveAShot = function() {
      $scope.optionError = undefined;
      try {
        var _options = JSON.parse($scope.selectTestContent);
        console.log(_options);
        $scope.selectTest.updateOptions(_options);
      } catch (e) {
        $scope.optionError = 'Error to parse to JSON.... Don\'t tease me...';
      }
    };

    $scope.hide = function() {
      $scope.selectTest.hideItemList();
    };

    $scope.selectTest.afterValueUpdated = function() {
      $scope.selectTest.showItemList();
    };
  }
]);
