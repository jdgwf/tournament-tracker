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

			$rootScope.currentTournamentsRun = true;

			$rootScope.tmpMatchupSwappingID = "";

			$rootScope.playerList = getPlayersFromLocalStorage();

			$rootScope.tournamentList = getTournamentsFromLocalStorage();

			for( var tC = 0; tC < $rootScope.tournamentList.length; tC++) {
				$rootScope.tournamentList[ tC ].createPlayerObjs( $rootScope.playerList );
			}

			$rootScope.currentTournament = null;

			if( $rootScope.tournamentList[ localStorage["current_tournament_view"] ] ) {
				$rootScope.currentTournament = $rootScope.tournamentList[ localStorage["current_tournament_view"] ];
				$rootScope.currentTournament.calculateResults();
			}

			$scope.editScore = function( playerID, roundNumber ) {

				//~ console.log("editScore(" + playerID + ", " + roundNumber + ")");

				var theMatch = $rootScope.currentTournament.getMatch( roundNumber, playerID );
				//~ console.log( "theMatch", theMatch );

				$rootScope.tmpPlayer1Score = -1;
				$rootScope.tmpPlayer1Score = -1

				$rootScope.tmpPlayer1ExtraPoints = 0;
				$rootScope.tmpPlayer2ExtraPoints = 0;

				$rootScope.tmpPlayer1SteamArmyPoints =  0;
				$rootScope.tmpPlayer1SteamControlPoints = 0;

				$rootScope.tmpPlayer2SteamArmyPoints =  0;
				$rootScope.tmpPlayer2SteamControlPoints =  0;

				$scope.editScorePlayer1 = getPlayerByID( $scope.playerList, theMatch.player1 );
				$scope.editScorePlayer2 = getPlayerByID( $scope.playerList, theMatch.player2 );
				$rootScope.tmpPlayer1Score = $rootScope.currentTournament.getScore( roundNumber, theMatch.player1 );
				$rootScope.tmpPlayer2Score = $rootScope.currentTournament.getScore( roundNumber, theMatch.player2 );

				$rootScope.tmpPlayer1ExtraPoints = $rootScope.currentTournament.getExtraPoints( roundNumber, theMatch.player1 );
				$rootScope.tmpPlayer2ExtraPoints = $rootScope.currentTournament.getExtraPoints( roundNumber, theMatch.player2 );

				$rootScope.tmpPlayer1SteamArmyPoints =  $rootScope.currentTournament.getSteamArmyPoints( roundNumber, theMatch.player1 );
				$rootScope.tmpPlayer1SteamControlPoints =  $rootScope.currentTournament.getSteamControlPoints( roundNumber, theMatch.player1 );

				$rootScope.tmpPlayer2SteamArmyPoints =  $rootScope.currentTournament.getSteamArmyPoints( roundNumber, theMatch.player2 );
				$rootScope.tmpPlayer2SteamControlPoints =  $rootScope.currentTournament.getSteamControlPoints( roundNumber, theMatch.player2 );

				//~ console.log( "$rootScope.currentTournament.getSteamArmyPoints( roundNumber, theMatch.player1 )", $rootScope.currentTournament.getSteamArmyPoints( roundNumber, theMatch.player1 ) );
				//~ console.log( "$rootScope.currentTournament.getSteamArmyPoints( roundNumber, theMatch.player2 )", $rootScope.currentTournament.getSteamArmyPoints( roundNumber, theMatch.player2 ) );

				$scope.editRoundNumber =  roundNumber;
				$scope.editTableNumber =  theMatch.table;


				//~ console.log( "$scope.editScorePlayer1", $scope.editScorePlayer1 );
				//~ console.log( "$scope.editScorePlayer2", $scope.editScorePlayer2 );

				$scope.showEditScoreDialog = true;
			}

			$scope.changePlayerScore = function(  playerID, newScore ) {
				if( playerID == 1 ) {
					$rootScope.tmpPlayer1Score = newScore;

					if( newScore == "win" ) {
						$rootScope.tmpPlayer2Score = "loss"
					} else if (newScore == "draw") {
						$rootScope.tmpPlayer2Score = "draw"
					} else if ( newScore == "loss" ) {
						$rootScope.tmpPlayer2Score = "win";
					} else {
						$rootScope.tmpPlayer2Score = "-1";
					}
				} else {
					$rootScope.tmpPlayer2Score = newScore;
					if( newScore == "win" ) {
						$rootScope.tmpPlayer1Score = "loss"
					} else if (newScore == "draw") {
						$rootScope.tmpPlayer1Score = "draw"
					} else if ( newScore == "loss" ) {
						$rootScope.tmpPlayer1Score = "win";
					} else {
						$rootScope.tmpPlayer1Score = "-1";
					}
				}
			}

			$scope.changePlayerExtraPoints = function(  playerID, newScore ) {
				if( playerID == 1 ) {
					$rootScope.tmpPlayer1ExtraPoints = newScore;

				} else {
					$rootScope.tmpPlayer2ExtraPoints = newScore;
				}
			}

			$scope.changeSteamControlPoints = function(  playerID, newScore ) {
				if( playerID == 1 ) {
					$rootScope.tmpPlayer1SteamControlPoints = newScore;

				} else {
					$rootScope.tmpPlayer2SteamControlPoints = newScore;
				}
			}

			$scope.changeSteamArmyPoints = function(  playerID, newScore ) {
				if( playerID == 1 ) {
					$rootScope.tmpPlayer1SteamArmyPoints = newScore;

				} else {
					$rootScope.tmpPlayer2SteamArmyPoints = newScore;
				}
			}

			$scope.cancelEditScoreDialog = function() {
				$scope.showEditScoreDialog = false;

				$scope.editScorePlayer1 = null;
				$scope.editScorePlayer2 = null;

				$rootScope.tmpPlayer1Score = -1;
				$rootScope.tmpPlayer1Score = -1

				$rootScope.tmpPlayer1ExtraPoints = 0;
				$rootScope.tmpPlayer2ExtraPoints = 0;

				$rootScope.tmpPlayer1SteamArmyPoints =  0;
				$rootScope.tmpPlayer1SteamControlPoints = 0;

				$rootScope.tmpPlayer2SteamArmyPoints =  0;
				$rootScope.tmpPlayer2SteamControlPoints =  0;


				$scope.editRoundNumber =  -1;
				$scope.editTableNumber =  -1;

				$route.reload();
			}

			$scope.saveEditScoreDialog = function() {

				//~ console.log( "saveEditScoreDialog" );
				//~ console.log( "-------------------------------------------------------" );

				//~ console.log( "$rootScope.tmpPlayer1Score", $rootScope.tmpPlayer1Score );
				//~ console.log( "$rootScope.tmpPlayer2Score", $rootScope.tmpPlayer2Score );

				//~ console.log( "$rootScope.tmpPlayer1ExtraPoints", $rootScope.tmpPlayer1ExtraPoints );
				//~ console.log( "$rootScope.tmpPlayer2ExtraPoints", $rootScope.tmpPlayer2ExtraPoints );

				//~ console.log( "$rootScope.tmpPlayer1SteamArmyPoints", $rootScope.tmpPlayer1SteamArmyPoints );
				//~ console.log( "$rootScope.tmpPlayer2SteamArmyPoints", $rootScope.tmpPlayer2SteamArmyPoints );

				//~ console.log( "$rootScope.tmpPlayer1SteamControlPoints", $rootScope.tmpPlayer1SteamControlPoints );
				//~ console.log( "$rootScope.tmpPlayer2SteamControlPoints", $rootScope.tmpPlayer2SteamControlPoints );

				//~ console.log( "-------------------------------------------------------" );

				$rootScope.currentTournament.setScore( $scope.editRoundNumber, $scope.editScorePlayer1.id, $rootScope.tmpPlayer1Score);
				$rootScope.currentTournament.setScore( $scope.editRoundNumber, $scope.editScorePlayer2.id, $rootScope.tmpPlayer2Score);

				$rootScope.currentTournament.setExtraPoints( $scope.editRoundNumber, $scope.editScorePlayer1.id, $rootScope.tmpPlayer1ExtraPoints);
				$rootScope.currentTournament.setExtraPoints( $scope.editRoundNumber, $scope.editScorePlayer2.id, $rootScope.tmpPlayer2ExtraPoints);

				$rootScope.currentTournament.setSteamArmyPoints( $scope.editRoundNumber, $scope.editScorePlayer1.id, $rootScope.tmpPlayer1SteamArmyPoints);
				$rootScope.currentTournament.setSteamArmyPoints( $scope.editRoundNumber, $scope.editScorePlayer2.id, $rootScope.tmpPlayer2SteamArmyPoints);

				$rootScope.currentTournament.setSteamControlPoints( $scope.editRoundNumber, $scope.editScorePlayer1.id, $rootScope.tmpPlayer1SteamControlPoints);
				$rootScope.currentTournament.setSteamControlPoints( $scope.editRoundNumber, $scope.editScorePlayer2.id, $rootScope.tmpPlayer2SteamControlPoints);


				$rootScope.currentTournament.calculateResults();
				saveTournamentsToLocalStorage($rootScope.tournamentList, $rootScope.playerList);

				$scope.showEditScoreDialog = false;

				$scope.editScorePlayer1 = null;
				$scope.editScorePlayer2 = null;

				$rootScope.tmpPlayer1Score = -1;
				$rootScope.tmpPlayer1Score = -1

				$rootScope.tmpPlayer1ExtraPoints = 0;
				$rootScope.tmpPlayer2ExtraPoints = 0;

				$rootScope.tmpPlayer1SteamArmyPoints =  0;
				$rootScope.tmpPlayer1SteamArmyPoints = 0;

				$rootScope.tmpPlayer2SteamArmyPoints =  0;
				$rootScope.tmpPlayer2SteamControlPoints =  0;


				$scope.editRoundNumber =  -1;
				$scope.editTableNumber =  -1;

				//~ console.log( "after close" );
				//~ console.log( "-------------------------------------------------------" );

				//~ console.log( "$rootScope.tmpPlayer1Score", $rootScope.tmpPlayer1Score );
				//~ console.log( "$rootScope.tmpPlayer2Score", $rootScope.tmpPlayer2Score );

				//~ console.log( "$rootScope.tmpPlayer1ExtraPoints", $rootScope.tmpPlayer1ExtraPoints );
				//~ console.log( "$rootScope.tmpPlayer2ExtraPoints", $rootScope.tmpPlayer2ExtraPoints );

				//~ console.log( "$rootScope.tmpPlayer1SteamArmyPoints", $rootScope.tmpPlayer1SteamArmyPoints );
				//~ console.log( "$rootScope.tmpPlayer2SteamArmyPoints", $rootScope.tmpPlayer2SteamArmyPoints );

				//~ console.log( "$rootScope.tmpPlayer1SteamControlPoints", $rootScope.tmpPlayer1SteamControlPoints );
				//~ console.log( "$rootScope.tmpPlayer2SteamControlPoints", $rootScope.tmpPlayer2SteamControlPoints );

				//~ console.log( "-------------------------------------------------------" );

				$rootScope.currentTournament.sortPlayerObjsByScores();

				$route.reload();

			}

			$scope.editPaintingScore = function( playerID ) {
				$rootScope.tmpEditPlayer = Array();
				$rootScope.tmpEditExtraPointValue = 0
				//~ console.log("editPaintingScore(" + playerID + ")");
				$rootScope.tmpEditPlayer = getPlayerByID( $scope.playerList, playerID );
				$rootScope.tmpEditExtraPointValue = $rootScope.currentTournament.getPaintingPoints( playerID );
				if( $rootScope.tmpEditExtraPointValue < 0 )
					$rootScope.tmpEditExtraPointValue = 0;
				$scope.showEditPaintScore = true;
			}

			$scope.editCompositionScore = function( playerID ) {
				$rootScope.tmpEditPlayer = Array();
				$rootScope.tmpEditExtraPointValue = 0
				//~ console.log("editCompositionScore(" + playerID + ")");
				$rootScope.tmpEditPlayer = getPlayerByID( $scope.playerList, playerID );
				$rootScope.tmpEditExtraPointValue = $rootScope.currentTournament.getCompPoints( playerID );
				if( $rootScope.tmpEditExtraPointValue < 0 )
					$rootScope.tmpEditExtraPointValue = 0;
				$scope.showEditCompScore = true;
			}

			$scope.editSportsmanshipScore = function( playerID ) {
				$rootScope.tmpEditPlayer = Array();
				$rootScope.tmpEditExtraPointValue = 0
				//~ console.log("editSportsmanshipScore(" + playerID + ")");
				$rootScope.tmpEditPlayer = getPlayerByID( $scope.playerList, playerID );
				$rootScope.tmpEditExtraPointValue = $rootScope.currentTournament.getSportsPoints( playerID );
				if( $rootScope.tmpEditExtraPointValue < 0 )
					$rootScope.tmpEditExtraPointValue = 0;
				$scope.showEditSportsScore = true;
			}

			$scope.saveSportsScore = function() {
				//~ console.log("saveSportsScore");
				 $rootScope.currentTournament.setSportsPoints( $rootScope.tmpEditPlayer.id, $rootScope.tmpEditExtraPointValue );
				 saveTournamentsToLocalStorage($rootScope.tournamentList, $rootScope.playerList);
				 $rootScope.currentTournament.calculateResults();
				 $scope.cancelEditScore();
			}

			$scope.saveCompScore = function() {
				//~ console.log("saveCompScore");
				 $rootScope.currentTournament.setCompPoints( $rootScope.tmpEditPlayer.id, $rootScope.tmpEditExtraPointValue );
				 saveTournamentsToLocalStorage($rootScope.tournamentList, $rootScope.playerList);
				 $rootScope.currentTournament.calculateResults();
				 $scope.cancelEditScore();
			}

			$scope.savePaintScore = function() {
				//~ console.log("savePaintScore");
				 $rootScope.currentTournament.setPaintingPoints( $rootScope.tmpEditPlayer.id, $rootScope.tmpEditExtraPointValue );
				 saveTournamentsToLocalStorage($rootScope.tournamentList, $rootScope.playerList);
				 $rootScope.currentTournament.calculateResults();
				 $scope.cancelEditScore();
			}

			$scope.changeExtraBitsScore = function( newValue ) {
				$rootScope.tmpEditExtraPointValue = newValue;
			}

			$scope.cancelEditScore = function() {
				$rootScope.tmpEditPlayer = null;
				$rootScope.tmpEditExtraPointValue = null
				$scope.showEditPaintScore = false;
				$scope.showEditCompScore = false;
				$scope.showEditSportsScore = false;
			}

			$scope.closeCurrentTournament = function() {
				$rootScope.currentTournament = null;
				localStorage["current_tournament_view"] = -1;
				$location.path("tournaments-manage"); // path not hash

			}

			$scope.setupNextRound = function() {
				//~ console.log("setupNextRound()");

				$rootScope.currentTournament.createMatchRound( $rootScope.currentTournament.currentRound + 1, $scope.playerList );

				$scope.playerMatchupDialog = true;
			}

			$scope.closePlayerMatchupDialog = function() {
				//~ console.log("closePlayerMatchupDialog()");

				$scope.playerMatchupDialog = false;
			}

			$scope.resetMatchups = function() {
				$rootScope.currentTournament.createMatchRound( $rootScope.currentTournament.currentRound + 1, $scope.playerList );
			}

			$scope.swapPlayerButton = function( playerID ) {
				if( $rootScope.tmpMatchupSwappingID ) {
					// perform swap
					$rootScope.currentTournament.swapPlayers( $rootScope.tmpMatchupSwappingID, playerID, $rootScope.currentTournament.currentRound + 1, $scope.playerList);
					$rootScope.tmpMatchupSwappingID = "";
				} else {
					// activate swap
					$rootScope.tmpMatchupSwappingID = playerID;
				}

			}

			$scope.cancelSwap = function() {
				$rootScope.tmpMatchupSwappingID = "";
			}

			$scope.completeTournament = function() {
				//~ console.log("completeTournament() called");

				$rootScope.currentTournament.completed = true;
				saveTournamentsToLocalStorage($rootScope.tournamentList, $rootScope.playerList);
			}

			$scope.startNextRound = function() {
				$rootScope.currentTournament.currentRound++;
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
