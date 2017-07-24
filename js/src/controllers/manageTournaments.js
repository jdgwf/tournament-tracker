var tournamentsManageArray =
	[
		'$rootScope',
		'$translate',
		'$location',
		'$scope',
		function ($rootScope, $translate, $location, $scope) {


			$translate(['APP_TITLE', 'WELCOME_BUTTON_MANAGE_TOURNAMENTS', 'TOURNAMENTS_MATCHUP_HIGHEST_RANKING', 'TOURNAMENTS_MATCHUP_RANDOM', 'GENERAL_FILTER_SEARCH_PLAYERS']).then(function (translation) {
				$rootScope.title_tag = translation.WELCOME_BUTTON_MANAGE_TOURNAMENTS + " | " + translation.APP_TITLE;
				$rootScope.subtitle_tag = "&raquo; " + translation.WELCOME_BUTTON_MANAGE_TOURNAMENTS;
				$rootScope.filterSearchPlayersPlaceholder = translation.GENERAL_FILTER_SEARCH_PLAYERS;

				$scope.tournamentMatchupOptions = Array();

				$scope.filterSearchTerm = "";

				$scope.tournamentMatchupOptions.push(
					{
							id: "highest-ranking",
							label: translation.TOURNAMENTS_MATCHUP_HIGHEST_RANKING
					}
				);

				$scope.tournamentMatchupOptions.push(
					{
							id: "random",
							label: translation.TOURNAMENTS_MATCHUP_RANDOM
					}
				);
				$scope.tmpMatchupSelection = $scope.tournamentMatchupOptions[0];

			});

			$scope.currentTournamentsPage = true;

			$scope.refreshTournamentData = function() {
				$rootScope.playerList = getPlayersFromLocalStorage();

				$rootScope.tournamentList = getTournamentsFromLocalStorage();
				for( var tC = 0; tC < $rootScope.tournamentList.length; tC++) {
					$rootScope.tournamentList[ tC ].createPlayerObjs( $rootScope.playerList );
				}
			}
			$scope.refreshTournamentData();

			$rootScope.currentTournament = null;
			if( $rootScope.tournamentList[ localStorage["current_tournament_view"] ] ) {
				$rootScope.currentTournament = $rootScope.tournamentList[ localStorage["current_tournament_view"] ]
				if( $rootScope.currentTournament.playerObjs.length == 0 || $rootScope.currentTournament.completed )
					$rootScope.currentTournament = null;
			}

			/* *********************************************************
			 * Confirmation Dialog
			 * ******************************************************* */

			$scope.confirmDialogQuestion = "";
			$scope.showImportExportTournamentDialog = false;

			$scope.confirmDialog = function( confirmationMessage, onYes ) {
				$scope.confirmDialogQuestion = confirmationMessage;
				$scope.showConfirmDialog = true;
				$scope.confirmDialogYes = onYes;
			}

			$scope.closeConfirmDialog = function( ) {
				$scope.showConfirmDialog = false;
				// reset confirm to nothing...
				$scope.confirmDialogYes = function() {
					$scope.showConfirmDialog = false;
				}
			}

			//~ console.log("$rootScope.tournamentList", $rootScope.tournamentList);
			/* *********************************************************
			 * Tournament New/Delete/Edit Functions
			 * ******************************************************* */

			$scope.updateTournamentName = function( newValue ) {
				$rootScope.tmpTournament.name = newValue;
			}

			$scope.updateTournamentRounds = function( newValue ) {
				$rootScope.tmpTournament.numberOfRounds = newValue;
			}

			$scope.updateTournamentPointsForWin = function( newValue ) {
				$rootScope.tmpTournament.pointsForWin = newValue;
			}

			$scope.updateTournamentPointsForDraw = function( newValue ) {
				$rootScope.tmpTournament.pointsForDraw = newValue;
			}

			$scope.updateTournamentPointsForLoss = function( newValue ) {
				$rootScope.tmpTournament.pointsForLoss = newValue;
			}

			$scope.updateByeIsAverage = function( newValue ) {
				$rootScope.tmpTournament.byeIsAverage = newValue;
			}

			$scope.updateTournamentPointsForBye = function( newValue ) {
				$rootScope.tmpTournament.pointsForBye = newValue;
			}

			$scope.updateTournamentScoringPaint = function( newValue ) {
				$rootScope.tmpTournament.scoringPaint = newValue;
			}

			$scope.updateTournamentScoringComp = function( newValue ) {
				$rootScope.tmpTournament.scoringComp = newValue;
			}

			$scope.updateTournamentScoringSportsmanship = function( newValue ) {
				$rootScope.tmpTournament.scoringSportsmanship = newValue;
			}

			$scope.updateTournamentTrackPerGameSportsmanship = function( newValue ) {
				$rootScope.tmpTournament.trackPerGameSportsmanship = newValue;
			}


			$scope.updateTournamentWarnSportsmanship = function( newValue ) {
				$rootScope.tmpTournament.warnSportsmanship = newValue;
			}

			$scope.newTournamentDialog = function() {
				//~ console.log("newTournamentDialog() called");


				$scope.clearTempTournamentData();

				$scope.getMatchupSelection( $rootScope.tmpTournament.matchupType );

				$scope.showEditTournamentDialog = true;
			}

			$scope.updateTmpMatchupSelection = function( newValue ) {
				$scope.tmpMatchupSelection = newValue;
			}

			$scope.updateNoDuplicateMatchups = function( newValue ) {
				$rootScope.tmpTournament.noDuplicateMatchups = newValue;
			}



			$scope.deleteTournamentDialog = function(indexNumber) {
				$translate([
					'TOURNAMENTS_DELETE_CONFIRMATION'
				]).then(
					function (translation) {
						$scope.confirmDialog(
							translation.TOURNAMENTS_DELETE_CONFIRMATION,
							function() {
								$scope.showConfirmDialog = false;
								$rootScope.tournamentList.splice( indexNumber, 1 );
								saveTournamentsToLocalStorage($rootScope.tournamentList, $rootScope.playerList);
							}
						);
					}
				);
			}




			$scope.editTournamentDialog = function(indexNumber) {
				//~ console.log("editTournamentDialog() called");

				if( $rootScope.tournamentList[ indexNumber] ) {
					$rootScope.tmpTournament = angular.copy( $rootScope.tournamentList[ indexNumber ] );

					$scope.getMatchupSelection( $rootScope.tmpTournament.matchupType );

					$rootScope.tmpTournamentIndex  = indexNumber;
					$scope.showEditTournamentDialog = true;
				}
			}

			$scope.clearTempTournamentData = function() {
				//~ console.log("clearTempTournamentData() called");

				$rootScope.tmpTournament = new Tournament();
				$scope.getMatchupSelection( $rootScope.tmpTournament.matchupType );

				$rootScope.tmpTournamentIndex = -1;

			}

			$scope.getMatchupSelection = function( matchupID ) {
				$scope.tmpMatchupSelection = $scope.tournamentMatchupOptions[0];
				for( var lCounter = 0; lCounter < $scope.tournamentMatchupOptions.length; lCounter++ ) {
					if( $scope.tournamentMatchupOptions[ lCounter ].id == matchupID )
						$scope.tmpMatchupSelection = $scope.tournamentMatchupOptions[ lCounter ];
				}
			}


			$scope.saveEditTournamentDialog = function() {

				//~ console.log("saveEditTournamentDialog() called");
				$scope.showEditTournamentDialog = false;

				$rootScope.tmpTournament.matchupType = $scope.tmpMatchupSelection.id;


				if( $rootScope.tmpTournamentIndex > -1 ) {
					// Save to Index...

					$rootScope.tmpTournament.updated = new Date();
					$rootScope.tournamentList[ $rootScope.tmpTournamentIndex] = $rootScope.tmpTournament;
					saveTournamentsToLocalStorage($rootScope.tournamentList, $rootScope.playerList);

					$scope.clearTempTournamentData();
				} else {
					newID = getNextPlayerID($rootScope.playerList);
					$rootScope.tmpTournament.created = new Date();

					$rootScope.tmpTournament.updated = new Date();
					$rootScope.tournamentList.id = newID;
					$rootScope.tournamentList.push( $rootScope.tmpTournament );
					saveTournamentsToLocalStorage($rootScope.tournamentList, $rootScope.playerList);

					$scope.clearTempTournamentData();
					$scope.editTournamentPlayersDialog( $rootScope.tournamentList.length - 1) ;
				}



			}

			$scope.closeEditTournamentDialog = function() {
				$scope.showEditTournamentDialog = false;

				$scope.clearTempTournamentData();
			}

			/* *********************************************************
			 * Results and In-Play Functions
			 * ******************************************************* */
			$scope.showTournamentResults = function( tournamentIndex ) {
				alert("showTournamentResults(" + tournamentIndex + ") called - TODO");
			}

			$scope.showTournamentPage = function( tournamentIndex ) {
				localStorage["current_tournament_view"] = tournamentIndex;
				$location.path("tournaments-run"); // path not hash
			}

			/* *********************************************************
			 * Player Editing
			 * ******************************************************* */

			$scope.addPlayerToTournament = function(playerID) {
				//~ console.log( "addPlayerToTournament(" + playerID + ") called");
				$rootScope.tmpTournament.players.push( playerID );
				$rootScope.tmpTournament.createPlayerObjs( $scope.playerList );
				saveTournamentsToLocalStorage($rootScope.tournamentList, $rootScope.playerList);
				$scope.updateAvailableParticipatingPlayers();
			}

			$scope.removePlayerFromTournament = function(playerID) {
				//~ console.log( "removePlayerFromTournament(" + playerID + ") called");
				for( var playerC = 0; playerC < $rootScope.tmpTournament.players.length; playerC++ ) {
					if( $rootScope.tmpTournament.players[playerC] == playerID ) {
						$rootScope.tmpTournament.players.splice( playerC, 1);
						saveTournamentsToLocalStorage($rootScope.tournamentList, $rootScope.playerList);
						$scope.updateAvailableParticipatingPlayers();
					}

				}
			}

			$scope.updateAvailableParticipatingPlayers = function() {
				$scope.availablePlayers = Array();
				$scope.participatingPlayers =  angular.copy($rootScope.tmpTournament.playerObjs);

				for( var playerC = 0; playerC < $scope.playerList.length; playerC++ ) {
					if(
						$rootScope.tmpTournament.players.indexOf( $scope.playerList[playerC].id ) === -1
							&&
						$scope.playerList[playerC].active == true
							&&
						$scope.playerList[playerC].deleted == false
					) {
						$scope.availablePlayers.push( $scope.playerList[playerC] );
					}
				}

				$scope.availablePlayers.sort( sortByNames );
				$scope.participatingPlayers.sort( sortByNames );
			}

			$scope.showEditTournamentPlayersDialog = false;
			$scope.editTournamentPlayersDialog = function( indexNumber ) {
				$rootScope.tmpTournament = $rootScope.tournamentList[ indexNumber ];
				$scope.updateAvailableParticipatingPlayers();

				$scope.showEditTournamentPlayersDialog = true;
			}

			$scope.closeTournamentPlayersDialog = function() {
				$scope.showEditTournamentPlayersDialog = false;
				$rootScope.tmpTournament = null;
			}

			/* *********************************************************
			 * Import/Export functions.....
			 * ******************************************************* */

			$scope.importExportTournamentsDialog = function() {
				var tempTourn = $scope.tournamentList;

				for(var tournC = 0; tournC < tempTourn.length; tournC++) {
					delete tempTourn[tournC].playerObjs;
				}

				var content = JSON.stringify( tempTourn );
				var blob = new Blob([ content ], { type : 'application/javascript' });
				$scope.downloadTournamentData = (window.URL || window.webkitURL).createObjectURL( blob );

				$scope.showImportExportTournamentDialog = true;
				//~ console.log("importExportTournamentsDialog - $scope.showImportExportTournamentDialog", $scope.showImportExportTournamentDialog);
			}

			$scope.closeImportExportTournamentDialog = function() {
				$scope.showImportExportTournamentDialog = false;
				//~ console.log("closeImportExportTournamentDialog - $scope.showImportExportTournamentDialog", $scope.showImportExportTournamentDialog);
			}



			$scope.uploadFile = function(files) {
				//~ console.log( "files", files );



			    var fReader = new FileReader();

			    for( var fileCounter = 0; fileCounter < files.length; fileCounter++ ) {

					var file = files[ fileCounter ];


					fReader.onload = function(textContents) {
						if( textContents.target && textContents.target.result ) {
							//~ console.log( "textContents.target.result", textContents.target.result );
							var parsed = JSON.parse( textContents.target.result );
							if( parsed ) {
								//~ console.log( "parsed",  parsed );
								objectified = Array();
								for( var tC = 0; tC < parsed.length; tC++ ) {
									var newTournament = new Tournament( parsed[tC] );
									objectified.push( newTournament );
								}
								$rootScope.tournamentList = $rootScope.tournamentList.concat( objectified );

								saveTournamentsToLocalStorage($rootScope.tournamentList, $rootScope.playerList);
							}
						}

					};



					fReader.readAsText( file );

				}

			};

		}
	]
;


angular.module("webApp").controller(
	"controllerTourmamentsManage",
	tournamentsManageArray
);

angular.module("cordovaApp").controller(
	"controllerTourmamentsManage",
	tournamentsManageArray
);
