var tournamentsManageArray =
	[
		'$rootScope',
		'$translate',
		'$scope',
		function ($rootScope, $translate, $scope) {
			$translate(['APP_TITLE', 'WELCOME_BUTTON_MANAGE_TOURNAMENTS']).then(function (translation) {
				$rootScope.title_tag = translation.WELCOME_BUTTON_MANAGE_TOURNAMENTS + " | " + translation.APP_TITLE;
				$rootScope.subtitle_tag = "&raquo; " + translation.WELCOME_BUTTON_MANAGE_TOURNAMENTS;
			});

			$scope.currentTournamentsPage = true;

			$rootScope.playerList = getPlayersFromLocalStorage();

			$rootScope.tournamentList = getTournamentsFromLocalStorage();


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
			 * Import/Export functions.....
			 * ******************************************************* */

			$scope.importExportTournamentsDialog = function() {
				var content = JSON.stringify( $scope.tournamentsList );
				var blob = new Blob([ content ], { type : 'application/javascript' });
				$scope.downloadTournamentData = (window.URL || window.webkitURL).createObjectURL( blob );

				$scope.showImportExportTournamentDialog = true;
			}

			$scope.closeImportExportTournamentDialog = function() {
				$scope.showImportExportTournamentDialog = false;
			}



			$scope.uploadFile = function(files) {
				console.log( "files", files );



			    var fReader = new FileReader();

			    for( var fileCounter = 0; fileCounter < files.length; fileCounter++ ) {

					var file = files[ fileCounter ];


					fReader.onload = function(textContents) {
						if( textContents.target && textContents.target.result ) {
							console.log( "textContents.target.result", textContents.target.result );
							var parsed = JSON.parse( textContents.target.result );
							if( parsed ) {
								console.log( "parsed",  parsed );
								$rootScope.tournamentList = $rootScope.tournamentList.concat( parsed );

								saveTournamentsToLocalStorage($rootScope.tournamentList);
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
