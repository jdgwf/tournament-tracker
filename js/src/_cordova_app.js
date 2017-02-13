var available_languages = [];

var appVersion = "0.01Alpha";

webApp = angular.module(
	'cordovaApp',
	['ngRoute', 'ngResource', 'ngSanitize','pascalprecht.translate', 'as.sortable', 'mm.foundation'],
	globalRoutes
);


angular.module('cordovaApp').controller(
	'select_language',
	[
		'$translate',
		'$scope',
		'$route',
		function ($translate, $scope, $route) {

			$scope.change_language = function (key) {
				$translate.use(key);
				localStorage["tmp.preferred_language"] = key;
				$route.reload();
			};

		}
	]
);
