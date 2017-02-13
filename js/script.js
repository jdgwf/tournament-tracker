
var globalRoutes = 	[
	'$routeProvider',
	'$translateProvider',
	function ($routeProvider, $translateProvider, $scope, $http) {

		for( lang_count = 0; lang_count < available_languages.length; lang_count++) {
			if( available_languages[lang_count].active ) {
				$translateProvider.translations(
					available_languages[lang_count].short_code ,
					available_languages[lang_count].translations
				);
			}
		}

		$translateProvider.useSanitizeValueStrategy('sanitize');

		preferred_language = "en-US";
		if( localStorage && localStorage["tmp.preferred_language"] ) {
			preferred_language = localStorage["tmp.preferred_language"];
		} else {
			localStorage["tmp.preferred_language"] = "en-US";
		}
		$translateProvider.preferredLanguage(preferred_language);

		$routeProvider

		// route for the home/welcome page
		.when('/', {
			templateUrl : 'pages/welcome.html',
			controller  : 'welcomeController'
		})

		// route for the credits page
		.when('/credits', {
			templateUrl : 'pages/credits.html',
			controller  : 'creditsController'
		})


		// route for the credits page
		.when('/settings', {
			templateUrl : 'pages/settings.html',
			controller  : 'settingsController'
		})

		// Manage Players
		.when('/players-manage', {
			templateUrl : 'pages/players-manage.html',
			controller  : 'controllerPlayersManage'
		})

		// Manage Tournaments
		.when('/tournaments-manage', {
			templateUrl : 'pages/tournaments-manage.html',
			controller  : 'controllerTourmamentsManage'
		})

		;
	}
];

var available_languages = [];

var appVersion = "0.01Alpha";

cordovaApp = angular.module(
	'cordovaApp',
	['ngRoute', 'ngResource', 'ngSanitize','pascalprecht.translate', 'as.sortable', 'mm.foundation'],
	globalRoutes
);


angular.module('cordovaApp').controller(
	'select_language',
	[
		'$translate',
		'$scope',
		'$route',
		function ($translate, $scope, $route) {

			$scope.change_language = function (key) {
				$translate.use(key);
				localStorage["tmp.preferred_language"] = key;
				$route.reload();
			};

		}
	]
);

cordovaApp.config(['$compileProvider',
    function ($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);
}]);

var available_languages = [];

var appVersion = "0.01Alpha";

webApp = angular.module(
	'webApp',
	['ngRoute', 'ngResource', 'ngSanitize','pascalprecht.translate', 'as.sortable', 'mm.foundation'],
	globalRoutes
);


angular.module('webApp').controller(
	'select_language',
	[
		'$translate',
		'$scope',
		'$route',
		function ($translate, $scope, $route) {

			$scope.change_language = function (key) {
				$translate.use(key);
				localStorage["tmp.preferred_language"] = key;
				$route.reload();
			};

		}
	]
);


webApp.config(['$compileProvider',
    function ($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);
}]);




function generateUUID(){
    var d = new Date().getTime();
    if(window.performance && typeof window.performance.now === "function"){
        d += performance.now(); //use high-precision timer if available
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
}


function getPlayersFromLocalStorage() {
	if( !localStorage["players_list"] ) {
		localStorage["players_list"] = "[]";
		return Array();
	} else {

		var returnValue = Array();
		var importPlayers = JSON.parse( localStorage["players_list"]  );

		for( var playerC = 0; playerC < importPlayers.length; playerC++ ) {
			var newPlayer = new Player( importPlayers[playerC] );
			returnValue.push( newPlayer );
		}
		return returnValue;
	}
}

function getTournamentsFromLocalStorage( playersObject ) {
	if( !localStorage["tournaments_list"] ) {
		localStorage["tournaments_list"] = "[]";
		return Array();
	} else {
		//return JSON.parse( localStorage["tournaments_list"]  );
		var returnValue = Array();
		var importTournaments = JSON.parse( localStorage["tournaments_list"]  );

		for( var tournamentC = 0; tournamentC < importTournaments.length; tournamentC++ ) {
			var newTournament = new Tournament( importTournaments[tournamentC] );

			returnValue.push( newTournament );

		}

		return returnValue;
	}


}

function savePlayersToLocalStorage( playersObject ) {
	localStorage["players_list"] = JSON.stringify( playersObject );
}

function saveTourmanentsToLocalStorage( tournamentsObject ) {
	var tmp = tournamentsObject;
	if( tmp.playerObjs )
		delete tmp.playerObjs;
	localStorage["tournaments_list"] = JSON.stringify( tmp );
}

function getPlayerByID( playersList, playerID ) {
	for( var playerCount = 0; playerCount < playersList.length; playerCount++ ) {
		if( playersList[ playerCount ].id == playerID )
			return playersList[ playerCount ];
	}
	return null;
}

function getNextPlayerID( playersObject ) {
	maxID = 0;
	for( var playerCount = 0; playerCount < playersObject.length; playerCount++ ) {
		if( playersObject[ playerCount ].id > maxID )
			maxID =  playersObject[ playerCount ].id;
	}

	return maxID + 1;
}


var class_dice = function() {};

class_dice.prototype = {

	init: function() {
		this.always_exploding_dice = false;

		this.roll_set_count_rolls = [];
		this.roll_set_count = 0;

		this.label_no_effect = "No Effect";
		this.label_shaken = "Shaken";
		this.label_shaken_and_a_wound = "Shaken and a wound";
		this.label_shaken_and_x_wounds = "Shaken and {raises} wounds";

		this.label_critical_failure = "Critical Failure";
		this.label_failure = "Failure";
		this.label_success = "Success";
		this.label_success_with_a_raise = "Success with a raise";
		this.label_success_with_x_raises = "Success with {raises} raises";

		this.label_die_roll_number = "die roll #";
		this.label_wild_die_roll_number = "wild die roll #";

		this.label_roll_set_number = "Roll Set #";

		this.label_total_roll = "Total Roll";

		this.success_target_number = 4;
		this.success_base_toughness = 5;
		this.success_armor = 1;
		this.success_weapons_ap = 0;
	},
	roll_die: function(number_of_sides, exploding_die, wild_die) {

		if(!number_of_sides)
			number_of_sides = 6;


		total_roll = 0;
		keep_rolling = 1;
		display_roll = "";
		while(keep_rolling > 0) {
			roll = Math.floor(Math.random() * number_of_sides) + 1;
			if(exploding_die > 0) {
				if(roll == number_of_sides)
					keep_rolling = 1;
				else
					keep_rolling = 0;
			} else {
				keep_rolling = 0;
			}


			display_roll += roll + ", ";
			total_roll += roll;

		}

		this.roll_set_count_rolls[ this.roll_set_count ].base_rolls.push( display_roll );
		this.roll_set_count_rolls[ this.roll_set_count ].base_roll_sides.push(number_of_sides);
		wild_display_roll = "";
		totalwild_dieRoll = 0;
		keep_rolling = 1;
		if(wild_die > 0) {
			number_of_sides = 6;
			while(keep_rolling > 0) {
				roll = Math.floor(Math.random() * number_of_sides) + 1;
				if(exploding_die > 0) {
					if(roll == number_of_sides)
						keep_rolling = 1;
					else
						keep_rolling = 0;
				} else {
					keep_rolling = 0;
				}



				totalwild_dieRoll += roll;

				wild_display_roll += roll + ", ";
			}
		}
		this.roll_set_count_rolls[ this.roll_set_count ].wild_die_rolls.push(wild_display_roll);

		if(totalwild_dieRoll == 1 && total_roll == 1)
			this.roll_set_count_rolls[ this.roll_set_count ].critical_failure= 1;
		else
			this.roll_set_count_rolls[ this.roll_set_count ].critical_failure= 0;

		if(totalwild_dieRoll > total_roll)
			return totalwild_dieRoll;
		else
			return total_roll;

	},

	roll_dice: function (number_of_dice, total_modifier) { // 2d6+3 would be this.roll_dice(2,3)

		var returnTotal = 0;
		number_of_sides = 6;

		if(number_of_dice.indexOf("*") > 0)
			wild_die = 1;
		else
			wild_die = 0;

		if(number_of_sides < 2)
			number_of_sides = 2;

		number_of_dice = number_of_dice.replace("*", "");

		explodingDice = 0;
		if(number_of_dice.indexOf("d") > -1) {
			rollNumber = number_of_dice.substring(0, number_of_dice.indexOf("d")) / 1;
			number_of_sides = number_of_dice.substring(number_of_dice.indexOf("d") + 1) / 1;
			if(this.always_exploding_dice)
				explodingDice = 1;
		} else {
			if(number_of_dice.indexOf("e") > -1) {
				explodingDice = 1;
				rollNumber = number_of_dice.substring(0, number_of_dice.indexOf("e")) / 1;
				number_of_sides = number_of_dice.substring(number_of_dice.indexOf("e") + 1) / 1;
			} else {
				rollNumber = number_of_dice;
			}
		}

		// a dX assumes 1dX
		if(!rollNumber)
			rollNumber = 1;

		// a 2d assumes 2d6
		if(!number_of_sides)
			number_of_sides = 6;

		var rolls = rollNumber + "d" + number_of_sides + ": ";
		while(rollNumber-- > 0) {

			dieRoll = this.roll_die(number_of_sides, explodingDice, wild_die);
			returnTotal += dieRoll;
			rolls += dieRoll + ",";
			this.roll_set_count_rolls[ this.roll_set_count ].total_rolled_dice++;
		}
		rolls = rolls.substring(0, rolls.length -1);
		rolls += "";



		return returnTotal;
	},
	_parse_bit: function (input_string) {
		value = 0;

		if(input_string.indexOf("d") > -1)
			value = this.roll_dice(input_string, 0);
		else
			if(input_string.indexOf("e") > -1)
				value = this.roll_dice(input_string, 0);
			else
				value = input_string / 1;

		return value;
	},

	_parse_roll_set: function( input_string ) {
		set_total = 0;

		// remove all spaces...

		input_string = input_string.replace(/ /g, "");
		input_string = input_string.toLowerCase();

		// parse mathematical expressions
		input_string = input_string.replace(/\+/g, " + ");
		input_string = input_string.replace(/x/g, " x ");
		input_string = input_string.replace(/\//g, " / ");
		input_string = input_string.replace(/\-/g, " - ");
		input_string = input_string.replace(/\)/g, " ) ");
		input_string = input_string.replace(/\(/g, " ( ");
		input_string = input_string.replace(/\,/g, " , ");


		this.roll_set_count_rolls[ this.roll_set_count ] = {};

		this.roll_set_count_rolls[ this.roll_set_count ].base_rolls = [];
		this.roll_set_count_rolls[ this.roll_set_count ].wild_die_rolls = [];
		this.roll_set_count_rolls[ this.roll_set_count ].base_roll_sides = [];
		this.roll_set_count_rolls[ this.roll_set_count ].total_rolled_dice = 0;
		this.roll_set_count_rolls[ this.roll_set_count ].critical_failure = 0;

		if(input_string.indexOf(" ") > 0) {
			items = input_string.split(" ");

			current_function = "+";
			for(count = 0; count < items.length; count++) {

				if(
					items[count] != "+"
						&&
					items[count] != "x"
						&&
					items[count] != "-"
						&&
					items[count] != "/"
				) {
					// parse the bit
					if(current_function == "+") {
						set_total += this._parse_bit( items[count]) / 1;
					} else {
						if(current_function == "-") {
							set_total -= this._parse_bit( items[count]) / 1;
						} else {
							if(current_function == "x") {
								if(set_total == 0) {
									set_total = items[count] / 1;
								} else {
									set_total = set_total * this._parse_bit( items[count]) / 1;
								}
							} else {
								if(current_function == "/") {
									set_total = set_total / this._parse_bit( items[count]) / 1;
								} else {
									// ignore parentheticals for now
								}
							}
						}
					}
				} else {
					// change what it does...
					current_function = items[count];
				}

			}

		} else {
			set_total += this._parse_bit( input_string);

		}
		this.roll_set_count_rolls[ this.roll_set_count ].total_roll = set_total;
		this.roll_set_count++;
	},

	parse_roll: function (parse_roll_input_string) {

		// look for modifier(s)....
		total = 0;
		this.roll_set_count = 0;
		this.roll_set_count_rolls = [];

		if(parse_roll_input_string.indexOf(",") > 0) {
			parse_roll_items = parse_roll_input_string.split(",");
			for( parse_roll_itemcount = 0; parse_roll_itemcount < parse_roll_items.length; parse_roll_itemcount++) {
				total = this._parse_roll_set( parse_roll_items[parse_roll_itemcount] );
			}
		} else {
			total += this._parse_roll_set( parse_roll_input_string );
		}

		return total;
	},

	display_results: function (for_trait, for_damage) {
		html = "";
		for( results_set_count = 0; results_set_count < this.roll_set_count; results_set_count++ ) {
			if( this.roll_set_count > 1 ) {
				if( results_set_count > 0) {
					html += "<hr />";
				}
				html += "<h4>" + this.label_roll_set_number + (results_set_count + 1) + "</h4>";
			}


			html += "<h5>" + this.label_total_roll + ": " + this.roll_set_count_rolls[ results_set_count ].total_roll + "</h5>"

			if( for_trait )
				html += this.trait_success_margin( this.roll_set_count_rolls[ results_set_count ].total_roll, null, results_set_count ) + "<br />";

			if( for_damage )
				html += this.damage_success_margin( this.roll_set_count_rolls[ results_set_count ].total_roll ) + "<br />";

			for(current_roll = 0; current_roll < this.roll_set_count_rolls[ results_set_count ].total_rolled_dice; current_roll++) {
				// each die roll section
				if(typeof(this.roll_set_count_rolls[ results_set_count ].base_rolls[ current_roll ]) != "undefined") {
					html += "<br />" + this.label_die_roll_number  + "" + (current_roll + 1) + " (d" + this.roll_set_count_rolls[ results_set_count ].base_roll_sides[ current_roll ] + "): ";
					if( this.roll_set_count_rolls[ results_set_count ].base_rolls[ current_roll ] ) {
						if( this.roll_set_count_rolls[ results_set_count ].base_rolls[ current_roll ].length > 2 ) {
							html += this.roll_set_count_rolls[ results_set_count ].base_rolls[ current_roll ].substring(
								0,
								this.roll_set_count_rolls[ results_set_count ].base_rolls[ current_roll ].length - 2
							);
						} else {
							html += this.roll_set_count_rolls[ results_set_count ].base_rolls[ current_roll ];
						}
					}

				}

				// print out wild die rolls if exists
				if(typeof(this.roll_set_count_rolls[ results_set_count ].wild_die_rolls[ current_roll ]) != "undefined") {
					if(this.roll_set_count_rolls[ results_set_count ].wild_die_rolls[ current_roll ].length > 0)
						html += "<br />" + this.label_wild_die_roll_number + ( current_roll  + 1) + " (d6): ";

					if( this.roll_set_count_rolls[ results_set_count ].wild_die_rolls[ current_roll ] ) {
						if( this.roll_set_count_rolls[ results_set_count ].wild_die_rolls[ current_roll ].length > 2 ) {
							html += this.roll_set_count_rolls[ results_set_count ].wild_die_rolls[ current_roll ].substring(
								0,
								this.roll_set_count_rolls[ results_set_count ].wild_die_rolls[ current_roll ].length - 2
							);
						} else {
							html += this.roll_set_count_rolls[ results_set_count ].wild_die_rolls[ current_roll ];
						}
					}
				}

			}
		}

		return html;
	},
	trait_success_margin: function (roll, target_number, trait_set_count) {

		if (! target_number )
			target_number = this.success_target_number;

		value = roll/1 - target_number/1;

		html = "";


		if(typeof(trait_set_count) != "undefined" && this.roll_set_count_rolls[ trait_set_count ].critical_failure > 0) {
			html += "<span  class=\"color-red bolded uppercase\">" + this.label_critical_failure + "</span>";
		} else {
			if(value < 0) {
				html += "<span  class=\"color-red\">" + this.label_failure + "</span>";
			} else {
				raises = Math.floor(value/4);
				if(raises == 0) {
					html += this.label_success;
				} else {
					if( raises == 1) {
						html += "<span  class=\"color-green bolded\">" + this.label_success_with_a_raise + "</span>";
					} else {
						html += "<span  class=\"color-green bolded uppercase\">" + this.label_success_with_x_raises.replace("{raises}", raises) + "</span>";
					}
				}
			}
		}

		return html;
	},

	set_result_margins: function( input_target_number, input_base_toughness, input_armor, input_weapons_ap ) {
		this.success_target_number = input_target_number;
		this.success_base_toughness = input_base_toughness;
		this.success_armor = input_armor;
		this.success_weapons_ap = input_weapons_ap;
	},

	set_label: function( label_name, label_value ) {
		if( label_name == "no_effect") {
			this.label_no_effect = label_value;
			return label_value;
		}

		if( label_name == "total_roll") {
			this.label_total_roll = label_value;
			return label_value;
		}

		if( label_name == "shaken") {
			this.label_shaken = label_value;
			return label_value;
		}

		if( label_name == "shaken_and_a_wound") {
			this.label_shaken_and_a_wound = label_value;
			return label_value;
		}

		if( label_name == "shaken_and_x_wounds") {
			this.label_shaken_and_x_wounds = label_value;
			return label_value;
		}

		if( label_name == "critical_failure") {
			this.label_critical_failure = label_value;
			return label_value;
		}

		if( label_name == "roll_set_number") {
			this.label_roll_set_number = label_value;
			return label_value;
		}

		if( label_name == "failure") {
			this.label_failure = label_value;
			return label_value;
		}

		if( label_name == "success") {
			this.label_success = label_value;
			return label_value;
		}

		if( label_name == "success_with_a_raise") {
			this.label_success_with_a_raise = label_value;
			return label_value;
		}

		if( label_name == "success_with_x_raises") {
			this.label_success_with_x_raises = label_value;
			return label_value;
		}

		if( label_name == "die_roll_number") {
			this.label_die_roll_number = label_value;
			return label_value;
		}

		if( label_name == "wild_die_roll_number") {
			this.label_wild_die_roll_number = label_value;
			return label_value;
		}

		return null;
	},

	set_always_exploding_dice: function( new_value ) {
		this.always_exploding_dice = new_value;
		return this.always_exploding_dice;
	},

	damage_success_margin: function (roll, toughness, armor, armor_piercing) {

		if( !toughness )
			toughness = this.success_base_toughness;

		if( !armor )
			armor = this.success_armor;

		if( !armor_piercing )
			armor_piercing = this.success_weapons_ap;

		armor = armor/1 - armor_piercing/1;
		if(armor < 0)
			armor = 0;

		target_number = toughness/1 + armor/1;
		value = roll/1 - target_number/1;

		html = "";
		if(value < 0) {
			html += "<span>" + this.label_no_effect + "</span>";
		} else {
			raises = Math.floor(value/4);
			if(raises == 0) {
				html += "<span class=\"color-orange\">" + this.label_shaken + "</span>";
			} else {
				if( raises == 1) {
					html += "<span class=\"color-red\">" + this.label_shaken_and_a_wound + "</span>";
				} else {
					html += "<span class=\"color-red bolded uppercase\">" + this.label_shaken_and_x_wounds.replace("{raises}", raises) + "</span>";
				}
			}
		}
		return html;
	}
}


function Player ( importPlayer ) {

	this.name = {
		first: "",
		last: "",
		nick: "",
	};

	this.email = "";
	this.phone1 = "";



	this.active = true;
	this.id = -1;

	if( typeof(importPlayer) != "undefined" ) {
		this.name = {
			first: importPlayer.name.first,
			last: importPlayer.name.last,
			nick: importPlayer.name.nick,
		};

		this.email = importPlayer.email;
		this.phone1 = importPlayer.phone1;

		this.active = true;
		this.id = -1;
	}

	this.newFunction = function() {

	}
}

function Tournament (importTournament, playerObjects) {

	this.players = Array();
	this.playerObjs = Array();
	this.name = "";

	this.createPlayerObjs = function( playersObjs) {
		for( var playerC = 0; playerC < this.players.length; playerC ) {
			var player = getPlayerByID( playersObjs, this.players[ playerC] );
			if( player )
				this.playerObjs.push( player );
		}

	}

	if( typeof(importTournament) != "undefined" ) {
		this.players = importPlayer.players;
		this.name = importPlayer.name;
	}

	if( typeof(playerObjects) != "undefined" ) {
		this.createPlayerObjs(playerObjects);
	}

}

var creditsArray =
	[
		'$rootScope',
		'$translate',
		'$scope',
		function ($rootScope, $translate, $scope) {
			$translate(['APP_TITLE', 'INDEX_WELCOME']).then(function (translation) {
				$rootScope.title_tag = translation.INDEX_WELCOME + " | " + translation.APP_TITLE;
				$rootScope.subtitle_tag = "&raquo; " + translation.INDEX_CREDITS;
			});

			$scope.currentCreditsPage = true;


		}
	]
;



angular.module("webApp").controller(
	"creditsController",
	creditsArray
);

angular.module("cordovaApp").controller(
	"creditsController",
	creditsArray
);

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


				if( $scope.tmpPlayerIndex > -1 ) {
					// Save to Index...

					$scope.tmpPlayer.updated = new Date();
					$rootScope.playerList[ $scope.tmpPlayerIndex] = $scope.tmpPlayer;
				} else {
					newID = getNextPlayerID($rootScope.playerList);
					$scope.tmpPlayer.created = new Date();

					$scope.tmpPlayer.updated = new Date();
					$rootScope.playerList.id = newID;
					$rootScope.playerList.push( $scope.tmpPlayer );
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
								$rootScope.playerList = $rootScope.playerList.concat( parsed );

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

var settingsArray = [
	'$rootScope',
	'$translate',
	'$scope',
	'$route',
	function ($rootScope, $translate,  $scope, $route) {


		$translate(['APP_TITLE', 'GENERAL_SETTINGS']).then(function (translation) {
			$rootScope.title_tag = translation.GENERAL_SETTINGS + " | " + translation.APP_TITLE;
			$rootScope.subtitle_tag = translation.GENERAL_SETTINGS;
		});

		$scope.currentSettingsPage = true;


		$scope.available_languages = Array();
		$scope.users_language = {};
		for( lang_count = 0; lang_count < available_languages.length; lang_count++) {
			if( available_languages[lang_count].active ) {
				language_object = {
					id: available_languages[lang_count].short_code,
					label: available_languages[lang_count].native_name
				};
				$scope.available_languages.push(
					language_object
				);
				if(localStorage["users_preferred_language"] == available_languages[lang_count].short_code ) {
					$scope.users_language = language_object;
					$scope.background_image_url = "url(images/flags/64/" + available_languages[lang_count].icon_file + ")";
				}
			}
		}

		$scope.chargen_pdf_layout = localStorage["users_chargen_pdf_layout"];

		$scope.updateLanguage = function( language_selected ) {

			$translate.use($scope.users_language.id);
			localStorage["users_preferred_language"] = $scope.users_language.id;
			for( lang_count = 0; lang_count < available_languages.length; lang_count++) {
				if( available_languages[lang_count].active ) {
					if(localStorage["users_preferred_language"] == available_languages[lang_count].short_code ) {
						$scope.background_image_url = "url(images/flags/64/" + available_languages[lang_count].icon_file + ")";
					}
				}
			}

			$route.reload();
		}

		$scope.updateChargenPDF = function( pdf_selected ) {
			//console.log( "updateChargenPDF", pdf_selected );
			localStorage["users_chargen_pdf_layout"] = pdf_selected;
			$scope.chargen_pdf_layout = pdf_selected;
			$route.reload();
		}

		// $scope.change_language = function (key) {
		// 	$translate.use(key);
		// 	localStorage["users_preferred_language"] = key;

		// 	$route.reload();
		// };

	}
];
angular.module("webApp").controller(
	"settingsController",
	settingsArray
);

angular.module("cordovaApp").controller(
	"settingsController",
	settingsArray
);


var welcomeArray =
	[
		'$rootScope',
		'$translate',
		'$scope',
		function ($rootScope, $translate, $scope) {
			$translate(['APP_TITLE', 'INDEX_WELCOME']).then(function (translation) {
				$rootScope.title_tag = translation.INDEX_WELCOME + " | " + translation.APP_TITLE;
				$rootScope.subtitle_tag = "&raquo; " + translation.INDEX_WELCOME;
			});

			$scope.currentWelcomePage = true;
		}
	]
;


angular.module("webApp").controller(
	"welcomeController",
	welcomeArray
);

angular.module("cordovaApp").controller(
	"welcomeController",
	welcomeArray
);

available_languages.push ({
	english_name: "German",
	native_name: "Deutsch",
	icon_file: "DE.png",
	short_code: "de-DE",
	active: true,

	translations: {


	}

} );

available_languages.push ({
	english_name: "English",
	native_name: "English",
	icon_file: "US.png",
	short_code: "en-US",
	active: true,

	translations: {

		APP_TITLE: '@Gauthic\'s Tournament Tracker',

		INDEX_WELCOME: 'Welcome',
		INDEX_H3_CORE: '@Gauthic\'s Tournament Tracker',

		MENU_TITLE_HOME: "Click here to go home",
		MENU_TITLE_MANAGE_PLAYERS: "Click here go to player management",
		MENU_TITLE_MANAGE_TOURNAMENTS: "Click here to go to tournament management",
		MENU_TITLE_SETTINGS: "Click here to change settings",
		MENU_TITLE_CREDITS: "Click here to view the credits and help",


		MENU_TITLE_EXPORT_PLAYERS: "Click here to import and/or export players",
		MENU_TITLE_ADD_PLAYER: "Click here to add a player",

		MENU_TITLE_EXPORT_TOURNAMENTS: "Click here to import and/or export tournaments",
		MENU_TITLE_ADD_TOURNAMENT: "Click here to add a tournament",

		GENERAL_SELECT_LANGUAGE: "Select Langage",
		GENERAL_SETTINGS: "Settings",
		GENERAL_CREDITS: 'Credits',
		GENERAL_COPYRIGHT: 'Copyright',
		GENERAL_WELCOME: 'Welcome',
		GENERAL_POINTS: 'Points',
		GENERAL_POINT: 'Point',
		GENERAL_POINT_VALUE: 'Point Value',
		GENERAL_RULES: 'Rules',
		GENERAL_GROUP: 'Group',
		GENERAL_SKILL: 'Skill',
		GENERAL_NAME: 'Name',
		GENERAL_ALL: 'All',
		GENERAL_SEARCH: 'Search',
		GENERAL_SEARCH_RESULTS: 'Search Results',
		GENERAL_CANCEL: "Cancel",
		GENERAL_ACTIVE: "Active",
		GENERAL_DOWNLOAD: "Download",
		GENERAL_IMPORT: "Import",
		GENERAL_EXPORT: "Export",

		GENERAL_ITEM_EDIT: "Edit Item",
		GENERAL_ITEM_REMOVE: "Remove Item",

		GENERAL_YES: "Yes",
		GENERAL_NO: "No",
		GENERAL_SAVE: "Save",
		GENERAL_CLOSE: "Close",

		GENERAL_NAME_FIRST: "First Name",
		GENERAL_NAME_LAST: "Last Name",
		GENERAL_NAME_NICK: "Nickname",
		GENERAL_PHONE: "Phone",
		GENERAL_PHONE_NUMBER: "Phone NUmber",
		GENERAL_EMAIL: "Email",
		GENERAL_EMAIL_ADDRESS: "Email Address",

		GENERAL_INTRODUCTORY: "Introductory",
		GENERAL_STANDARD: "Standard",
		GENERAL_ADVANCED: "Advanced",
		GENERAL_CLOSE: "Close",

		BUTTON_LANG_EN: 'English',
		BUTTON_LANG_DE: 'German',
		BUTTON_LANG_BR: 'Brazilian',


		PLAYERS_DELETE_CONFIRMATION: "Are you sure you want to delete this player?",
		PLAYERS_IMPORT_INSTRUCTIONS: "To import players into this app, navigate to your Players.json file you have saved.",
		PLAYERS_DOWNLOAD_INSTRUCTIONS: "Click on the button below to download the current Players data object",

		TOURNAMENTS_DELETE_CONFIRMATION: "Are you sure you want to delete this tournament?",
		TOURNAMENTS_IMPORT_INSTRUCTIONS: "To import players into this app, navigate to your Tournaments.json file you have saved.",
		TOURNAMENTS_DOWNLOAD_INSTRUCTIONS: "Click on the button below to download the current Tournaments data object",


		WELCOME_BUTTON_MANAGE_PLAYERS: "Manage Players",
		WELCOME_BUTTON_MANAGE_PLAYERS_DESC: "Before you can actually set up a tournament, you'll probably need to add some players here.",
		WELCOME_BUTTON_MANAGE_TOURNAMENTS: "Manage Tourmaments",
		WELCOME_BUTTON_MANAGE_TOURNAMENTS_DESC: "In this area you'll find your past tournaments you've tracked on this device."

	}

} );
