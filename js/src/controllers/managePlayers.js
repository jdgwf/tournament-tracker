var playersManageArray =
	[
		'$rootScope',
		'$translate',
		'$scope',
		'$http',
		function ($rootScope, $translate, $scope, $http) {
			$translate(['APP_TITLE', 'WELCOME_BUTTON_MANAGE_PLAYERS', 'GENERAL_FILTER_SEARCH_PLAYERS']).then(function (translation) {
				$rootScope.title_tag = translation.WELCOME_BUTTON_MANAGE_PLAYERS + " | " + translation.APP_TITLE;
				$rootScope.subtitle_tag = "&raquo; " + translation.GENERAL_FILTER_SEARCH_PLAYERS;
				$rootScope.filterSearchPlayersPlaceholder = translation.GENERAL_FILTER_SEARCH_PLAYERS;
			});

			$scope.filterSearchTerm = "";

			$scope.currentPlayersPage = true;
			$rootScope.playerList = getPlayersFromLocalStorage();



			$rootScope.tournamentList = getTournamentsFromLocalStorage();
			for( var tC = 0; tC < $rootScope.tournamentList.length; tC++) {
				$rootScope.tournamentList[ tC ].createPlayerObjs( $rootScope.playerList );
			}

			$rootScope.currentTournament = null;
			if( $rootScope.tournamentList[ localStorage["current_tournament_view"] ] ) {
				$rootScope.currentTournament = $rootScope.tournamentList[ localStorage["current_tournament_view"] ]
			}



			$rootScope.getNumberOfDeleted();



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
							playersUpdated = 0;
							playersCreated = 0;
							if( parsed ) {
								objectified = Array();
								for( var pC = 0; pC < parsed.length; pC++ ) {
									var newPlayer = new Player( parsed[pC] );

									// Don't duplicate ID numbers!!!
									playerIDExists = getPlayerIndexByID( $rootScope.playerList, newPlayer.id )
									if( playerIDExists > -1) {
										if( $scope.importAsNewPlayers ) {
											newPlayer.id = getNextPlayerID( $rootScope.playerList);
											objectified.push( newPlayer );
											playersCreated++;
										} else {
											$rootScope.playerList[ playerIDExists ] = newPlayer;
											playersUpdated++;
										}
									} else {
										objectified.push( newPlayer );
										playersCreated++;
									}
								}
								$rootScope.playerList = $rootScope.playerList.concat( objectified );

								savePlayersToLocalStorage($rootScope.playerList);

								$rootScope.getNumberOfDeleted();
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
