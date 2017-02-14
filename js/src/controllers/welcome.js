var welcomeArray =
	[
		'$rootScope',
		'$translate',
		'$scope',
		function ($rootScope, $translate, $scope) {
			$translate(['APP_TITLE', 'INDEX_WELCOME']).then(function (translation) {
				$rootScope.title_tag = translation.INDEX_WELCOME + " | " + translation.APP_TITLE;
				$rootScope.subtitle_tag = "&raquo; " + translation.INDEX_WELCOME;
			});

			$scope.currentWelcomePage = true;

			$rootScope.playerList = getPlayersFromLocalStorage();


			$rootScope.tournamentList = getTournamentsFromLocalStorage();
			for( var tC = 0; tC < $rootScope.tournamentList.length; tC++) {
				$rootScope.tournamentList[ tC ].createPlayerObjs( $rootScope.playerList );
			}

			$scope.currentTournament = null;
			if( $rootScope.tournamentList[ localStorage["current_tournament_view"] ] ) {
				$scope.currentTournament = $rootScope.tournamentList[ localStorage["current_tournament_view"] ]
			}
		}
	]
;


angular.module("webApp").controller(
	"welcomeController",
	welcomeArray
);

angular.module("cordovaApp").controller(
	"welcomeController",
	welcomeArray
);
