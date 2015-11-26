'use strict';

/* Directives */

angular.module('vSelect', []).directive('vselect', ['$timeout', function($timeout) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      config: '=',
      model: '='
    },
    link: function(scope, element, attrs, ctrl) {
      /* Operation functions */
      scope.itemChoosed = '';
      scope.itemChoosedList = [];
      scope.arrData = [];
      var _itemListLimit = (scope.config && scope.config.itemListLimit) || 5; // default 5
      scope.optionFilterObj = {};

      // set default
      if (scope.config === undefined) {
        scope.config = {};
      }
      if (scope.config.onDisplayItemList === undefined) {
        scope.config.onDisplayItemList = function(bShowItemList) {};
      }
      if (scope.model.onResultChange === undefined) {
        scope.model.onResultChange = function(item) {};
      }
      if (scope.config.displayField === undefined) {
        scope.config.displayField = 'name';
      }
      if (scope.model.beforeValueUpdated === undefined) {
        scope.model.beforeValueUpdated = function() {};
      }
      if (scope.model.afterValueUpdated === undefined) {
        scope.model.afterValueUpdated = function() {};
      }

      scope.displayItemList = function() {
        scope.showItemList = !scope.showItemList;
        scope.bShowAllItem = scope.filteredItems.length <= _itemListLimit ? true : false;
        scope.itemListLimit = _itemListLimit;
        scope.config.onDisplayItemList(scope.showItemList);
      };

      scope.showAllItem = function() {
        scope.bShowAllItem = true;
        scope.itemListLimit = scope.arrData.length;
      };

      scope._onItemChoosed = function(e, obj) {
        if (scope.config.singleSelect) {
          scope.arrData.forEach(function(item) {
            if (item.checked) {
              item.checked = false;
            }
          });
          obj.checked = true;
          scope.itemChoosedList = [obj[scope.config.displayField]];
          scope.arrChoseItemsObj = [obj];
          scope.allChecked = false;
          scope.model.bAllSelected = false;
          scope.itemChoosed = scope.itemChoosedList.join(', ');
          scope.showItemList = false;
          scope.model.onResultChange();
        } else {
          scope.getItemList(true);
        }
      };

      scope.getItemList = function(bFireEvents) {
        scope.itemChoosedList = [];
        scope.arrChoseItemsObj = [];
        scope.arrData.forEach(function(item) {
          if (item.checked) {
            scope.itemChoosedList.push(item[scope.config.displayField]);
            scope.arrChoseItemsObj.push(item);
          }
        });
        scope.allChecked = true;
        scope.model.bAllSelected = true;
        // posible to have undefined, when starting
        if (scope.filteredItems) {
          scope.filteredItems.forEach(function(item) {
            if (!item.checked) {
              scope.allChecked = false;
              scope.model.bAllSelected = false;
            }
          });
          scope.itemChoosed = scope.itemChoosedList.join(', ');
          if (bFireEvents) {
            scope.model.onResultChange();
          }
        }
      };

      scope.model.updateOptions = function(newOptions) {
        if (JSON.stringify(newOptions) != JSON.stringify(scope.arrData)) {
          scope.arrData = [];
          scope.filteredItems = [];
          var _bFireEvent = true;
          if (newOptions === undefined) {
            _bFireEvent = false;
          }
          if (scope.itemFilter) {
            scope.itemFilter[scope.config.displayField] = '';
          }
          newOptions = newOptions || [];
          // check item is object
          if (typeof newOptions[0] === 'object') {
            // init check status
            newOptions.forEach(function(option) {
              option.checked = false;
            });
            scope.arrData = newOptions;
            scope.filteredItems = newOptions;
          } else {
            newOptions.forEach(function(item) {
              var _optionItem = {};
              _optionItem[scope.config.displayField] = item;
              _optionItem.checked = false;
              scope.arrData.push(_optionItem);
              scope.filteredItems.push(_optionItem);
            });
          }
          if (scope.arrData.length > 0) {
            scope.getItemList(true);
          } else {
            scope.itemChoosedList = [];
            scope.arrChoseItemsObj = [];
            scope.itemChoosed = '';
            if (_bFireEvent) {
              scope.model.onResultChange();
            }
          }
          scope.model.afterValueUpdated();
        }
      }

      scope.checkAll = function(bForceChecked, event) {
        var bCheck = bForceChecked ? true : event.target.checked;
        if (scope.itemFilter) {
          scope.itemFilter[scope.config.displayField] = '';
        }
        if (scope.filteredItems.length > 0) {
          scope.filteredItems.forEach(function(item) {
            item.checked = bCheck;
          });
        } else {
          scope.arrData.forEach(function(item) {
            item.checked = bCheck;
          });
        }

        scope.getItemList(true);
      }

      scope.$watchCollection('filteredItems', function(newFiltered, oldFiltered) {
        if (oldFiltered !== newFiltered) {
          scope.model.beforeValueUpdated();
          scope.$evalAsync(function() {
            // console.log(newFiltered);
            if (newFiltered.filter(function(item) {
                return !item.checked
              }).length > 0 || newFiltered.length === 0) {
              scope.allChecked = false;
            } else {
              scope.allChecked = true;
            }
            // item less then _itemListLimit
            if (newFiltered.length <= _itemListLimit) {
              scope.bShowAllItem = true;
            } else if (scope.itemListLimit === _itemListLimit) {
              scope.bShowAllItem = false;
            }
          });
        }
      });

      /* Model functions */
      scope.model.initDropdown = function() {
        scope.showItemList = false;
        scope.itemChoosed = '';
        scope.itemChoosedList = [];
        scope.arrChoseItemsObj = [];
        if (scope.itemFilter) {
          scope.itemFilter[scope.config.displayField] = '';
        }
        scope.arrData.forEach(function(item) {
          item.checked = false;
        });
        scope.filteredItems = scope.arrData;
        scope.allChecked = false;
        scope.bShowAllItem = false;
        scope.itemListLimit = _itemListLimit;
      };

      scope.model.rechoose = function() {
        scope.getItemList(true);
      };

      scope.model.getSelectedResult = function() {
        return scope.itemChoosedList;
      };

      scope.model.getSelectedResultInObj = function() {
        return scope.arrChoseItemsObj;
      };

      scope.model.setDisabled = function(bDisabled) {
        scope.bDisabled = bDisabled;
      };

      scope.model.setValue = function(arrSelected) {
        arrSelected.forEach(function(value) {
          if (scope.arrData) {
            scope.arrData.forEach(function(item) {
              if (item[scope.config.displayField] === value) {
                item.checked = true;
              }
            });
          }
        });
        scope.getItemList(true);
      }

      scope.model.selectAll = function() {
        // scope.allChecked = true;
        scope.checkAll(true);
      };

      scope.model.hideItemList = function() {
        scope.showItemList = false;
      };

      scope.model.showItemList = function() {
        scope.displayItemList();
        scope.showItemList = true;
      };

      if (scope.model.onDropdownInit) {
        scope.model.onDropdownInit();
      }
    },
    templateUrl: 'src/vSelect.html'
  }
}]);
