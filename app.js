(function () {
    'use strict';
    angular.module('NarrowItDownApp', [])
        .controller('NarrowItDownController', NarrowItDownController)
        .service('MenuSearchService', MenuSearchService)
        .directive('foundItems', FoundItemsDirective)
        .constant('ApiBasePath', "https://coursera-jhu-default-rtdb.firebaseio.com");

    function FoundItemsDirective () {
        return {
            templateUrl: 'foundItems.html',
        };
    }

    NarrowItDownController.$inject = ['MenuSearchService', '$scope'];
    function NarrowItDownController(MenuSearchService, $scope) {
        $scope.placeholder = "search term";
        let ctrl = this;
        ctrl.found = [];
        ctrl.getMatchedMenuItems = function () { 
            MenuSearchService.getMatchedMenuItems($scope.placeholder)
                             .then(function (response) {
                                ctrl.found = response;
                            }); 
        };
        ctrl.onRemove = function (itemIndex) {
            console.log(ctrl);
            ctrl.found.splice(itemIndex,1);
        }
    }

    MenuSearchService.$inject = ['$http', 'ApiBasePath']
    function MenuSearchService($http, ApiBasePath) {
        this.getMatchedMenuItems = function (searchTerm) {
            return $http({
                method: "GET",
                url: (ApiBasePath + '/menu_items.json')
            }).then(
                function (response) {
                    let found = [];
                    if (response.data !== undefined && response.data !== null) {
                        let catagories = Object.keys(response.data);
                        catagories.forEach(catagory => {
                            response.data[catagory].menu_items.forEach(item => {
                                if (item.description.indexOf(searchTerm.trim().toLowerCase()) !== -1) {
                                    found.push(item);
                                }
                            });
                        });
                    }
                    return found;
                }
            ).catch(
                function (error) {
                    console.log('Something went wrong!! ', error)
                }
            );
        }
    }
})();