'use strict';

angular.module('abanas').controller(
	'strategyAddCtrl', function ($scope, strategies, strategyTypes, $alert) {
		console.log($scope);
    	$scope.strategyTypes = strategyTypes.get();
    	$scope.strategy = strategies.create();
        
        var alerts = {
            success: $alert({
                title: 'Success!',
                content: 'The strategy was created successfully.',
                type: 'success',
                container: '#alertContainer',
                show: false
            }),
            error: $alert({
                title: 'Error!',
                content: 'There are some validation errors.',
                type: 'danger',
                container: '#alertContainer',
                show: false
            })
        };

    	$scope.submit = function(){
            $scope.formErrors = false;
            if(!$scope.strategyAdd.$valid){
                $scope.formErrors = true;
                return alerts.error.show();
            }
    		strategies.persist($scope.strategy);
			$scope.strategy = strategies.create();
            alerts.error.hide();
			alerts.success.show();
    	}
    	$scope.tooltipStartDate = {
				title: '...strategy will be active on the date asap'
			};


        /*$scope.$watch('mydateOfBirth', function (newValue) {
            $scope.workerDetail.dateOfBirth = $filter('date')(newValue, 'yyyy/MM/dd'); 
        });

        $scope.$watch('workerDetail.dateOfBirth', function (newValue) {
            $scope.mydateOfBirth = $filter('date')(newValue, 'yyyy/MM/dd'); 
        });*/
  	}
);
