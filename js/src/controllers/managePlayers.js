var playersManageArray =
	[
		'$rootScope',
		'$translate',
		'$scope',
		'$http',
		function ($rootScope, $translate, $scope, $http) {
			$translate(['APP_TITLE', 'WELCOME_BUTTON_MANAGE_PLAYERS']).then(function (translation) {
				$rootScope.title_tag = translation.WELCOME_BUTTON_MANAGE_PLAYERS + " | " + translation.APP_TITLE;
				$rootScope.subtitle_tag = "&raquo; " + translation.WELCOME_BUTTON_MANAGE_PLAYERS;
			});


			$scope.currentPlayersPage = true;
			$rootScope.playerList = getPlayersFromLocalStorage();

			/* *********************************************************
			 * Confirmation Dialog
			 * ******************************************************* */

			$scope.confirmDialogQuestion = "";
			$scope.showImportExportPlayerDialog = false;

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

			/* *********************************************************
			 * New & Edit Player Dialogs
			 * ******************************************************* */

			$scope.updatePlayerFirstName = function( newValue ) {
				$scope.tmpPlayer.name.first = newValue;
			}

			$scope.updatePlayerLastName = function( newValue ) {
				$scope.tmpPlayer.name.last = newValue;
			}

			$scope.updatePlayerNickName = function( newValue ) {
				$scope.tmpPlayer.name.nick = newValue;
			}

			$scope.updatePlayerActive = function( newValue ) {
				$scope.tmpPlayer.active = newValue;
			}


			$scope.updatePlayerEmail = function( newValue ) {
				$scope.tmpPlayer.email = newValue;
			}

			$scope.updatePlayerPhone1 = function( newValue ) {
				$scope.tmpPlayer.phone1 = newValue;
			}

			$scope.newPlayerDialog = function() {
				//~ console.log("newPlayerDialog() called");


				$scope.clearTempPlayerData();

				$scope.showEditPlayerDialog = true;
			}




			$scope.deletePlayerDialog = function(indexNumber) {
				$translate([
					'PLAYERS_DELETE_CONFIRMATION'
				]).then(
					function (translation) {
						$scope.confirmDialog(
							translation.PLAYERS_DELETE_CONFIRMATION,
							function() {
								$scope.showConfirmDialog = false;
								$rootScope.playerList.splice( indexNumber, 1 );
								savePlayersToLocalStorage($rootScope.playerList);
							}
						);
					}
				);
			}




			$scope.editPlayerDialog = function(indexNumber) {
				//~ console.log("editPlayerDialog() called");

				if( $rootScope.playerList[ indexNumber] ) {
					$scope.tmpPlayer = angular.copy($rootScope.playerList[ indexNumber ]);

					$scope.tmpPlayerIndex  = indexNumber;
					$scope.showEditPlayerDialog = true;
				}
			}

			$scope.clearTempPlayerData = function() {
				//~ console.log("clearTempPlayerData() called");

				$scope.tmpPlayer = new Player();

				$scope.tmpPlayerIndex = -1;

			}

			$scope.saveEditPlayerDialog = function() {

				//~ console.log("saveEditPlayerDialog() called");
				$scope.showEditPlayerDialog = false;


				if( $scope.tmpPlayerIndex > -1 ) {
					// Save to Index...

					$scope.tmpPlayer.updated = new Date();

					//~ console.log( $scope.tmpPlayer.id );
					if( $scope.tmpPlayer.id < 0 ) {
						newID = getNextPlayerID($rootScope.playerList);
						$scope.tmpPlayer.id = newID;
					}
					//~ console.log( $scope.tmpPlayer.id );
					$rootScope.playerList[ $scope.tmpPlayerIndex] = new Player( $scope.tmpPlayer );
				} else {
					newID = getNextPlayerID($rootScope.playerList);
					$scope.tmpPlayer.created = new Date();

					$scope.tmpPlayer.updated = new Date();
					$scope.tmpPlayer.id = newID;
					$rootScope.playerList.push( new Player( $scope.tmpPlayer ) );
				}


				savePlayersToLocalStorage($rootScope.playerList);

				$scope.clearTempPlayerData();
			}

			$scope.closeEditPlayerDialog = function() {
				$scope.showEditPlayerDialog = false;

				$scope.clearTempPlayerData();
			}

			/* *********************************************************
			 * Import/Export functions.....
			 * ******************************************************* */

			$scope.importExportPlayersDialog = function() {
				var content = JSON.stringify( $scope.playerList );
				var blob = new Blob([ content ], { type : 'application/javascript' });
				$scope.downloadPlayerData = (window.URL || window.webkitURL).createObjectURL( blob );

				$scope.showImportExportPlayerDialog = true;
			}

			$scope.closeImportExportPlayerDialog = function() {
				$scope.showImportExportPlayerDialog = false;
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
								objectified = Array();
								for( var pC = 0; pC < parsed.length; pC++ ) {
									var newPlayer = new Player( parsed[pC] );
									objectified.push( newPlayer );
								}
								$rootScope.playerList = $rootScope.playerList.concat( objectified );

								savePlayersToLocalStorage($rootScope.playerList);
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
	"controllerPlayersManage",
	playersManageArray
);

angular.module("cordovaApp").controller(
	"controllerPlayersManage",
	playersManageArray
);
