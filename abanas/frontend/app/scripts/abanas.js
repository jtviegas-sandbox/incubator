angular.module('abanas', [
	'ngRoute', 'ngSanitize', 'mgcrea.ngStrap', 
	'ngAnimate', 'ngResource'])
	.controller(
		'AppController', 
		function($scope, $location){

			$scope.pageClass = function(path){
				return (path == $location.path()) ? 'active' : '';
			};


		}
	)
	.filter('truncate', 
		function(){
			return function(input, limit){
				return (input.length > limit) ? input.substr(0, limit) + '...' : input; 
			}
		}
	)
	.config( 
		function($routeProvider, $locationProvider){

			$routeProvider.when('/', {
				controller: 'indexCtrl',
				templateUrl: 'views/index.html'
			})
			.when('/strategy/add', {
				controller: 'strategyAddCtrl',
				templateUrl: 'views/strategyAdd.html'
			})
			.when('/strategy/all', {
				controller: 'strategyAllCtrl',
				templateUrl: 'views/strategyAll.html'
			})
			.when('/strategy/:id', {
				controller: 'strategyCtrl',
				templateUrl: 'views/strategy.html'
			})
			.otherwise({
				redirecTo:'/'
			});

			$locationProvider.html5Mode({
			  enabled: true
			});
			
			
		}
	)
	.filter('paragraph', 
		function(){
			return function(input){
						return ("string" == (typeof input)) ? input.replace(/\n/g, '<br />') : input;
					};
		}
	)
	.factory( 'strategyTypes', 
		function(){
    		var o = [ 'default', 'alternate'];

    		var get = function(){
    			return o;
    		};

    		return { get: get };

		}	
	)
	.factory( 'strategies', 
		function strategiesFactory($resource){

			var endpoint = window.location.origin + '/api/collections/strategy';

			var o = [];

			var Resource = $resource(endpoint + '/:id', 
				{id: '@id'}, 
				{ 
					update: {method: 'POST'} 
				}
			);

			var getAll = function(){
    			return Resource.query();
    		};

    		var create = function(){
    			return new Resource();
    		}

    		var find = function(id){
    			return Resource.get({id: id});
    		};

    		var persist = function(obj){
    			if(obj._id)
    				Resource.update(obj);
    			else
    				Resource.save(obj);
    		};

    		var remove = function(id){
    			Resource.delete({id: id});
    		};

    		return {
    			getAll: getAll
    			, create: create
    			, find: find
    			, persist: persist
    			, remove: remove
    			
    		};

		}	
	)
	.directive('gravatar', 
		function(){
			return {
				restrict: 'AE',
				template: '<img src="{{img}}" class="{{class}}">',
				replace: true,
				//runs AFTER the page has compiled
				link: function(scope, elem, attrs){
						var md5=function(s){ return "";};
						var size = (attrs.size) ? attrs.size : 64;
						scope.img = 'http://gravatar.com/avatar/'+md5(attrs.email)+'?s='+size;
						scope.class = attrs.class;
				}
			}
		}
	)
	.directive('editable', 
		function(){
			return {
				restrict: 'AE',
				templateUrl: 'views/partials/editable.html',
				scope: {
					value: '=editable'
					, field: '@fieldType'
					, ngPattern: '@ngPattern'
					, ngMin: '@ngMin'
					, ngMax: '@ngMax'
					, ngMinlength: '@ngMinlength'
					, ngMaxlength: '@ngMaxlength'
					, isRequired: '@isRequired'
				},

				//runs before the page has finished compiling
				controller:function($scope, strategies, strategyTypes){

					$scope.toggleEditor = function(){
						$scope.editor.showing = !$scope.editor.showing;
					};

					$scope.editor = {
						showing: false,
						value: $scope.value,
						strategyTypes: strategyTypes.get(),
					};

					$scope.field = ($scope.field) ? $scope.field : 'text';

					$scope.save = function(){
						$scope.value = $scope.editor.value;
						$scope.$emit('saved');
						$scope.toggleEditor();
					};

				}
			};
		}
	)
	
;
