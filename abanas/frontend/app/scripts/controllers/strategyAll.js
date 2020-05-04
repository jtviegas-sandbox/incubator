'use strict';


angular.module('abanas').controller(
	'strategyAllCtrl', function ($scope, strategies, $alert) {
    	console.log($scope);
    	$scope.strategies = strategies.getAll();

        var deleteAlert = $alert({
            title: 'Success!',
            content: 'The strategy was deleted successfully.',
            type: 'success',
            container: '#alertContainer',
            show: false
        });

        var findIndex = function(id){
            for(var i=0; i < $scope.strategies.length; i++){
                var o = $scope.strategies[i];
                if( o._id == id )
                    return i;
            }
            return -1;
        };

        $scope.remove = function(id){
            strategies.remove(id);
            $scope.strategies.splice(findIndex(id), 1);
            deleteAlert.show();

        };
    }
);
