
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

		// Manage Players
		.when('/players-deleted', {
			templateUrl : 'pages/players-deleted.html',
			controller  : 'controllerPlayersManage'
		})

		// Manage Tournaments
		.when('/tournaments-manage', {
			templateUrl : 'pages/tournaments-manage.html',
			controller  : 'controllerTourmamentsManage'
		})

		// Run Tournaments
		.when('/tournaments-run', {
			templateUrl : 'pages/tournaments-run.html',
			controller  : 'controllerTourmamentsRun'
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

		returnValue.sort( sortByNames );
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
	playersObject.sort( sortByNames );
	localStorage["players_list"] = JSON.stringify( playersObject );

}

function saveTournamentsToLocalStorage( tournamentsObject, playersList ) {
	console.log( tournamentsObject );
	for( var tC = 0; tC < tournamentsObject.length; tC++ ) {
		if( tournamentsObject[tC].playerObjs )
			delete tournamentsObject[tC].playerObjs;
		if( tournamentsObject[tC].matchupObjs )
			delete tournamentsObject[tC].matchupObjs;
	}
	localStorage["tournaments_list"] = JSON.stringify( tournamentsObject );
	for( var tC = 0; tC < tournamentsObject.length; tC++ ) {
		tournamentsObject[ tC ].createPlayerObjs( playersList );
		tournamentsObject[ tC ].createMatchupObjs( playersList );
	}
}

function getPlayerByID( playersList, playerID ) {
	for( var playerCount = 0; playerCount < playersList.length; playerCount++ ) {
		if( playersList[ playerCount ].id == playerID )
			return playersList[ playerCount ];
	}
	return null;
}

function getPlayerIndexByID( playersList, playerID ) {
	for( var playerCount = 0; playerCount < playersList.length; playerCount++ ) {
		if( playersList[ playerCount ].id == playerID )
			return playerCount;
	}
	return -1;
}

function getNextPlayerID( playersObject ) {
	maxID = 0;
	for( var playerCount = 0; playerCount < playersObject.length; playerCount++ ) {
		if( playersObject[ playerCount ].id > maxID )
			maxID =  playersObject[ playerCount ].id;
	}

	return maxID + 1;
}

function sortByNames(a,b) {
  if (a.name.last < b.name.last)
    return -1;
  if (a.name.last > b.name.last)
    return 1;
  if (a.name.first < b.name.first)
    return -1;
  if (a.name.first > b.name.first)
    return 1;
  if (a.name.nick < b.name.nick)
    return -1;
  if (a.name.nick > b.name.nick)
    return 1;
  return 0;
}

function sortByBaseScore(a,b) {
  if (a.pointsBase > b.pointsBase)
    return -1;
  if (a.pointsBase < b.pointsBase)
    return 1;
  return 0;
}

function sortByFinalScore(a,b) {
  if (a.pointsFinal > b.pointsFinal)
    return -1;
  if (a.pointsFinal < b.pointsFinal)
    return 1;
  return 0;
}

function formatDate( incomingDate ) {
	var dateFormat = require('dateformat');

	return dateFormat(incomingDate, "dddd, mmmm dS, yyyy, h:MM:ss TT");
}

function shuffleArray(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
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

	this.created = new Date();
	this.updated = new Date();

	this.active = true;
	this.deleted = false;
	this.id = -1;

	if( typeof(importPlayer) != "undefined" ) {
		if( typeof(importPlayer.email) != "undefined") {
			this.name = {
				first: importPlayer.name.first.trim(),
				last: importPlayer.name.last.trim(),
				nick: importPlayer.name.nick.trim(),
			};
		}

		if( typeof(importPlayer.created) != "undefined" )
			this.created = new Date( importPlayer.created );

		if( typeof(importPlayer.updated) != "undefined" )
			this.updated = new Date( importPlayer.updated );

		if( typeof(importPlayer.email) != "undefined")
			this.email = importPlayer.email;

		if( typeof(importPlayer.phone1) != "undefined")
			this.phone1 = importPlayer.phone1;

		if( typeof(importPlayer.active) != "undefined")
			this.active = importPlayer.active;

		if( typeof(importPlayer.deleted) != "undefined")
			this.deleted = importPlayer.deleted;


		if( typeof(importPlayer.id) != "undefined")
			this.id = importPlayer.id;
	}

	this.newFunction = function() {

	}
}

function Tournament (importTournament, playerObjects) {

	this.players = Array();
	this.playerObjs = Array();
	this.name = "";

	this.numberOfRounds = 4;

	this.pointsForWin = 2;
	this.pointsForDraw = 1;
	this.pointsForLoss = 0;
	this.pointsForBye = 1;

	this.byeIsAverage = true;

	this.scoringPaint = false;
	this.scoringComp = false;
	this.scoringSportsmanship = false;

	this.created = new Date();
	this.updated = new Date();

	this.completed = false;

	this.trackPerGameSportsmanship = true;
	this.warnSportsmanship = 2;

	this.scoring = Array();	// base score from win/loss/draw status
	this.extraPoints = Array(); // per game extra points

	this.pointsPainting = Array();
	this.pointsComposition = Array();
	this.pointsSportsmanship = Array();

	this.currentRound = 0;
	this.matches = Array();

	this.noDuplicateMatchups = true;
	this.matchupType = "highest-ranking";

	this.createMatchupObjs = function( playersObjs) {
		console.log( "classTournament.createMatchupObjs() called" );
		this.matchupObjs = Array();

		console.log( "classTournament.createMatchupObjs()", this.matches);

		for( var roundNumber in this.matches ) {
			this.matchupObjs[ roundNumber ] = Array();
			if( this.matches[ roundNumber ] ) {
				for( var roundC = 0; roundC < this.matches[roundNumber].length; roundC++ ) {
					var matchObj = {
						table: this.matches[roundNumber][roundC].table,
						player1: getPlayerByID( playersObjs, this.matches[roundNumber][roundC].player1 ),
						player2: getPlayerByID( playersObjs, this.matches[roundNumber][roundC].player2 )
					};
					this.matchupObjs[ roundNumber ].push( matchObj );
				}
			}
		}

		console.log( "classTournament.createMatchupObjs()", this.matchupObjs);
	}

	this.createMatchRound = function( roundNumber, playersObjs ) {

		console.log( "classTournament.createMatchupObjs(" + roundNumber + ") called" );



		this.createPlayerObjs( playersObjs );

		var matchArray = Array();

		this.matches[ roundNumber ] = Array();

		if( this.matchupType == "highest-ranking" ) {
			console.log( "classTournament.createMatchupObjs() - sorting by highest-ranking" );
			this.sortPlayerObjsByBaseScore();
		} else if( this.matchupType == "random" ) {
			console.log( "classTournament.createMatchupObjs() - sorting by random" );
			this.playerObjs = shuffleArray( this.playerObjs );
		} else {
			console.log( "classTournament.createMatchupObjs() - unknown sort '" + this.matchupType + "' - sorting by highest-ranking" );
			this.sortPlayerObjsByBaseScore();
		}

		var matchCounter = 0;
		var tableNumber = 1;
		var hasByes = false;
		if( this.playerObjs.length % 2 == 0 ) {
			while( matchCounter <  this.playerObjs.length  ) {
				var matchObj = {
					table: tableNumber,
					player1: this.playerObjs[ matchCounter ].id,
					player2: this.playerObjs[ matchCounter + 1 ].id
				};

				this.matches[ roundNumber ].push( matchObj );

				tableNumber++;

				matchCounter += 2;
			}
		} else {

			while( matchCounter <  this.playerObjs.length  ) {

				// A tournament really should never be this little, but.....
				adjustModifier = 0;
				if( this.playerObjs.length > 4 )
					adjustModifier = -1 ;


				if(
					((this.playerObjs.length - 1) / 2) - adjustModifier <= matchCounter
						&&
					((this.playerObjs.length + 1) / 2) - adjustModifier > matchCounter
				) {
					console.log("Bye Obj", matchCounter);
					hasByes = true;
					var matchObj = {
						table: tableNumber,
						player1: this.playerObjs[ matchCounter ].id,
						player2: -1
					};
					this.matches[ roundNumber ].push( matchObj );

					tableNumber++;

					matchCounter += 1;
				} else {
					console.log("Non-Bye Obj", matchCounter);
					var matchObj = {
						table: tableNumber,
						player1: this.playerObjs[ matchCounter ].id,
						player2: this.playerObjs[ matchCounter + 1 ].id
					};
					this.matches[ roundNumber ].push( matchObj );

					tableNumber++;

					matchCounter += 2;
				}




			}


		}


		this.createMatchupObjs( playersObjs );

		// Now it's time to check if someone's had a bye before, or if players who have played other players need to be swapped out..
		// TODO!

	}

	this.getScore = function( roundNumber, playerID ) {
		if( typeof(this.scoring[ roundNumber - 1]) != "undefined" && typeof(this.scoring[ roundNumber - 1][playerID]) != "undefined" )
			return this.scoring[ roundNumber - 1][playerID];
		return null;
	}

	this.setScore = function( roundNumber, playerID, newScore ) {
		if( typeof(this.scoring[ roundNumber - 1]) == "undefined" )
			this.scoring[ roundNumber - 1] = Array();

		if( typeof(this.scoring[ roundNumber - 1][playerID]) == "undefined" )
			this.scoring[ roundNumber - 1][playerID] = -1;

		this.scoring[ roundNumber - 1][playerID] = newScore
		return this.scoring[ roundNumber - 1][playerID];
	}


	this.getExtraPoints = function( roundNumber, playerID ) {
		console.log("getExtraPoints",  roundNumber, playerID )
		console.log("this.extraPoints", this.extraPoints);
		if(
			typeof(this.extraPoints[ roundNumber - 1]) != "undefined"
				&&
			typeof(this.extraPoints[ roundNumber - 1][playerID]) != "undefined"
				&&
			this.extraPoints[ roundNumber - 1][playerID] > 0
		) {
			//console.log("found", this.extraPoints[ roundNumber - 1][playerID]);
			return this.extraPoints[ roundNumber - 1][playerID];
		}
		return 0;
	}

	this.getPaintingPoints = function( playerID ) {
		if( this.pointsPainting[ playerID ] )
			return this.pointsPainting[ playerID ];
		return 0;
	}

	this.setPaintingPoints = function( playerID, newValue ) {
		this.pointsPainting[ playerID ] = newValue;
		return this.pointsPainting[ playerID ];
	}

	this.getCompPoints = function( playerID ) {
		if( this.pointsComposition[ playerID ] )
			return this.pointsComposition[ playerID ];
		return 0;
	}

	this.setCompPoints = function( playerID, newValue ) {
		this.pointsComposition[ playerID ] = newValue;
		return this.pointsComposition[ playerID ];
	}

	this.getSportsPoints = function( playerID ) {
		if( this.pointsSportsmanship[ playerID ] )
			return this.pointsSportsmanship[ playerID ];
		return 0;
	}

	this.setSportsPoints = function( playerID, newValue ) {
		this.pointsSportsmanship[ playerID ] = newValue;
		return this.pointsSportsmanship[ playerID ];
	}

	this.setExtraPoints = function( roundNumber, playerID, newScore ) {
		if( typeof(this.extraPoints[ roundNumber - 1]) == "undefined" )
			this.extraPoints[ roundNumber - 1] = Array();

		if( typeof(this.extraPoints[ roundNumber - 1][playerID]) == "undefined" )
			this.extraPoints[ roundNumber - 1][playerID] = -1;

		this.extraPoints[ roundNumber - 1][playerID] = newScore
		return this.extraPoints[ roundNumber - 1][playerID];
	}


	this.sortPlayerObjsByBaseScore = function() {
		this.calculateResults();
		this.playerObjs.sort( sortByBaseScore );
		console.log( "classTournament.sortPlayerObjsByBaseScore() called" );
	}

	this.createPlayerObjs = function( playersObjs) {
		this.playerObjs = Array();
		for( var playerC = 0; playerC < this.players.length; playerC++ ) {
			var player = getPlayerByID( playersObjs, this.players[ playerC ] );
			if( player ) {
				if( player.name.nick != '' )
					player.displayName = player.name.first + " \"" + player.name.nick + "\" " + player.name.last;
				else
					player.displayName = player.name.first + " " + player.name.last;
				this.playerObjs.push( player );
			}
		}

		for( var roundC = 0; roundC < this.numberOfRounds; roundC++ ) {
			console.log( "roundC", roundC);
			if( typeof( this.scoring[ roundC ] ) == "undefined")
				this.scoring[ roundC ] = Array();
			for( var playerC = 0; playerC < this.playerObjs.length; playerC++ ) {
				if(
					typeof( this.scoring[ roundC ][this.playerObjs[playerC].id] ) == "undefined"
						||
					this.scoring[ roundC ][this.playerObjs[playerC].id] == -1
						||
					this.scoring[ roundC ][this.playerObjs[playerC].id] == null
				) {
					if( this.isByeRound( roundC + 1, this.playerObjs[playerC].id) )
						this.scoring[ roundC ][this.playerObjs[playerC].id] = "bye";
					else
						this.scoring[ roundC ][this.playerObjs[playerC].id] = -1;
				}

				if( typeof( this.pointsPainting[this.playerObjs[playerC].id] ) == "undefined")
					this.pointsPainting[this.playerObjs[playerC].id] = -1;

				if( typeof( this.pointsComposition[this.playerObjs[playerC].id] ) == "undefined")
					this.pointsComposition[this.playerObjs[playerC].id] = -1;

				if( typeof( this.pointsSportsmanship[this.playerObjs[playerC].id] ) == "undefined")
					this.pointsSportsmanship[this.playerObjs[playerC].id] = -1;
			}
		}
		this.sortPlayerObjsByBaseScore();


		console.log( "this.scoring", this.scoring);
	}

	this.isByeRound = function( roundNumber, playerID ) {
		if( this.matches[ roundNumber ] ) {
			for( var matchC = 0; matchC < this.matches[ roundNumber ].length; matchC++ ) {
				if( this.matches[ roundNumber ][ matchC ].player1 == playerID && this.matches[ roundNumber ][ matchC ].player2 == -1 ) {
					return true;
				}
			}
		}

		return false;
	}

	this.getMatch = function( roundNumber, playerID ) {
		if( this.matches[ roundNumber ] ) {
			for( var matchC = 0; matchC < this.matches[ roundNumber ].length; matchC++ ) {
				if(
					(
						this.matches[ roundNumber ][ matchC ].player1 == playerID
						&&
						this.matches[ roundNumber ][ matchC ].player2 != -1
					)
						||
					(
						this.matches[ roundNumber ][ matchC ].player2 == playerID
					)
				) {
					return this.matches[ roundNumber ][ matchC ];
				}
			}
		}

		return null;
	}

	this.calculateResults = function() {
		this.totals = Array();

		for( var playerC = 0; playerC < this.playerObjs.length; playerC++ ) {
			numByes = 0;
			playerTotal = 0;

			for( var roundC = 0; roundC < this.scoring.length; roundC++ ) {
				if(
					this.scoring[ roundC ][ this.playerObjs[playerC].id ] != "bye"
						&&
					this.scoring[ roundC ][ this.playerObjs[playerC].id ] != -1
				) {
					if( this.scoring[ roundC ][ this.playerObjs[playerC].id ] == "win" ) {
						playerTotal += this.pointsForWin;
						//~ console.log( "this.pointsForWin - playerTotal", playerTotal);
					} else if ( this.scoring[ roundC ][ this.playerObjs[playerC].id ] == "loss" ) {
						playerTotal += this.pointsForLoss;
						//~ console.log( "this.pointsForLoss - playerTotal", playerTotal);
					} else if ( this.scoring[ roundC ][ this.playerObjs[playerC].id ] == "draw" ) {
						playerTotal += this.pointsForDraw;
						//~ console.log( "this.pointsForDraw - playerTotal", playerTotal);
					} else {
						//this.scoring[ roundC ][ this.playerObjs[playerC].id ]
					}

				}

				if(
					this.extraPoints[ roundC ]
						&&
					this.extraPoints[ roundC ][ this.playerObjs[playerC].id ]
						&&
					this.extraPoints[ roundC ][ this.playerObjs[playerC].id ] > 0
				) {
					playerTotal += this.extraPoints[ roundC ][ this.playerObjs[playerC].id ];
				}

				if( this.scoring[ roundC ][ this.playerObjs[playerC].id ] == "bye") {
					if(
						this.byeIsAverage == false
							||
						this.currentRound < 2
					) {
						console.log( "pointsForBye", this.currentRound );
						playerTotal += this.pointsForBye;
					}
					numByes++;
				}
			}

			if( this.byeIsAverage == true && numByes > 0 && this.currentRound > 1) {
				console.log("average bye", numByes, playerTotal);
				if( this.currentRound - numByes  > 0 ) {
					averageRound = Math.round(playerTotal / ( this.currentRound - numByes ));
					playerTotal += averageRound * numByes;
				} else {
					// two byes right at the start (WTF, really tourney admin?). Division by Zeros are BAD!
					// We'll just put the default value for byes in until something comes up.
					playerTotal += this.pointsForBye * numByes;
				}

			}

			this.totals[ this.playerObjs[ playerC ].id ] = playerTotal;

			this.playerObjs[ playerC ].pointsBase = playerTotal;


			this.playerObjs[ playerC ].pointsFinal = this.playerObjs[ playerC ].pointsBase;

			if( this.pointsPainting[ this.playerObjs[ playerC ].id] > 0 )
				this.playerObjs[ playerC ].pointsFinal += this.pointsPainting[ this.playerObjs[ playerC ].id];

			if( this.pointsComposition[ this.playerObjs[ playerC ].id] > 0 )
				this.playerObjs[ playerC ].pointsFinal +=  this.pointsComposition[ this.playerObjs[ playerC ].id];


			if( this.pointsSportsmanship[ this.playerObjs[ playerC ].id] > 0 )
				this.playerObjs[ playerC ].pointsFinal += this.pointsSportsmanship[ this.playerObjs[ playerC ].id];

		}
	}

	if( typeof(importTournament) != "undefined" ) {
		this.players = importTournament.players;
		this.name = importTournament.name;

		if( typeof(importTournament.currentRound) != "undefined" )
			this.currentRound = importTournament.currentRound;

		if( typeof(importTournament.matches) != "undefined" )
			this.matches = importTournament.matches;

		if( typeof(importTournament.created) != "undefined" )
			this.created = new Date(importTournament.created);

		if( typeof(importTournament.updated) != "undefined" )
			this.updated = new Date(importTournament.updated);

		if( typeof(importTournament.completed) != "undefined" )
			this.completed = importTournament.completed;

		if( typeof(importTournament.scoring) != "undefined" )
			this.scoring = importTournament.scoring;
		if( typeof(importTournament.extraPoints) != "undefined" )
			this.extraPoints = importTournament.extraPoints;

		if( typeof(importTournament.pointsPainting) != "undefined" )
			this.pointsPainting = importTournament.pointsPainting;
		if( typeof(importTournament.pointsComposition) != "undefined" )
			this.pointsComposition = importTournament.pointsComposition;
		if( typeof(importTournament.pointsSportsmanship) != "undefined" )
			this.pointsSportsmanship = importTournament.pointsSportsmanship;

		if( typeof(importTournament.numberOfRounds) != "undefined" )
			this.numberOfRounds = importTournament.numberOfRounds;

		if( typeof(importTournament.pointsForWin) != "undefined" )
			this.pointsForWin = importTournament.pointsForWin;
		if( typeof(importTournament.pointsForDraw) != "undefined" )
			this.pointsForDraw = importTournament.pointsForDraw;
		if( typeof(importTournament.pointsForLoss) != "undefined" )
			this.pointsForLoss = importTournament.pointsForLoss;
		if( typeof(importTournament.pointsForBye) != "undefined" )
			this.pointsForBye = importTournament.pointsForBye;

		if( typeof(importTournament.byeIsAverage) != "undefined" )
			this.byeIsAverage = importTournament.byeIsAverage;

		if( typeof(importTournament.scoringPaint) != "undefined" )
			this.scoringPaint = importTournament.scoringPaint;
		if( typeof(importTournament.scoringComp) != "undefined" )
			this.scoringComp = importTournament.scoringComp;
		if( typeof(importTournament.scoringSportsmanship) != "undefined" )
			this.scoringSportsmanship = importTournament.scoringSportsmanship;

		if( typeof(importTournament.trackPerGameSportsmanship) != "undefined" )
			this.trackPerGameSportsmanship = importTournament.trackPerGameSportsmanship;
		if( typeof(importTournament.warnSportsmanship) != "undefined" )
			this.warnSportsmanship = importTournament.warnSportsmanship;


		if( typeof(importTournament.noDuplicateMatchups) != "undefined" )
			this.noDuplicateMatchups = importTournament.noDuplicateMatchups;
		if( typeof(importTournament.matchupType) != "undefined" )
			this.matchupType = importTournament.matchupType;

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

			$rootScope.playerList = getPlayersFromLocalStorage();


			$rootScope.tournamentList = getTournamentsFromLocalStorage();
			for( var tC = 0; tC < $rootScope.tournamentList.length; tC++) {
				$rootScope.tournamentList[ tC ].createPlayerObjs( $rootScope.playerList );
			}

			$scope.currentTournament = null;
			if( $rootScope.tournamentList[ localStorage["current_tournament_view"] ] ) {
				$scope.currentTournament = $rootScope.tournamentList[ localStorage["current_tournament_view"] ]
			}
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



			$rootScope.tournamentList = getTournamentsFromLocalStorage();
			for( var tC = 0; tC < $rootScope.tournamentList.length; tC++) {
				$rootScope.tournamentList[ tC ].createPlayerObjs( $rootScope.playerList );
			}

			$scope.currentTournament = null;
			if( $rootScope.tournamentList[ localStorage["current_tournament_view"] ] ) {
				$scope.currentTournament = $rootScope.tournamentList[ localStorage["current_tournament_view"] ]
			}

			$scope.getNumberOfDeleted = function() {
				$scope.deletedPlayers = Array();
				$scope.activePlayers = Array();

				for( var pC = 0; pC < $rootScope.playerList.length; pC++ ) {
					if( $rootScope.playerList[pC].deleted )
						$scope.deletedPlayers.push( $rootScope.playerList[pC] );
					else
						$scope.activePlayers.push( $rootScope.playerList[pC] );
				}

				$scope.numDeletedPlayers = $scope.deletedPlayers.length;
			}

			$scope.getNumberOfDeleted();

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




			$scope.deletePlayerDialog = function(playerID) {
				$translate([
					'PLAYERS_DELETE_CONFIRMATION'
				]).then(
					function (translation) {
						$scope.confirmDialog(
							translation.PLAYERS_DELETE_CONFIRMATION,
							function() {
								$scope.showConfirmDialog = false;
								for( var pC = 0; pC < $rootScope.playerList.length; pC++ ) {
									if( playerID == $rootScope.playerList[ pC ].id ) {
										$rootScope.playerList[ pC ].deleted = true;
										savePlayersToLocalStorage($rootScope.playerList);
										$scope.getNumberOfDeleted();
									}
								}

							}
						);
					}
				);
			}

			$scope.restorePlayerFromDelete = function(playerID) {
				console.log("restorePlayerFromDelete(" + playerID + ") called");
				//playerObj = getPlayerByID( $rootScope.playerList, playerID );
				indexNumber = getPlayerIndexByID( $rootScope.playerList, playerID );
				if( $rootScope.playerList[indexNumber] ) {
					$rootScope.playerList[indexNumber].deleted = false;
					savePlayersToLocalStorage($rootScope.playerList);
					$scope.getNumberOfDeleted();
				} else {
					console.log("ERROR", "No playerID " + playerID + " found!");
				}
			}




			$scope.editPlayerDialog = function(playerID) {
				//~ console.log("editPlayerDialog(" + playerID + ") called");
				//~ playerObj = getPlayerByID( $rootScope.playerList, playerID );
				indexNumber = getPlayerIndexByID( $rootScope.playerList, playerID );
				if( $rootScope.playerList[indexNumber] ) {
					$scope.tmpPlayer = angular.copy( $rootScope.playerList[indexNumber] );

					$scope.tmpPlayerIndex = indexNumber;
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
					$rootScope.playerList[ $scope.tmpPlayerIndex ] = new Player( $scope.tmpPlayer );
				} else {
					newID = getNextPlayerID($rootScope.playerList);
					$scope.tmpPlayer.created = new Date();

					$scope.tmpPlayer.updated = new Date();
					$scope.tmpPlayer.id = newID;
					$rootScope.playerList.push( new Player( $scope.tmpPlayer ) );
				}


				savePlayersToLocalStorage($rootScope.playerList);
				$scope.getNumberOfDeleted();

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

								$scope.getNumberOfDeleted();
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
		'$location',
		'$scope',
		function ($rootScope, $translate, $location, $scope) {


			$translate(['APP_TITLE', 'WELCOME_BUTTON_MANAGE_TOURNAMENTS', 'TOURNAMENTS_MATCHUP_HIGHEST_RANKING', 'TOURNAMENTS_MATCHUP_RANDOM']).then(function (translation) {
				$rootScope.title_tag = translation.WELCOME_BUTTON_MANAGE_TOURNAMENTS + " | " + translation.APP_TITLE;
				$rootScope.subtitle_tag = "&raquo; " + translation.WELCOME_BUTTON_MANAGE_TOURNAMENTS;

				$scope.tournamentMatchupOptions = Array();

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

			$rootScope.playerList = getPlayersFromLocalStorage();

			$rootScope.tournamentList = getTournamentsFromLocalStorage();
			for( var tC = 0; tC < $rootScope.tournamentList.length; tC++) {
				$rootScope.tournamentList[ tC ].createPlayerObjs( $rootScope.playerList );
			}

			$scope.currentTournament = null;
			if( $rootScope.tournamentList[ localStorage["current_tournament_view"] ] ) {
				$scope.currentTournament = $rootScope.tournamentList[ localStorage["current_tournament_view"] ]
				if( $scope.currentTournament.playerObjs.length == 0 || $scope.currentTournament.completed )
					$scope.currentTournament = null;
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

				$scope.getMatchupSelection( $scope.tmpTournament.matchupType );

				$scope.showEditTournamentDialog = true;
			}

			$scope.updateTmpMatchupSelection = function( newValue ) {
				$scope.tmpMatchupSelection = newValue;
			}

			$scope.updateNoDuplicateMatchups = function( newValue ) {
				$scope.tmpTournament.noDuplicateMatchups = newValue;
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

					$scope.getMatchupSelection( $scope.tmpTournament.matchupType );

					$scope.tmpTournamentIndex  = indexNumber;
					$scope.showEditTournamentDialog = true;
				}
			}

			$scope.clearTempTournamentData = function() {
				//~ console.log("clearTempTournamentData() called");

				$scope.tmpTournament = new Tournament();
				$scope.getMatchupSelection( $scope.tmpTournament.matchupType );

				$scope.tmpTournamentIndex = -1;

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

				$scope.tmpTournament.matchupType = $scope.tmpMatchupSelection.id;


				if( $scope.tmpTournamentIndex > -1 ) {
					// Save to Index...

					$scope.tmpTournament.updated = new Date();
					$rootScope.tournamentList[ $scope.tmpTournamentIndex] = $scope.tmpTournament;
					saveTournamentsToLocalStorage($rootScope.tournamentList, $rootScope.playerList);

					$scope.clearTempTournamentData();
				} else {
					newID = getNextPlayerID($rootScope.playerList);
					$scope.tmpTournament.created = new Date();

					$scope.tmpTournament.updated = new Date();
					$rootScope.tournamentList.id = newID;
					$rootScope.tournamentList.push( $scope.tmpTournament );
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

var tournamentsRunArray =
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
				console.log("editScore(" + playerID + ", " + roundNumber + ")");

				var theMatch = $scope.currentTournament.getMatch( roundNumber, playerID );
				console.log( "theMatch", theMatch );

				$scope.editScorePlayer1 = getPlayerByID( $scope.playerList, theMatch.player1 );
				$scope.editScorePlayer2 = getPlayerByID( $scope.playerList, theMatch.player2 );
				$scope.tmpPlayer1Score = $scope.currentTournament.getScore( roundNumber, theMatch.player1 );
				$scope.tmpPlayer2Score = $scope.currentTournament.getScore( roundNumber, theMatch.player2 );

				$scope.tmpPlayer1ExtraPoints = $scope.currentTournament.getExtraPoints( roundNumber, theMatch.player1 );
				$scope.tmpPlayer2ExtraPoints = $scope.currentTournament.getExtraPoints( roundNumber, theMatch.player2 );


				$scope.editRoundNumber =  roundNumber;
				$scope.editTableNumber =  theMatch.table;


				console.log( "$scope.editScorePlayer1", $scope.editScorePlayer1 );
				console.log( "$scope.editScorePlayer2", $scope.editScorePlayer2 );

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
						$scope.tmpPlayer2Score = -1;
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
						$scope.tmpPlayer1Score = -1;
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

			$scope.cancelEditScoreDialog = function() {

				$scope.editScorePlayer1 = null;
				$scope.editScorePlayer2 = null;
				$scope.tmpPlayer1Score = null;
				$scope.tmpPlayer2Score = null;

				$scope.tmpPlayer1ExtraPoints = null;
				$scope.tmpPlayer2ExtraPoints = null;


				$scope.editRoundNumber =  null;
				$scope.editTableNumber =  null;
				$scope.showEditScoreDialog = false;
			}

			$scope.saveEditScoreDialog = function() {

				$scope.currentTournament.setScore( $scope.editRoundNumber, $scope.editScorePlayer1.id, $scope.tmpPlayer1Score);
				$scope.currentTournament.setScore( $scope.editRoundNumber, $scope.editScorePlayer2.id, $scope.tmpPlayer2Score);

				$scope.currentTournament.setExtraPoints( $scope.editRoundNumber, $scope.editScorePlayer1.id, $scope.tmpPlayer1ExtraPoints);
				$scope.currentTournament.setExtraPoints( $scope.editRoundNumber, $scope.editScorePlayer2.id, $scope.tmpPlayer2ExtraPoints);


				$scope.currentTournament.calculateResults();
				saveTournamentsToLocalStorage($rootScope.tournamentList, $rootScope.playerList);

				$scope.editScorePlayer1 = null;
				$scope.editScorePlayer2 = null;
				$scope.tmpPlayer1Score = null;
				$scope.tmpPlayer2Score = null;

				$scope.tmpPlayer1ExtraPoints = null;
				$scope.tmpPlayer2ExtraPoints = null;


				$scope.editRoundNumber =  null;
				$scope.editTableNumber =  null;
				$scope.showEditScoreDialog = false;
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

			$rootScope.playerList = getPlayersFromLocalStorage();


			$rootScope.tournamentList = getTournamentsFromLocalStorage();
			for( var tC = 0; tC < $rootScope.tournamentList.length; tC++) {
				$rootScope.tournamentList[ tC ].createPlayerObjs( $rootScope.playerList );
			}

			$scope.currentTournament = null;
			if( $rootScope.tournamentList[ localStorage["current_tournament_view"] ] ) {
				$scope.currentTournament = $rootScope.tournamentList[ localStorage["current_tournament_view"] ]
			}

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

			$rootScope.playerList = getPlayersFromLocalStorage();


			$rootScope.tournamentList = getTournamentsFromLocalStorage();
			for( var tC = 0; tC < $rootScope.tournamentList.length; tC++) {
				$rootScope.tournamentList[ tC ].createPlayerObjs( $rootScope.playerList );
			}

			$scope.currentTournament = null;
			if( $rootScope.tournamentList[ localStorage["current_tournament_view"] ] ) {
				$scope.currentTournament = $rootScope.tournamentList[ localStorage["current_tournament_view"] ]
			}
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
		MENU_TITLE_CURRENT_TOURNAMENT: "Click here to return to your in-progress tournament",

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
		GENERAL_SAVE: "Save",
		GENERAL_ADD: "Add",
		GENERAL_PLAYER: 'Player',
		GENERAL_ITEM_RESTORE: "Restore",
		GENERAL_BYE: "Bye",

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

		GENERAL_IMPORT_EXPORT_EXPLANATION: "Use this import/export function to transfer data from one device to another.",

		GENERAL_INTRODUCTORY: "Introductory",
		GENERAL_STANDARD: "Standard",
		GENERAL_ADVANCED: "Advanced",
		GENERAL_CLOSE: "Close",
		GENERAL_ERROR: "Error",
		GENERAL_CREATED: "Created",
		GENERAL_UPDATED: "Updated",
		GENERAL_FINISHED: "Finished",
		GENERAL_FINISHED: "Deleted",
		GENERAL_ID: "ID",
		GENERAL_ROUND: "Round",

		GENERAL_NOT_ENTERED: "Not Entered",
		GENERAL_WIN: "Win",
		GENERAL_DRAW: "Draw",
		GENERAL_LOSS: "Loss",

		GENERAL_ROTATE_TO_LANDSCAPE: "Please rotate your device to landscape for optimal viewing",

		BUTTON_LANG_EN: 'English',
		BUTTON_LANG_DE: 'German',
		BUTTON_LANG_BR: 'Brazilian',

		PLAYERS_DELETE_CONFIRMATION: "Are you sure you want to delete this player?",
		PLAYERS_IMPORT_INSTRUCTIONS: "To import players into this app, navigate to your Players.json file you have saved.",
		PLAYERS_DOWNLOAD_INSTRUCTIONS: "Click on the button below to download the current Players data object",
		PLAYERS_RETURN_TO_MANAGE: "Return to Player Management",
		PLAYERS_DELETED_PLAYERS: "Deleted Players",
		PLAYERS_NO_PLAYERS: "There are no players here. Add one by pressing the + at the top of the screen.",
		PLAYERS_NO_DELETED_PLAYERS: "There are no deleted players",
		PLAYERS_IMPORT_OVERWRITE_INSTRUCTIONS: "If you have an import file with existing Player IDs, then check here to create new IDs for players in the import file.<br /><strong>Warning</strong>: If you do not check this, any existing Player IDs in the import file will overwrite your existing Player Data.",

		TOURNAMENTS_DELETE_CONFIRMATION: "Are you sure you want to delete this tournament?",
		TOURNAMENTS_IMPORT_INSTRUCTIONS: "To import tournaments into this app, navigate to your Tournaments.json file you have saved. <strong>Be sure that your Players.json and Tournaments.json match, otherwise you may have orphan or wrong players!</strong>",

		TOURNAMENTS_DOWNLOAD_INSTRUCTIONS: "Click on the button below to download the current Tournaments data object",
		TOURNAMENTS_NAME: "Tournament Name",
		TOURNAMENTS_NUM_PLAYERS: "# Players",
		TOURNAMENTS_EDIT_PLAYERS: "Edit Players",
		TOURNAMENTS_BASE_SCORING: "Base Scoring",
		TOURNAMENTS_EXTRA_SCORING: "Extra Scoring",

		TOURNAMENTS_MATCHUP_SETTINGS: "Matchup Settings",
		TOURNAMENTS_MATCHUP_ORDERING: "Matchup Ordering",
		TOURNAMENTS_MATCHUP_NO_DUPLICATES: "No duplicate matchups, if possible",

		TOURNAMENTS_MATCHUP_HIGHEST_RANKING: "Highest Ranking",
		TOURNAMENTS_MATCHUP_RANDOM: "Random",


		TOURNAMENTS_PLAYERS: "Players",
		TOURNAMENTS_GENERAL_SETTINGS: "General Settings",
		TOURNAMENTS_POINTS_FOR_WIN: "Points for Win",
		TOURNAMENTS_POINTS_FOR_DRAW: "Points for Draw",
		TOURNAMENTS_POINTS_FOR_LOSS: "Points for Loss",
		TOURNAMENTS_POINTS_FOR_BYE: "Points for Bye",
		TOURNAMENTS_BYE_IS_AVERAGE: "Bye is Average",
		TOURNAMENTS_SCORING_PAINT: "Score Painting",
		TOURNAMENTS_SCORING_COMP: "Score Army Composition",
		TOURNAMENTS_SCORING_SPORTSMANSHIP: "Score Sportsmanship",
		TOURNAMENTS_SPORTSMANSHIP_PER_GAME: "Sportsmanship tracked per game",
		TOURNAMENTS_SPORTSMANSHIP_WARN: "Warn if Player receives the following number of negative sportsmanship marks",
		TOURNAMENTS_PLAYERS_PARTCIPATING: "Participating Players",
		TOURNAMENTS_PLAYERS_AVAILABLE: "Available Players",
		TOURNAMENTS_GO_TO_PLAYERS: "Go To Players",
		TOURNAMENTS_NO_AVAILABLE_PLAYERS: "There are no available players to add. Please visit the Player Adminsitration screen to add players.",
		TOURNAMENTS_NO_PLAYERS: "There are no players in this tournament",
		TOURNAMENTS_NUMBER_OF_ROUNDS: "Number of Rounds",
		TOURNAMENTS_NO_TOURNAMENTS: "There are no tournaments here. Add one by pressing the + at the top of the screen.",

		TOURNAMENT_IN_PLAY: "Tournament In-Play",
		TOURNAMENT_NO_CURRENT_TOURNAMENT: "For some reason the tournament that you're trying to reach has been either removed or moved on this device. Please select the Tournament icon above then 'play' an existing tournament",
		TOURNAMENT_BASE_SCORE: "Base Score",
		TOURNAMENT_FINAL_SCORE: "Final Score",
		TOURNAMENT_PAINTING_SCORE: "Painting Score",
		TOURNAMENT_COMPOSITION_SCORE: "Comp Score",
		TOURNAMENT_SPORTSMANSHIP_SCORE: "Sports Score",
		TOURNAMENT_EDIT_PAINTING_SCORE: "Editing Painting Score",
		TOURNAMENT_EDIT_COMPOSITION_SCORE: "Editing Comp Score",
		TOURNAMENT_EDIT_SPORTSMANSHIP_SCORE: "Editing Sports Score",
		TOURNAMENT_CURRENT_ROUND: "Current Round:",
		TOURNAMENT_NA: "n/a",
		TOURNAMENT_NE: "n/e",
		TOURNAMENT_NOT_AVAILABLE: "not available",
		TOURNAMENT_NOT_ENTERED: "not entered",
		TOURNAMENTS_FINISHED: "Finished",
		TOURNAMENTS_ROUND_NO: "Round #",
		TOURNAMENT_PRE_SETUP: "Pre-Setup",
		TOURNAMENT_FINAL_ROUND: "Final Round",
		TOURNAMENT_START_FIRST_ROUND: "Start First Round",
		TOURNAMENT_START_NEXT_ROUND: "Start Next Round",
		TOURNAMENT_START_LAST_ROUND: "Start Last Round",
		TOURNAMENT_ROUND_MATCHUPS: "Round Matchups",
		TOURNAMENT_TABLE_NUMBER: "Table Number",
		TOURNAMENT_PLAYER_1: "Player 1",
		TOURNAMENT_PLAYER_2: "Player 2",
		TOURNAMENT_START_ROUND: "Start Next Round",
		TOURNAMENT_CLOSE_TOURNAMENT: "Close Tournament",
		TOURNAMENT_COMPLETE_TOURNAMENT: "Complete Tournament",
		TOURNAMENT_GAME_IS_BYE: "Game is a bye",
		TOURNAMENT_START_FINAL_ROUND: "Start Final Round",
		TOURNAMENT_EDITING_GAME_SCORES: "Editing Game Scores",
		TOURNAMENT_EXTRA_POINTS: "Extra Points",

		WELCOME_BUTTON_MANAGE_PLAYERS: "Manage Players",
		WELCOME_BUTTON_MANAGE_PLAYERS_DESC: "Before you can actually set up a tournament, you'll probably need to add some players here.",
		WELCOME_BUTTON_MANAGE_TOURNAMENTS: "Manage Tourmaments",
		WELCOME_BUTTON_MANAGE_TOURNAMENTS_DESC: "In this area you'll find your past tournaments you've tracked on this device."

	}

} );
