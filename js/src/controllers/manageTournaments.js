var tournamentsManageArray =
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

			$scope.currentTournamentsPage = true;

			$rootScope.playerList = getPlayersFromLocalStorage();

			$rootScope.tournamentList = getTournamentsFromLocalStorage();
			for( var tC = 0; tC < $rootScope.tournamentList.length; tC++) {
				$rootScope.tournamentList[ tC ].createPlayerObjs( $rootScope.playerList );
			}

			$scope.currentTournament = null;
			if( $rootScope.tournamentList[ localStorage["current_tournament_view"] ] ) {
				$scope.currentTournament = $rootScope.tournamentList[ localStorage["current_tournament_view"] ]
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
				$scope.tmpTournament.name = newValue;
			}

			$scope.updateTournamentRounds = function( newValue ) {
				$scope.tmpTournament.numberOfRounds = newValue;
			}

			$scope.updateTournamentPointsForWin = function( newValue ) {
				$scope.tmpTournament.pointsForWin = newValue;
			}

			$scope.updateTournamentPointsForDraw = function( newValue ) {
				$scope.tmpTournament.pointsForDraw = newValue;
			}

			$scope.updateTournamentPointsForLoss = function( newValue ) {
				$scope.tmpTournament.pointsForLoss = newValue;
			}

			$scope.updateByeIsAverage = function( newValue ) {
				$scope.tmpTournament.byeIsAverage = newValue;
			}

			$scope.updateTournamentPointsForBye = function( newValue ) {
				$scope.tmpTournament.pointsForBye = newValue;
			}

			$scope.updateTournamentScoringPaint = function( newValue ) {
				$scope.tmpTournament.scoringPaint = newValue;
			}

			$scope.updateTournamentScoringComp = function( newValue ) {
				$scope.tmpTournament.scoringComp = newValue;
			}

			$scope.updateTournamentScoringSportsmanship = function( newValue ) {
				$scope.tmpTournament.scoringSportsmanship = newValue;
			}

			$scope.updateTournamentTrackPerGameSportsmanship = function( newValue ) {
				$scope.tmpTournament.trackPerGameSportsmanship = newValue;
			}


			$scope.updateTournamentWarnSportsmanship = function( newValue ) {
				$scope.tmpTournament.warnSportsmanship = newValue;
			}

			$scope.newTournamentDialog = function() {
				//~ console.log("newTournamentDialog() called");


				$scope.clearTempTournamentData();

				$scope.showEditTournamentDialog = true;
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
					$scope.tmpTournament = angular.copy( $rootScope.tournamentList[ indexNumber ] );

					$scope.tmpTournamentIndex  = indexNumber;
					$scope.showEditTournamentDialog = true;
				}
			}

			$scope.clearTempTournamentData = function() {
				//~ console.log("clearTempTournamentData() called");

				$scope.tmpTournament = new Tournament();

				$scope.tmpTournamentIndex = -1;

			}

			$scope.saveEditTournamentDialog = function() {

				//~ console.log("saveEditTournamentDialog() called");
				$scope.showEditTournamentDialog = false;


				if( $scope.tmpTournamentIndex > -1 ) {
					// Save to Index...

					$scope.tmpTournament.updated = new Date();
					$rootScope.tournamentList[ $scope.tmpTournamentIndex] = $scope.tmpTournament;
				} else {
					newID = getNextPlayerID($rootScope.playerList);
					$scope.tmpTournament.created = new Date();

					$scope.tmpTournament.updated = new Date();
					$rootScope.tournamentList.id = newID;
					$rootScope.tournamentList.push( $scope.tmpTournament );
				}


				saveTournamentsToLocalStorage($rootScope.tournamentList, $rootScope.playerList);

				$scope.clearTempTournamentData();
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
				console.log( "addPlayerToTournament(" + playerID + ") called");
				$scope.tmpTournament.players.push( playerID );
				$scope.tmpTournament.createPlayerObjs( $scope.playerList );
				saveTournamentsToLocalStorage($rootScope.tournamentList, $rootScope.playerList);
				$scope.updateAvailableParticipatingPlayers();
			}

			$scope.removePlayerFromTournament = function(playerID) {
				console.log( "removePlayerFromTournament(" + playerID + ") called");
				for( var playerC = 0; playerC < $scope.tmpTournament.players.length; playerC++ ) {
					if( $scope.tmpTournament.players[playerC] == playerID ) {
						$scope.tmpTournament.players.splice( playerC, 1);
						saveTournamentsToLocalStorage($rootScope.tournamentList, $rootScope.playerList);
						$scope.updateAvailableParticipatingPlayers();
					}

				}
			}

			$scope.updateAvailableParticipatingPlayers = function() {
				$scope.availablePlayers = Array();
				$scope.participatingPlayers =  angular.copy($scope.tmpTournament.playerObjs);

				for( var playerC = 0; playerC < $scope.playerList.length; playerC++ ) {
					if(
						$scope.tmpTournament.players.indexOf( $scope.playerList[playerC].id ) === -1
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
				$scope.tmpTournament = $rootScope.tournamentList[ indexNumber ];
				$scope.updateAvailableParticipatingPlayers();

				$scope.showEditTournamentPlayersDialog = true;
			}

			$scope.closeTournamentPlayersDialog = function() {
				$scope.showEditTournamentPlayersDialog = false;
				$scope.tmpTournament = null;
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
				console.log("importExportTournamentsDialog - $scope.showImportExportTournamentDialog", $scope.showImportExportTournamentDialog);
			}

			$scope.closeImportExportTournamentDialog = function() {
				$scope.showImportExportTournamentDialog = false;
				console.log("closeImportExportTournamentDialog - $scope.showImportExportTournamentDialog", $scope.showImportExportTournamentDialog);
			}



			$scope.uploadFile = function(files) {
				console.log( "files", files );



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
