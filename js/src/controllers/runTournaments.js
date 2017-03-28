var tournamentsRunArray =
	[
		'$rootScope',
		'$translate',
		'$location',
		'$scope',
		'$route',
		function ($rootScope, $translate, $location, $scope, $route) {
			$translate(['APP_TITLE', 'WELCOME_BUTTON_MANAGE_TOURNAMENTS']).then(function (translation) {
				$rootScope.title_tag = translation.WELCOME_BUTTON_MANAGE_TOURNAMENTS + " | " + translation.APP_TITLE;
				$rootScope.subtitle_tag = "&raquo; " + translation.WELCOME_BUTTON_MANAGE_TOURNAMENTS;
			});

			// saveTournamentsToLocalStorage($rootScope.tournamentList, $rootScope.playerList);

			$scope.currentTournamentsRun = true;

			$rootScope.playerList = getPlayersFromLocalStorage();

			$rootScope.tournamentList = getTournamentsFromLocalStorage();

			for( var tC = 0; tC < $rootScope.tournamentList.length; tC++) {
				$rootScope.tournamentList[ tC ].createPlayerObjs( $rootScope.playerList );
			}

			$scope.currentTournament = null;

			if( $rootScope.tournamentList[ localStorage["current_tournament_view"] ] ) {
				$scope.currentTournament = $rootScope.tournamentList[ localStorage["current_tournament_view"] ];
				$scope.currentTournament.calculateResults();
			}

			$scope.editScore = function( playerID, roundNumber ) {

				//~ console.log("editScore(" + playerID + ", " + roundNumber + ")");

				var theMatch = $scope.currentTournament.getMatch( roundNumber, playerID );
				//~ console.log( "theMatch", theMatch );

				$scope.tmpPlayer1Score = -1;
				$scope.tmpPlayer1Score = -1

				$scope.tmpPlayer1ExtraPoints = 0;
				$scope.tmpPlayer2ExtraPoints = 0;

				$scope.tmpPlayer1SteamArmyPoints =  0;
				$scope.tmpPlayer1SteamControlPoints = 0;

				$scope.tmpPlayer2SteamArmyPoints =  0;
				$scope.tmpPlayer2SteamControlPoints =  0;

				$scope.editScorePlayer1 = getPlayerByID( $scope.playerList, theMatch.player1 );
				$scope.editScorePlayer2 = getPlayerByID( $scope.playerList, theMatch.player2 );
				$scope.tmpPlayer1Score = $scope.currentTournament.getScore( roundNumber, theMatch.player1 );
				$scope.tmpPlayer2Score = $scope.currentTournament.getScore( roundNumber, theMatch.player2 );

				$scope.tmpPlayer1ExtraPoints = $scope.currentTournament.getExtraPoints( roundNumber, theMatch.player1 );
				$scope.tmpPlayer2ExtraPoints = $scope.currentTournament.getExtraPoints( roundNumber, theMatch.player2 );

				$scope.tmpPlayer1SteamArmyPoints =  $scope.currentTournament.getSteamArmyPoints( roundNumber, theMatch.player1 );
				$scope.tmpPlayer1SteamControlPoints =  $scope.currentTournament.getSteamControlPoints( roundNumber, theMatch.player1 );

				$scope.tmpPlayer2SteamArmyPoints =  $scope.currentTournament.getSteamArmyPoints( roundNumber, theMatch.player2 );
				$scope.tmpPlayer2SteamControlPoints =  $scope.currentTournament.getSteamControlPoints( roundNumber, theMatch.player2 );

				console.log( "$scope.currentTournament.getSteamArmyPoints( roundNumber, theMatch.player1 )", $scope.currentTournament.getSteamArmyPoints( roundNumber, theMatch.player1 ) );
				console.log( "$scope.currentTournament.getSteamArmyPoints( roundNumber, theMatch.player2 )", $scope.currentTournament.getSteamArmyPoints( roundNumber, theMatch.player2 ) );

				$scope.editRoundNumber =  roundNumber;
				$scope.editTableNumber =  theMatch.table;


				//~ console.log( "$scope.editScorePlayer1", $scope.editScorePlayer1 );
				//~ console.log( "$scope.editScorePlayer2", $scope.editScorePlayer2 );

				$scope.showEditScoreDialog = true;
			}

			$scope.changePlayerScore = function(  playerID, newScore ) {
				if( playerID == 1 ) {
					$scope.tmpPlayer1Score = newScore;

					if( newScore == "win" ) {
						$scope.tmpPlayer2Score = "loss"
					} else if (newScore == "draw") {
						$scope.tmpPlayer2Score = "draw"
					} else if ( newScore == "loss" ) {
						$scope.tmpPlayer2Score = "win";
					} else {
						$scope.tmpPlayer2Score = "-1";
					}
				} else {
					$scope.tmpPlayer2Score = newScore;
					if( newScore == "win" ) {
						$scope.tmpPlayer1Score = "loss"
					} else if (newScore == "draw") {
						$scope.tmpPlayer1Score = "draw"
					} else if ( newScore == "loss" ) {
						$scope.tmpPlayer1Score = "win";
					} else {
						$scope.tmpPlayer1Score = "-1";
					}
				}
			}

			$scope.changePlayerExtraPoints = function(  playerID, newScore ) {
				if( playerID == 1 ) {
					$scope.tmpPlayer1ExtraPoints = newScore;

				} else {
					$scope.tmpPlayer2ExtraPoints = newScore;
				}
			}

			$scope.changeSteamControlPoints = function(  playerID, newScore ) {
				if( playerID == 1 ) {
					$scope.tmpPlayer1SteamControlPoints = newScore;

				} else {
					$scope.tmpPlayer2SteamControlPoints = newScore;
				}
			}

			$scope.changeSteamArmyPoints = function(  playerID, newScore ) {
				if( playerID == 1 ) {
					$scope.tmpPlayer1SteamArmyPoints = newScore;

				} else {
					$scope.tmpPlayer2SteamArmyPoints = newScore;
				}
			}

			$scope.cancelEditScoreDialog = function() {
				$scope.showEditScoreDialog = false;

				$scope.editScorePlayer1 = null;
				$scope.editScorePlayer2 = null;

				$scope.tmpPlayer1Score = -1;
				$scope.tmpPlayer1Score = -1

				$scope.tmpPlayer1ExtraPoints = 0;
				$scope.tmpPlayer2ExtraPoints = 0;

				$scope.tmpPlayer1SteamArmyPoints =  0;
				$scope.tmpPlayer1SteamControlPoints = 0;

				$scope.tmpPlayer2SteamArmyPoints =  0;
				$scope.tmpPlayer2SteamControlPoints =  0;


				$scope.editRoundNumber =  -1;
				$scope.editTableNumber =  -1;

				$route.reload();
			}

			$scope.saveEditScoreDialog = function() {

				console.log( "saveEditScoreDialog" );
				console.log( "-------------------------------------------------------" );

				console.log( "$scope.tmpPlayer1Score", $scope.tmpPlayer1Score );
				console.log( "$scope.tmpPlayer2Score", $scope.tmpPlayer2Score );

				console.log( "$scope.tmpPlayer1ExtraPoints", $scope.tmpPlayer1ExtraPoints );
				console.log( "$scope.tmpPlayer2ExtraPoints", $scope.tmpPlayer2ExtraPoints );

				console.log( "$scope.tmpPlayer1SteamArmyPoints", $scope.tmpPlayer1SteamArmyPoints );
				console.log( "$scope.tmpPlayer2SteamArmyPoints", $scope.tmpPlayer2SteamArmyPoints );

				console.log( "$scope.tmpPlayer1SteamControlPoints", $scope.tmpPlayer1SteamControlPoints );
				console.log( "$scope.tmpPlayer2SteamControlPoints", $scope.tmpPlayer2SteamControlPoints );

				console.log( "-------------------------------------------------------" );

				$scope.currentTournament.setScore( $scope.editRoundNumber, $scope.editScorePlayer1.id, $scope.tmpPlayer1Score);
				$scope.currentTournament.setScore( $scope.editRoundNumber, $scope.editScorePlayer2.id, $scope.tmpPlayer2Score);

				$scope.currentTournament.setExtraPoints( $scope.editRoundNumber, $scope.editScorePlayer1.id, $scope.tmpPlayer1ExtraPoints);
				$scope.currentTournament.setExtraPoints( $scope.editRoundNumber, $scope.editScorePlayer2.id, $scope.tmpPlayer2ExtraPoints);

				$scope.currentTournament.setSteamArmyPoints( $scope.editRoundNumber, $scope.editScorePlayer1.id, $scope.tmpPlayer1SteamArmyPoints);
				$scope.currentTournament.setSteamArmyPoints( $scope.editRoundNumber, $scope.editScorePlayer2.id, $scope.tmpPlayer2SteamArmyPoints);

				$scope.currentTournament.setSteamControlPoints( $scope.editRoundNumber, $scope.editScorePlayer1.id, $scope.tmpPlayer1SteamControlPoints);
				$scope.currentTournament.setSteamControlPoints( $scope.editRoundNumber, $scope.editScorePlayer2.id, $scope.tmpPlayer2SteamControlPoints);


				$scope.currentTournament.calculateResults();
				saveTournamentsToLocalStorage($rootScope.tournamentList, $rootScope.playerList);

				$scope.showEditScoreDialog = false;

				$scope.editScorePlayer1 = null;
				$scope.editScorePlayer2 = null;

				$scope.tmpPlayer1Score = -1;
				$scope.tmpPlayer1Score = -1

				$scope.tmpPlayer1ExtraPoints = 0;
				$scope.tmpPlayer2ExtraPoints = 0;

				$scope.tmpPlayer1SteamArmyPoints =  0;
				$scope.tmpPlayer1SteamArmyPoints = 0;

				$scope.tmpPlayer2SteamArmyPoints =  0;
				$scope.tmpPlayer2SteamControlPoints =  0;


				$scope.editRoundNumber =  -1;
				$scope.editTableNumber =  -1;

				console.log( "after close" );
				console.log( "-------------------------------------------------------" );

				console.log( "$scope.tmpPlayer1Score", $scope.tmpPlayer1Score );
				console.log( "$scope.tmpPlayer2Score", $scope.tmpPlayer2Score );

				console.log( "$scope.tmpPlayer1ExtraPoints", $scope.tmpPlayer1ExtraPoints );
				console.log( "$scope.tmpPlayer2ExtraPoints", $scope.tmpPlayer2ExtraPoints );

				console.log( "$scope.tmpPlayer1SteamArmyPoints", $scope.tmpPlayer1SteamArmyPoints );
				console.log( "$scope.tmpPlayer2SteamArmyPoints", $scope.tmpPlayer2SteamArmyPoints );

				console.log( "$scope.tmpPlayer1SteamControlPoints", $scope.tmpPlayer1SteamControlPoints );
				console.log( "$scope.tmpPlayer2SteamControlPoints", $scope.tmpPlayer2SteamControlPoints );

				console.log( "-------------------------------------------------------" );

				$route.reload();

			}

			$scope.editPaintingScore = function( playerID ) {
				$scope.tmpEditPlayer = Array();
				$scope.tmpEditExtraPointValue = 0
				console.log("editPaintingScore(" + playerID + ")");
				$scope.tmpEditPlayer = getPlayerByID( $scope.playerList, playerID );
				$scope.tmpEditExtraPointValue = $scope.currentTournament.getPaintingPoints( playerID );
				if( $scope.tmpEditExtraPointValue < 0 )
					$scope.tmpEditExtraPointValue = 0;
				$scope.showEditPaintScore = true;
			}

			$scope.editCompositionScore = function( playerID ) {
				$scope.tmpEditPlayer = Array();
				$scope.tmpEditExtraPointValue = 0
				console.log("editCompositionScore(" + playerID + ")");
				$scope.tmpEditPlayer = getPlayerByID( $scope.playerList, playerID );
				$scope.tmpEditExtraPointValue = $scope.currentTournament.getCompPoints( playerID );
				if( $scope.tmpEditExtraPointValue < 0 )
					$scope.tmpEditExtraPointValue = 0;
				$scope.showEditCompScore = true;
			}

			$scope.editSportsmanshipScore = function( playerID ) {
				$scope.tmpEditPlayer = Array();
				$scope.tmpEditExtraPointValue = 0
				console.log("editSportsmanshipScore(" + playerID + ")");
				$scope.tmpEditPlayer = getPlayerByID( $scope.playerList, playerID );
				$scope.tmpEditExtraPointValue = $scope.currentTournament.getSportsPoints( playerID );
				if( $scope.tmpEditExtraPointValue < 0 )
					$scope.tmpEditExtraPointValue = 0;
				$scope.showEditSportsScore = true;
			}

			$scope.saveSportsScore = function() {
				console.log("saveSportsScore");
				 $scope.currentTournament.setSportsPoints( $scope.tmpEditPlayer.id, $scope.tmpEditExtraPointValue );
				 saveTournamentsToLocalStorage($rootScope.tournamentList, $rootScope.playerList);
				 $scope.currentTournament.calculateResults();
				 $scope.cancelEditScore();
			}

			$scope.saveCompScore = function() {
				console.log("saveCompScore");
				 $scope.currentTournament.setCompPoints( $scope.tmpEditPlayer.id, $scope.tmpEditExtraPointValue );
				 saveTournamentsToLocalStorage($rootScope.tournamentList, $rootScope.playerList);
				 $scope.currentTournament.calculateResults();
				 $scope.cancelEditScore();
			}

			$scope.savePaintScore = function() {
				console.log("savePaintScore");
				 $scope.currentTournament.setPaintingPoints( $scope.tmpEditPlayer.id, $scope.tmpEditExtraPointValue );
				 saveTournamentsToLocalStorage($rootScope.tournamentList, $rootScope.playerList);
				 $scope.currentTournament.calculateResults();
				 $scope.cancelEditScore();
			}

			$scope.changeExtraBitsScore = function( newValue ) {
				$scope.tmpEditExtraPointValue = newValue;
			}

			$scope.cancelEditScore = function() {
				$scope.tmpEditPlayer = null;
				$scope.tmpEditExtraPointValue = null
				$scope.showEditPaintScore = false;
				$scope.showEditCompScore = false;
				$scope.showEditSportsScore = false;
			}

			$scope.closeCurrentTournament = function() {
				$scope.currentTournament = null;
				localStorage["current_tournament_view"] = -1;
				$location.path("tournaments-manage"); // path not hash

			}

			$scope.setupNextRound = function() {
				console.log("setupNextRound()");

				$scope.currentTournament.createMatchRound( $scope.currentTournament.currentRound + 1, $scope.playerList );

				$scope.playerMatchupDialog = true;
			}

			$scope.closePlayerMatchupDialog = function() {
				console.log("closePlayerMatchupDialog()");

				$scope.playerMatchupDialog = false;
			}

			$scope.resetMatchups = function() {
				$scope.currentTournament.createMatchRound( $scope.currentTournament.currentRound + 1, $scope.playerList );
			}

			$scope.swapPlayerButton = function( playerID ) {
				if( $scope.tmpMatchupSwappingID > 0 ) {
					// perform swap
					$scope.currentTournament.swapPlayers( $scope.tmpMatchupSwappingID, playerID, $scope.currentTournament.currentRound + 1, $scope.playerList);
					$scope.tmpMatchupSwappingID = 0;
				} else {
					// activate swap
					$scope.tmpMatchupSwappingID = playerID;
				}

			}

			$scope.cancelSwap = function() {
				$scope.tmpMatchupSwappingID = 0;
			}

			$scope.completeTournament = function() {
				console.log("completeTournament() called");

				$scope.currentTournament.completed = true;
				saveTournamentsToLocalStorage($rootScope.tournamentList, $rootScope.playerList);
			}

			$scope.startNextRound = function() {
				$scope.currentTournament.currentRound++;
				saveTournamentsToLocalStorage($rootScope.tournamentList, $rootScope.playerList);
				$scope.playerMatchupDialog = false;
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
