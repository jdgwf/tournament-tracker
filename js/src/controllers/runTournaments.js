var tournamentsRunArray =
	[
		'$rootScope',
		'$translate',
		'$location',
		'$scope',
		function ($rootScope, $translate, $location, $scope) {
			$translate(['APP_TITLE', 'WELCOME_BUTTON_MANAGE_TOURNAMENTS']).then(function (translation) {
				$rootScope.title_tag = translation.WELCOME_BUTTON_MANAGE_TOURNAMENTS + " | " + translation.APP_TITLE;
				$rootScope.subtitle_tag = "&raquo; " + translation.WELCOME_BUTTON_MANAGE_TOURNAMENTS;
			});

			$scope.currentTournamentPage = true;

			$rootScope.playerList = getPlayersFromLocalStorage();

			$rootScope.tournamentList = getTournamentsFromLocalStorage();
			for( var tC = 0; tC < $rootScope.tournamentList.length; tC++) {
				$rootScope.tournamentList[ tC ].createPlayerObjs( $rootScope.playerList );
			}

			$scope.currentTournament = null;

			if( $rootScope.tournamentList[ localStorage["current_tournament_view"] ] ) {
				$scope.currentTournament = $rootScope.tournamentList[ localStorage["current_tournament_view"] ]
			}


			$scope.currentTournament.calculateResults();


			$scope.editScore = function( playerID, roundIndex ) {
				console.log("editScore(" + playerID + ", " + roundIndex + ")");
			}

		}
	]
;


angular.module("webApp").controller(
	"controllerTourmamentsRun",
	tournamentsRunArray
);

angular.module("cordovaApp").controller(
	"controllerTourmamentsRun",
	tournamentsRunArray
);
