var coreGlobalFunctions = function ($timeout, $rootScope, $translate, $location, $route, $cordovaFile ) {


	/* *********************************************************
	 * New & Edit Player Dialogs
	 * ******************************************************* */

	$rootScope.updatePlayerFirstName = function( newValue ) {
		$rootScope.tmpPlayer.name.first = newValue;
	}

	$rootScope.updatePlayerLastName = function( newValue ) {
		$rootScope.tmpPlayer.name.last = newValue;
	}

	$rootScope.updatePlayerNickName = function( newValue ) {
		$rootScope.tmpPlayer.name.nick = newValue;
	}

	$rootScope.updatePlayerActive = function( newValue ) {
		$rootScope.tmpPlayer.active = newValue;
	}


	$rootScope.updatePlayerEmail = function( newValue ) {
		$rootScope.tmpPlayer.email = newValue;
	}

	$rootScope.updatePlayerPhone1 = function( newValue ) {
		$rootScope.tmpPlayer.phone1 = newValue;
	}

	$rootScope.newPlayerDialog = function() {
		//~ console.log("newPlayerDialog() called");


		$rootScope.clearTempPlayerData();

		$rootScope.showEditPlayerDialog = true;
	}



	/* *********************************************************
	 * Confirmation Dialog
	 * ******************************************************* */

	$rootScope.confirmDialogQuestion = "";
	$rootScope.showImportExportPlayerDialog = false;

	$rootScope.confirmDialog = function( confirmationMessage, onYes ) {
		$rootScope.confirmDialogQuestion = confirmationMessage;
		$rootScope.showConfirmDialog = true;
		$rootScope.confirmDialogYes = onYes;
	}

	$rootScope.closeConfirmDialog = function( ) {
		$rootScope.showConfirmDialog = false;
		// reset confirm to nothing...
		$rootScope.confirmDialogYes = function() {
			$rootScope.showConfirmDialog = false;
		}
	}


	$rootScope.deletePlayerDialog = function(playerID) {
		$translate([
			'PLAYERS_DELETE_CONFIRMATION'
		]).then(
			function (translation) {
				$rootScope.confirmDialog(
					translation.PLAYERS_DELETE_CONFIRMATION,
					function() {
						$rootScope.showConfirmDialog = false;
						for( var pC = 0; pC < $rootScope.playerList.length; pC++ ) {
							if( playerID == $rootScope.playerList[ pC ].id ) {
								$rootScope.playerList[ pC ].deleted = true;
								savePlayersToLocalStorage($rootScope.playerList);
								$rootScope.getNumberOfDeleted();
							}
						}

					}
				);
			}
		);
	}

	$rootScope.restorePlayerFromDelete = function(playerID) {
		//~ console.log("restorePlayerFromDelete(" + playerID + ") called");
		//playerObj = getPlayerByID( $rootScope.playerList, playerID );
		indexNumber = getPlayerIndexByID( $rootScope.playerList, playerID );
		if( $rootScope.playerList[indexNumber] ) {
			$rootScope.playerList[indexNumber].deleted = false;
			savePlayersToLocalStorage($rootScope.playerList);
			$rootScope.getNumberOfDeleted();
		} else {
			console.log("ERROR", "No playerID " + playerID + " found!");
		}
	}




	$rootScope.editPlayerDialog = function(playerID) {
		//~ console.log("editPlayerDialog(" + playerID + ") called");
		//~ playerObj = getPlayerByID( $rootScope.playerList, playerID );
		indexNumber = getPlayerIndexByID( $rootScope.playerList, playerID );
		if( $rootScope.playerList[indexNumber] ) {
			$rootScope.tmpPlayer = angular.copy( $rootScope.playerList[indexNumber] );

			$rootScope.tmpPlayerIndex = indexNumber;
			$rootScope.showEditPlayerDialog = true;

		}

	}

	$rootScope.clearTempPlayerData = function() {
		//~ console.log("clearTempPlayerData() called");

		$rootScope.tmpPlayer = new Player();

		$rootScope.tmpPlayerIndex = -1;

	}

	$rootScope.saveEditPlayerDialog = function() {

		//~ console.log("saveEditPlayerDialog() called");
		$rootScope.showEditPlayerDialog = false;


		if( $rootScope.tmpPlayerIndex > -1 ) {
			// Save to Index...

			$rootScope.tmpPlayer.updated = new Date();

			//~ console.log( $rootScope.tmpPlayer.id );
			if( $rootScope.tmpPlayer.id.length < 10 ) {
				//~ newID = getNextPlayerID($rootScope.playerList);
				$rootScope.tmpPlayer.id = generateUUID();
			}
			//~ console.log( $rootScope.tmpPlayer.id );
			$rootScope.playerList[ $rootScope.tmpPlayerIndex ] = new Player( $rootScope.tmpPlayer );
		} else {
			//~ newID = getNextPlayerID($rootScope.playerList);
			$rootScope.tmpPlayer.created = new Date();

			$rootScope.tmpPlayer.updated = new Date();
			//~ $rootScope.tmpPlayer.id = newID;
			$rootScope.playerList.push( new Player( $rootScope.tmpPlayer ) );
		}


		savePlayersToLocalStorage($rootScope.playerList);
		$rootScope.getNumberOfDeleted();

		$rootScope.clearTempPlayerData();
		//~ $route.reload();
	}

	$rootScope.getNumberOfDeleted = function() {
		$rootScope.deletedPlayers = Array();
		$rootScope.activePlayers = Array();

		for( var pC = 0; pC < $rootScope.playerList.length; pC++ ) {
			if( $rootScope.playerList[pC].deleted )
				$rootScope.deletedPlayers.push( $rootScope.playerList[pC] );
			else
				$rootScope.activePlayers.push( $rootScope.playerList[pC] );
		}

		$rootScope.numDeletedPlayers = $rootScope.deletedPlayers.length;
	}

	$rootScope.closeEditPlayerDialog = function() {
		$rootScope.showEditPlayerDialog = false;

		$rootScope.clearTempPlayerData();
	}
}


angular.module("webApp").run(
	[
		'$timeout',
		'$rootScope',
		'$translate',
		'$location',
		'$route',

		coreGlobalFunctions
	]
);

angular.module("cordovaApp").run(
	[
		'$timeout',
		'$rootScope',
		'$translate',
		'$location',
		'$route',
		'$cordovaFile',
		coreGlobalFunctions
	]
);
