var playersManageArray =
	[
		'$rootScope',
		'$translate',
		'$scope',
		function ($rootScope, $translate, $scope) {
			$translate(['APP_TITLE', 'WELCOME_BUTTON_MANAGE_PLAYERS']).then(function (translation) {
				$rootScope.title_tag = translation.WELCOME_BUTTON_MANAGE_PLAYERS + " | " + translation.APP_TITLE;
				$rootScope.subtitle_tag = "&raquo; " + translation.WELCOME_BUTTON_MANAGE_PLAYERS;
			});


			$rootScope.playerList = getPlayersFromLocalStorage();

			// Confirmation Dialog

			$scope.confirmDialogQuestion = "";

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

			// New & Edit Player Dialogs

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
				console.log("newPlayerDialog() called");


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
					$scope.tmpPlayer = $rootScope.playerList[ indexNumber ];

					$scope.tmpPlayerIndex  = indexNumber;
					$scope.showEditPlayerDialog = true;
				}
			}

			$scope.clearTempPlayerData = function() {
				console.log("clearTempPlayerData() called");

				$scope.tmpPlayer = new Player();

				$scope.tmpPlayerIndex = -1;

			}

			$scope.saveEditPlayerDialog = function() {

				console.log("saveEditPlayerDialog() called");
				$scope.showEditPlayerDialog = false;

				//~ console.log( "$rootscope.tmpPlayerNameFirst", $scope.tmpPlayerNameFirst );
				//~ console.log( "$scope.tmpPlayerNameLast", $scope.tmpPlayerNameLast );
				//~ console.log( "$scope.tmpPlayerNameNick", $scope.tmpPlayerNameNick );
				//~ console.log( "$scope.tmpPlayerActive", $scope.tmpPlayerActive );




				//~ console.log( "playerObject", playerObject );
				//~ console.log( "$scope.tmpPlayerIndex", $scope.tmpPlayerIndex );
				if( $scope.tmpPlayerIndex > -1 ) {
					// Save to Index...
					$rootScope.playerList[ $scope.tmpPlayerIndex] = $scope.tmpPlayer;
				} else {
					newID = getNextPlayerID($rootScope.playerList);
					$rootScope.playerList.id = newID;
					$rootScope.playerList.push( $scope.tmpPlayer );
				}


				savePlayersToLocalStorage($rootScope.playerList);

				$scope.clearTempPlayerData();
			}

			$scope.closeEditPlayerDialog = function() {
				//~ console.log("closeEditPlayerDialog() called");
				$scope.showEditPlayerDialog = false;

				$scope.clearTempPlayerData();
			}


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
