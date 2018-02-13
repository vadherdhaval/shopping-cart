
angular.module('mobile', ['ui.router','infinite-scroll'])
.factory('mobiles',['$http',function($http){
	return {
      list: function(callback){
        $http.get('data.json').success(callback);
      },
      cartItems: [],
    };
}])
.config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){

	$stateProvider
		.state('list', {
			url: '/list',
			templateUrl: './mobile-list.html',
			controller: 'mobileList'
		})
		.state('cart',{
			url: '/cart',
			templateUrl: './cart.html',
			controller: 'cart'
		});
	$urlRouterProvider.otherwise('/list')

}])

.controller('mobileList',['$scope','$http','mobiles','$filter',function($scope,$http,mobiles,$filter){
	$scope.selection = ['apple', 'mi'];
 	mobiles.list(function(mobiles){
 		$scope.mobilesList = mobiles;
 	});

 	$scope.items = [
	    {name:'samsung'}, 
	    {name:'apple'}, 
	    {name:'mi'}
	];
	$scope.filterItems = {
		'samsung': true,
		'apple': true,
		'mi': true
	};
	$scope.propertyName = 'price';
	$scope.reverse = false;
	$scope.firstLoadItem = 0;

	$scope.selectionFilter = function (mobilesList) {
		return $scope.filterItems[mobilesList.brand]
	};

	$scope.increaseLimit = function () {
        $scope.firstLoadItem += 5;
    }

	$scope.sortBy = function(propertyName){
		$scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
		$scope.propertyName = propertyName
	}
	$scope.getRatings = function(rating) {
    	return new Array(rating);   
	}

	$scope.addToCart = function(mobile){
		mobiles.cartItems.push(mobile);
	}
}])
.controller('cart',['$scope','mobiles',function($scope,mobiles){
	$scope.cartItems = mobiles.cartItems;
	$scope.removeFromCart = function(index){
	    $scope.cartItems.splice(index, 1);
	}
	$scope.sumPrice = function() {
	    var total = 0;
	    angular.forEach($scope.cartItems,function(value,index){
	    	total += parseFloat(value.price);
	    }); 
	    return total.toFixed(2);
	};
}])
.directive('myHeader',function(){
	var controller = ['$scope','mobiles',function($scope,mobiles){
		$scope.cartItem = mobiles.cartItems;
	}];
	return {
        restrict: 'EA', //Default in 1.3+
        scope: {
            datasource: '=',
			add: '&',
		},
		controller: controller,
		templateUrl: './header.html'
	};
})
