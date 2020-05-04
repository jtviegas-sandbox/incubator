'use strict';

/**
 * @ngdoc function
 * @name fassApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the fassApp
 */
angular.module('abanas').controller(
	'strategyCtrl', 
	function ($scope, $routeParams, strategies, $timeout) {

		var id = $routeParams.id;
		$scope.strategy = strategies.find(id);
		$scope.$on('saved', 
			function(){
				$timeout(
					function(){
						strategies.persist($scope.strategy);
					}	
				, 0);	
			}
		);
  	}
);
