
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

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}

function getTournamentsFromLocalStorage( playersObject ) {
	if( !localStorage["tournaments_list"] ) {
		localStorage["tournaments_list"] = "[]";
		return Array();
	} else {
		//~ return JSON.parse( localStorage["tournaments_list"]  );
		var returnValue = Array();
		var importTournaments = JSON.parse( localStorage["tournaments_list"]  );
		//~ console.log( "getTournamentsFromLocalStorage raw", localStorage["tournaments_list"] );

		//~ console.log( "getTournamentsFromLocalStorage", importTournaments );
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
	for( var tC = 0; tC < tournamentsObject.length; tC++ ) {
		if( tournamentsObject[tC].playerObjs )
			delete tournamentsObject[tC].playerObjs;
		if( tournamentsObject[tC].matchupObjs )
			delete tournamentsObject[tC].matchupObjs;
	}
	//~ console.log( "saveTournamentsToLocalStorage", tournamentsObject );
	localStorage["tournaments_list"] = JSON.stringify( tournamentsObject );
	//~ console.log( "saved", localStorage["tournaments_list"] );
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

function getStyledPlayerName( playerObj ) {
	if( playerObj.name.nick ) {
		return playerObj.name.first + " \"<strong>" + playerObj.name.nick + "</strong>\" " + playerObj.name.last;
	} else {
		return "<strong>" + playerObj.name.first + "</strong> " + playerObj.name.last;
	}
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

function steamPlayerSort(a,b) {
  if (a.pointsBase > b.pointsBase)
    return -1;
  if (a.pointsBase < b.pointsBase)
    return 1;

  if (a.steamControlPoints > b.steamControlPoints)
    return -1;
  if (a.steamControlPoints < b.steamControlPoints)
    return 1;

  if (a.steamArmyPoints > b.steamArmyPoints)
    return -1;
  if (a.steamArmyPoints < b.steamArmyPoints)
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
	this.id = generateUUID();

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


		if( typeof(importPlayer.id) == "string" && importPlayer.id.length > 10 )
			this.id = importPlayer.id;
		else
			this.id = generateUUID();
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

	this.type = "swiss";

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
	this.extraPoints = {}; // per game extra points

	this.steamControlPoints = []; // Steamroller control points
	this.steamArmyPoints = []; // Steamroller army points

	this.pointsPainting = {};
	this.pointsComposition = {}
	this.pointsSportsmanship = {};

	this.currentRound = 0;
	this.matches = Array();

	this.noDuplicateMatchups = true;
	this.matchupType = "highest-ranking";

	this.swapLog = "";

	this.byeType = "middle";

	this.id = generateUUID();


	this.createMatchupObjs = function( playersObjs) {
		this.matchupObjs = Array();



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

	}

	this.attemptToRemoveDuplicateMatches = function( roundNumber, playersObjs ) {
		if( roundNumber == 1 )
			return false;
		if( this.noDuplicateMatchups  == false )
			return false;

		this.swapLog = "<ul>";

		var player1 = null;
		var player2 = null;

		//~ console.log( roundNumber );
		//~ console.log( this.matches);
		//~ console.log( this.matches[ roundNumber ]);

		for( var matchC = 1; matchC < this.matches[ roundNumber ].length; matchC++ ) {

			if( this.hasPlayedEachOther( this.matches[ roundNumber ][ matchC ].player1, this.matches[ roundNumber ][ matchC ].player2 ) ) {
				player1 = getPlayerByID( playersObjs, this.matches[ roundNumber ][ matchC ].player1 );
				player2 = getPlayerByID( playersObjs, this.matches[ roundNumber ][ matchC ].player2 );

				this.swapLog += "<li>" + getStyledPlayerName( player1 ) + " has played " + getStyledPlayerName( player2 ) + "</li>\n";
				for( var matchC2 = matchC + 1; matchC2 < this.matches[ roundNumber ].length; matchC2++ ) {
					if( !this.hasPlayedEachOther( this.matches[ roundNumber ][ matchC2 ].player1, this.matches[ roundNumber ][ matchC ].player1 ) ) {
						swapPlayer = getPlayerByID( playersObjs, this.matches[ roundNumber ][ matchC2 ].player1 );
						origID = this.matches[ roundNumber ][ matchC ].player2;
						this.matches[ roundNumber ][ matchC ].player2 = this.matches[ roundNumber ][ matchC2 ].player1;
						this.matches[ roundNumber ][ matchC2 ].player1 = origID;

						this.swapLog += "<li><strong>SWAPPING</strong> " + getStyledPlayerName( player2 ) + " with " + getStyledPlayerName( swapPlayer ) + "</li>\n";
						break;
					} else if ( !this.hasPlayedEachOther( this.matches[ roundNumber ][ matchC2 ].player2, this.matches[ roundNumber ][ matchC ].player1 ) ) {
						swapPlayer = getPlayerByID( playersObjs, this.matches[ roundNumber ][ matchC2 ].player1 )

						origID = this.matches[ roundNumber ][ matchC ].player1;
						this.matches[ roundNumber ][ matchC ].player1 = this.matches[ roundNumber ][ matchC2 ].player2;
						this.matches[ roundNumber ][ matchC2 ].player2 = origID;

						this.swapLog += "<li><strong>SWAPPING</strong> " + getStyledPlayerName( player1 ) + " with " + getStyledPlayerName( swapPlayer ) + "</li>\n";
						break;
					}

				}


			}
		}

		//~ console.log( this.swapLog );

		if( this.swapLog == "<ul>" )
			this.swapLog = "";
		else
			this.swapLog += "</ul>";
	}

	this.createMatchRound = function( roundNumber, playersObjs ) {

		//~ console.log( "classTournament.createMatchupObjs(" + roundNumber + ") called" );



		this.createPlayerObjs( playersObjs );

		var matchArray = Array();

		this.matches[ roundNumber ] = Array();

		if( roundNumber == 1 ) {
			// randomize first round.
			this.playerObjs = shuffleArray( this.playerObjs );
		} else {
			if( this.type == "steamroller") {
				//~ console.log( "classTournament.createMatchupObjs() - steamroller '" + this.matchupType + "' - sorting by highest-ranking" );

				this.sortPlayerObjsByScores();
			} else {
				if( this.matchupType == "highest-ranking" ) {
					//~ console.log( "classTournament.createMatchupObjs() - sorting by highest-ranking" );
					this.sortPlayerObjsByScores();
				} else if( this.matchupType == "random" ) {
					//~ console.log( "classTournament.createMatchupObjs() - sorting by random" );
					this.playerObjs = shuffleArray( this.playerObjs );
				} else {
					//~ console.log( "classTournament.createMatchupObjs() - unknown sort '" + this.matchupType + "' - sorting by highest-ranking" );
					this.sortPlayerObjsByScores();
				}
			}

		}

		var matchCounter = 0;
		var tableNumber = 1;
		var hasByes = false;

		var theBye = -1;
		if( this.playerObjs.length % 2 != 0 ) {
			switch( this.byeType ) {
				case "first":
					theBye = 0;
					break;
				case "middle":
					theBye = (this.playerObjs.length - 1) /2;
					break;
				case "last":
					theBye = (this.playerObjs.length );
					break;
				case "random":
					theBye = getRandomInt(0, this.playerObjs.length - 1 );
					break;
				default:
					theBye = (this.playerObjs.length - 1) /2;
					break;
			}
		}


		while( theBye > -1 && this.hasHadBye( this.playerObjs[ theBye ].id) && theBye < this.playerObjs.length ) {
			// move down to next player, this one already has had a bye
			theBye++;
		}

		var player1 = 0;
		var player2 = 0;

		var byeObject = null

		for( var matchCounter = 0; matchCounter <  this.playerObjs.length; matchCounter++ ) {
			if( theBye == matchCounter ) {

				byeObject = {
					table: "-",
					player1: this.playerObjs[ matchCounter ].id,
					player2: ""
				};

			} else if( player1 == 0 ) {
				player1 = this.playerObjs[ matchCounter ].id;
			} else if( player2 == 0 ) {
				player2 = this.playerObjs[ matchCounter ].id;

			}

			//~ console.log( matchCounter, player1, player2 );

			if( player1 != 0 && player2 != 0 ) {
				var matchObj = {
					table: tableNumber,
					player1: player1,
					player2: player2
				};
				this.matches[ roundNumber ].push( matchObj );

				player1 = 0;
				player2 = 0;
				tableNumber++;
				//~ console.log("newMatch", matchObj, matchCounter, this.playerObjs.length, this.playerObjs);
			}


			//~ matchCounter++;

		}

		if( byeObject ) {
			this.matches[ roundNumber ].push( byeObject );
		}



		this.attemptToRemoveDuplicateMatches( roundNumber, playersObjs );


		this.createMatchupObjs( playersObjs );





		// Now it's time to check if someone's had a bye before, or if players who have played other players need to be swapped out..
		// TODO!

	}

	this.getScore = function( roundNumber, playerID ) {
		//~ console.log( "getScore = function( roundNumber, playerID )", roundNumber, playerID);
		if( typeof(this.scoring[ roundNumber - 1]) != "undefined" && typeof(this.scoring[ roundNumber - 1][playerID]) != "undefined" ) {
			//~ console.log( "getScore - return " + this.scoring[ roundNumber - 1][playerID]);
			return this.scoring[ roundNumber - 1][playerID] + "";
		}
		//~ console.log( "getScore - return null");
		return "-1";
	}


	this.setScore = function( roundNumber, playerID, newScore ) {
		//~ console.log( "setScore", roundNumber, playerID, newScore );
		//~ console.log( this.scoring[ roundNumber - 1] );
		if( typeof(this.scoring[ roundNumber - 1]) == "undefined" )
			this.scoring[ roundNumber - 1] = {};

		if( typeof(this.scoring[ roundNumber - 1][playerID]) == "undefined" )
			this.scoring[ roundNumber - 1][playerID] = "-1";

		this.scoring[ roundNumber - 1][playerID] = newScore

		//~ console.log( "new score", this.scoring[ roundNumber - 1][playerID] );
		//~ console.log( this.scoring[ roundNumber - 1] );
		//~ console.log( "scoring", this.scoring );
		return this.scoring[ roundNumber - 1][playerID];
	}


	this.getExtraPoints = function( roundNumber, playerID ) {
		//~ console.log("getExtraPoints",  roundNumber, playerID )
		//~ console.log("this.extraPoints", this.extraPoints);
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

	this.getSteamArmyPoints = function( roundNumber, playerID ) {
		//~ console.log("getSteamArmyPoints",  roundNumber, playerID )
		//~ console.log("this.steamArmyPoints", this.steamArmyPoints);
		if(
			typeof(this.steamArmyPoints[ roundNumber - 1]) != "undefined"
				&&
			typeof(this.steamArmyPoints[ roundNumber - 1][playerID]) != "undefined"
				&&
			this.steamArmyPoints[ roundNumber - 1][playerID] > 0
		) {
			//console.log("found", this.extraPoints[ roundNumber - 1][playerID]);
			return this.steamArmyPoints[ roundNumber - 1][playerID];
		}
		return 0;
	}

	this.getSteamControlPoints = function( roundNumber, playerID ) {
		//~ console.log("getSteamControlPoints",  roundNumber, playerID )
		//~ console.log("this.steamControlPoints", this.steamControlPoints);
		if(
			typeof(this.steamControlPoints[ roundNumber - 1]) != "undefined"
				&&
			typeof(this.steamControlPoints[ roundNumber - 1][playerID]) != "undefined"
				&&
			this.steamControlPoints[ roundNumber - 1][playerID] > 0
		) {
			//console.log("found", this.extraPoints[ roundNumber - 1][playerID]);
			return this.steamControlPoints[ roundNumber - 1][playerID];
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


	this.setSteamArmyPoints = function( roundNumber, playerID, newScore ) {
		if( typeof(this.steamArmyPoints[ roundNumber - 1]) == "undefined" )
			this.steamArmyPoints[ roundNumber - 1] = {};

		if( typeof(this.steamArmyPoints[ roundNumber - 1][playerID]) == "undefined" )
			this.steamArmyPoints[ roundNumber - 1][playerID] = -1;

		this.steamArmyPoints[ roundNumber - 1][playerID] = newScore
		return this.steamArmyPoints[ roundNumber - 1][playerID];
	}

	this.setSteamControlPoints = function( roundNumber, playerID, newScore ) {
		if( typeof(this.steamControlPoints[ roundNumber - 1]) == "undefined" )
			this.steamControlPoints[ roundNumber - 1] = {};

		if( typeof(this.steamControlPoints[ roundNumber - 1][playerID]) == "undefined" )
			this.steamControlPoints[ roundNumber - 1][playerID] = -1;

		this.steamControlPoints[ roundNumber - 1][playerID] = newScore
		return this.steamControlPoints[ roundNumber - 1][playerID];
	}

	this.sortPlayerObjsByScores = function() {
		this.calculateResults();
		if( this.type == "swiss" ) {
			this.playerObjs.sort( sortByBaseScore );
		} else if( this.type == "steamroller" ) {
			this.playerObjs.sort( steamPlayerSort );
		}

		var currentRank = 1;
		for( var pC = 0; pC < this.playerObjs.length; pC++) {
			this.playerObjs[ pC ].rank = currentRank;
			currentRank++;
		}

		//~ console.log( "classTournament.sortPlayerObjsByScores() called" );
	}

	this.hasPlayedEachOther = function(player1ID, player2ID) {

		if( player1ID == player2ID )
			return true;
		if( player1ID == "" || player2ID == "" )
			return false;
		//~ console.log( "-------------------------hasPlayedEachOther this.matches", this.matches);
		if( this.currentRound == 0 )
			return false;
		if( this.noDuplicateMatchups == false )
			return false;
		//~ console.log( "this.currentRound", this.currentRound);
		for( var roundC = 0; roundC <= this.currentRound; roundC++) {

			if( this.matches[ roundC ] ) {
				//~ console.log( "this.matches[ roundC ]", roundC, this.matches[ roundC ]);

				for( var matchC = 0; matchC < this.matches[ roundC ].length; matchC++ ) {
					//~ console.log( this.matches[ roundC ][ matchC ].player1, this.matches[ roundC ][ matchC ].player2 );
					if(
						this.matches[ roundC ][ matchC ].player1
							&&
						this.matches[ roundC ][ matchC ].player1
							&&
						(
							this.matches[ roundC ][ matchC ].player1 == player1ID
								&&
							this.matches[ roundC ][ matchC ].player2 == player2ID
						)
							||
						(
							this.matches[ roundC ][ matchC ].player1 == player2ID
								&&
							this.matches[ roundC ][ matchC ].player2 == player1ID
						)
					) {
						return true;
					}
				}
			}
		}

		return false;
	}


	this.hasHadBye = function( player1ID ) {
		//~ console.log( "this.matches", this.matches);
		if( this.currentRound == 0 )
			return false;

		//~ console.log( "this.currentRound", this.currentRound);
		//~ console.log( "player1ID", player1ID );
		for( var roundC = 1; roundC <= this.currentRound; roundC++) {

			//~ console.log( "---------------------------------- this.matches[ roundC ]", roundC, this.matches[ roundC ]);
			if( this.matches[ roundC ] ) {
				for( var matchC = 0; matchC < this.matches.length; matchC++ ) {
					//~ console.log( "matchC", matchC );
					//~ console.log("this.matches[ roundC ][ matchC ]", this.matches[ roundC ][ matchC ]);
					//~ console.log( this.matches[ roundC ][ matchC ].player1, this.matches[ roundC ][ matchC ].player2 );
					if(
						(
							this.matches[ roundC ][ matchC ]
								&&
							this.matches[ roundC ][ matchC ].player1 == player1ID
								&&
							this.matches[ roundC ][ matchC ].player2 == ""
						)
							||
						(
							this.matches[ roundC ][ matchC ]
								&&
							this.matches[ roundC ][ matchC ].player1 == ""
								&&
							this.matches[ roundC ][ matchC ].player2 == player1ID
						)
					) {
						return true;
					}
				}
			}
		}

		return false;
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
			//~ console.log( "roundC", roundC);
			if( typeof( this.scoring[ roundC ] ) == "undefined")
				this.scoring[ roundC ] = {};
			for( var playerC = 0; playerC < this.playerObjs.length; playerC++ ) {
				if(
					typeof( this.scoring[ roundC ][this.playerObjs[playerC].id] ) == "undefined"
						||
					this.scoring[ roundC ][this.playerObjs[playerC].id] == "-1"
						||
					this.scoring[ roundC ][this.playerObjs[playerC].id] == null
				) {
					if( this.isByeRound( roundC + 1, this.playerObjs[playerC].id) )
						this.scoring[ roundC ][this.playerObjs[playerC].id] = "bye";
					else
						this.scoring[ roundC ][this.playerObjs[playerC].id] = "-1";
				}

				if( typeof( this.pointsPainting[this.playerObjs[playerC].id] ) == "undefined")
					this.pointsPainting[this.playerObjs[playerC].id] = -1;

				if( typeof( this.pointsComposition[this.playerObjs[playerC].id] ) == "undefined")
					this.pointsComposition[this.playerObjs[playerC].id] = -1;

				if( typeof( this.pointsSportsmanship[this.playerObjs[playerC].id] ) == "undefined")
					this.pointsSportsmanship[this.playerObjs[playerC].id] = -1;
			}
		}
		this.sortPlayerObjsByScores();

		if( this.type == "steamroller" ) {
			// TODO set # of rounds per player count
			if( this.playerObjs.length > 64 ) {
				this.numberOfRounds = 7;
			} else if( this.playerObjs.length > 32 ) {
				this.numberOfRounds = 6;
			} else if( this.playerObjs.length > 16 ) {
				this.numberOfRounds = 5;
			} else if( this.playerObjs.length > 8 ) {
				this.numberOfRounds = 4;
			} else  {
				this.numberOfRounds = 3;
			}

			this.pointsForWin = 1;
			this.pointsForDraw = 0;
			this.pointsForLoss = 0;
			this.pointsForBye = 1;
			this.byeIsAverage = false;
			this.scoringPaint = false;
			this.scoringComp = false;
			this.scoringSportsmanship = false;
			this.byeType = "middle";
		}

		//~ console.log( "this.scoring", this.scoring);
	}

	this.isByeRound = function( roundNumber, playerID ) {
		if( this.matches[ roundNumber ] ) {
			for( var matchC = 0; matchC < this.matches[ roundNumber ].length; matchC++ ) {
				if( this.matches[ roundNumber ][ matchC ].player1 == playerID && this.matches[ roundNumber ][ matchC ].player2 == "" ) {
					return true;
				}
			}
		}

		return false;
	}

	this.getMatch = function( roundNumber, playerID ) {
		//~ console.log( "getMatch", roundNumber, playerID, this.matches[ roundNumber ] );
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

	this.swapPlayers = function( player1ID, player2ID, roundNumber, playersObjs ) {

		for( var tableC = 0; tableC < this.matches[ roundNumber].length; tableC++ ) {
			if( this.matches[ roundNumber][tableC].player1 == player1ID ) {
				this.matches[ roundNumber][tableC].player1 = player2ID;
			} else if( this.matches[ roundNumber][tableC].player1 == player2ID ) {
				this.matches[ roundNumber][tableC].player1 = player1ID;
			}

			if( this.matches[ roundNumber][tableC].player2 == player1ID ) {

				this.matches[ roundNumber][tableC].player2 = player2ID;

			} else  if( this.matches[ roundNumber][tableC].player2 == player2ID ) {
				this.matches[ roundNumber][tableC].player2 = player1ID;
			}



		}

		this.createMatchupObjs( playersObjs );
		//this.matchupObjs = Array();
	}

	this.calculateResults = function() {
		this.totals = Array();

		this.byeSteamControlPoints = Array();
		this.byeSteamArmyPoints = Array();
		this.byePoints = Array();

		for( var playerC = 0; playerC < this.playerObjs.length; playerC++ ) {
			numByes = 0;
			playerTotal = 0;

			this.playerObjs[playerC].steamControlPoints = 0;
			this.playerObjs[playerC].steamArmyPoints = 0;

			for( var roundC = 0; roundC < this.scoring.length; roundC++ ) {
				if(
					this.scoring[ roundC ][ this.playerObjs[playerC].id ] != "bye"
						&&
					this.scoring[ roundC ][ this.playerObjs[playerC].id ] != "-1"
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

				if(
					this.steamControlPoints[ roundC ]
						&&
					this.steamControlPoints[ roundC ][ this.playerObjs[playerC].id ]
						&&
					this.steamControlPoints[ roundC ][ this.playerObjs[playerC].id ] > 0
				) {
					this.playerObjs[playerC].steamControlPoints += this.steamControlPoints[ roundC ][ this.playerObjs[playerC].id ];
				}

				if(
					this.steamArmyPoints[ roundC ]
						&&
					this.steamArmyPoints[ roundC ][ this.playerObjs[playerC].id ]
						&&
					this.steamArmyPoints[ roundC ][ this.playerObjs[playerC].id ] > 0
				) {
					this.playerObjs[playerC].steamArmyPoints += this.steamArmyPoints[ roundC ][ this.playerObjs[playerC].id ];
				}

				if( this.scoring[ roundC ][ this.playerObjs[playerC].id ] == "bye") {
					if(
						this.byeIsAverage == false
							||
						this.currentRound < 2
					) {
						//~ console.log( "pointsForBye", this.currentRound );
						playerTotal += this.pointsForBye;
						this.byePoints[ this.playerObjs[playerC].id ] = this.pointsForBye;
					}
					numByes++;
				}
			}

			if( this.byeIsAverage == true && numByes > 0 && this.currentRound > 1) {
				//~ console.log("average bye", numByes, playerTotal);
				if( this.currentRound - numByes  > 0 ) {
					averageRound = Math.round(playerTotal / ( this.currentRound - numByes ));
					playerTotal += averageRound * numByes;
					this.byePoints[ this.playerObjs[playerC].id ] = averageRound;
				} else {
					// two byes right at the start (WTF, really tourney admin?). Division by Zeros are BAD!
					// We'll just put the default value for byes in until something comes up.
					playerTotal += this.pointsForBye * numByes;
					this.byePoints[ this.playerObjs[playerC].id ] = 0;
				}

			}

			this.totals[ this.playerObjs[ playerC ].id ] = playerTotal;

			this.playerObjs[ playerC ].pointsBase = playerTotal;

			//~ console.log( "totals", this.totals );
			//~ console.log( "playerobjs", this.playerObjs );

			this.playerObjs[ playerC ].pointsFinal = this.playerObjs[ playerC ].pointsBase;

			if( this.pointsPainting[ this.playerObjs[ playerC ].id] > 0 )
				this.playerObjs[ playerC ].pointsFinal += this.pointsPainting[ this.playerObjs[ playerC ].id];

			if( this.pointsComposition[ this.playerObjs[ playerC ].id] > 0 )
				this.playerObjs[ playerC ].pointsFinal +=  this.pointsComposition[ this.playerObjs[ playerC ].id];


			if( this.pointsSportsmanship[ this.playerObjs[ playerC ].id] > 0 )
				this.playerObjs[ playerC ].pointsFinal += this.pointsSportsmanship[ this.playerObjs[ playerC ].id];

			if( this.type == "steamroller" ) {
				if( playerTotal > 0 && this.hasHadBye( this.playerObjs[ playerC ].id ) ) {
					//~ console.log("---------------------------------------------");
					//~ console.log( "this.steamControlPoints", this.steamControlPoints );
					//~ console.log( "this.steamArmyPoints", this.steamArmyPoints );
					var divByZero = 0;
					var tempSubTotal = 0;

					for( var iC = 0; iC < this.steamArmyPoints.length; iC++ ) {
						if(
							this.steamControlPoints[ iC ]
								&&
							typeof( this.steamControlPoints[ iC ][ this.playerObjs[ playerC ].id ]) != "undefined"
								&&
							this.steamControlPoints[ iC ][ this.playerObjs[ playerC ].id ] !== null
						) {
							tempSubTotal +=  this.steamControlPoints[ iC ][ this.playerObjs[ playerC ].id ];
							divByZero++;
						}
					}
					//~ console.log( "control divByZero1", this.playerObjs[playerC].name.first, this.playerObjs[playerC].id, divByZero);
					//~ console.log( "control tempSubTotal", this.playerObjs[playerC].name.first, this.playerObjs[playerC].id, tempSubTotal);

					if( divByZero > 0 ) {
						this.byeSteamControlPoints[ this.playerObjs[playerC].id ] = Math.round( tempSubTotal / divByZero );
						this.playerObjs[ playerC ].steamControlPoints += this.byeSteamControlPoints[ this.playerObjs[playerC].id ];
					} else {
						this.byeSteamControlPoints[ this.playerObjs[playerC].id ] = 0;
					}



					var divByZero = 0;
					var tempSubTotal = 0;
					for( var iC = 0; iC < this.steamArmyPoints.length; iC++ ) {

						if(
							this.steamArmyPoints[ iC ]
								&&
							typeof( this.steamArmyPoints[ iC ][ this.playerObjs[ playerC ].id ]) != "undefined"
								&&
							this.steamArmyPoints[ iC ][ this.playerObjs[ playerC ].id ] !== null
						) {
							tempSubTotal +=  this.steamArmyPoints[ iC ][ this.playerObjs[ playerC ].id ];
							divByZero++;
						}
					}
					//~ console.log( "army divByZero2", this.playerObjs[playerC].name.first,  this.playerObjs[playerC].id, divByZero);
					//~ console.log( "army tempSubTotal", this.playerObjs[playerC].name.first, this.playerObjs[playerC].id, tempSubTotal);

					if( divByZero > 0 ) {
						this.byeSteamArmyPoints[ this.playerObjs[playerC].id ] = Math.round( tempSubTotal / divByZero );
						this.playerObjs[ playerC ].steamArmyPoints += this.byeSteamArmyPoints[ this.playerObjs[playerC].id ];
					} else {
						this.byeSteamArmyPoints[ this.playerObjs[playerC].id ] = 0;
					}

					//this.byeSteamControlPoints[ this.playerObjs[playerC].id ] = 0;
					//this.byeSteamArmyPoints[ this.playerObjs[playerC].id ] = 0;


				} else {
					this.byeSteamControlPoints[ this.playerObjs[playerC].id ] = 0;
					this.byeSteamArmyPoints[ this.playerObjs[playerC].id ] = 0;
				}
			}
		}
	}

	if( typeof(importTournament) != "undefined" ) {
		//~ console.log( "import", importTournament );
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

		if( typeof(importTournament.id) != "undefined" )
			this.id = generateUUID();

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

		if( typeof(importTournament.type) != "undefined" )
			this.type = importTournament.type;

		if( typeof(importTournament.byeType) != "undefined" )
			this.byeType = importTournament.byeType;

		if( typeof(importTournament.steamArmyPoints) != "undefined" )
			this.steamArmyPoints = importTournament.steamArmyPoints;

		if( typeof(importTournament.steamControlPoints) != "undefined" )
			this.steamControlPoints = importTournament.steamControlPoints;
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

		APP_TITLE: 'Tournament Tracker',

		INDEX_WELCOME: 'Welcome',
		INDEX_H3_CORE: 'Tournament Tracker',

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
		GENERAL_TOTAL: "Total",
		GENERAL_FILTER_SEARCH_PLAYERS: "Filter/Search Players",

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
		GENERAL_RESET: "Reset",

		GENERAL_NOT_ENTERED: "Not Entered",
		GENERAL_WIN: "Win",
		GENERAL_DRAW: "Draw",
		GENERAL_LOSS: "Loss",

		GENERAL_ROTATE_TO_LANDSCAPE: "Please rotate your device to landscape for optimal viewing",

		BUTTON_LANG_EN: 'English',
		BUTTON_LANG_DE: 'German',
		BUTTON_LANG_BR: 'Brazilian',

		GENERAL_BYE_FIRST: "First",
		GENERAL_BYE_MIDDLE: "Middle",
		GENERAL_BYE_RANDOM: "Random",
		GENERAL_BYE_LAST: "Last",

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

		TOURNAMENTS_TYPE: "Tournament Type",
		TOURNAMENTS_DOWNLOAD_INSTRUCTIONS: "Click on the button below to download the current Tournaments data object",
		TOURNAMENTS_NAME: "Tournament Name",
		TOURNAMENTS_NUM_PLAYERS: "# Players",
		TOURNAMENTS_EDIT_PLAYERS: "Edit Players",
		TOURNAMENTS_BASE_SCORING: "Base Scoring",
		TOURNAMENTS_EXTRA_SCORING: "Extra Scoring",

		TOURNAMENTS_BYE_OPTIONS: "Bye Options",

		TOURNAMENT_CONTROL_POINTS: "Control Points",
		TOURNAMENT_ARMY_POINTS: "Army Points",

		TOURNAMENTS_MATCHUP_SETTINGS: "Matchup Settings",
		TOURNAMENTS_MATCHUP_ORDERING: "Matchup Ordering",
		TOURNAMENTS_MATCHUP_NO_DUPLICATES: "No duplicate matchups, if possible",

		TOURNAMENTS_MATCHUP_HIGHEST_RANKING: "Highest Ranking",
		TOURNAMENTS_MATCHUP_RANDOM: "Random",
		TOURNAMENTS_WHO_GETS_THE_BYE: "Who gets the bye?",

		TOURNAMENTS_SWISS: "Swiss",
		TOURNAMENTS_STEAMROLLER: "Steamroller",
		TOURNAMENTS_STEAMROLLER_NO_OPTIONS: "Privateer Press's Steamroller 2016 is quite illicit on how many rounds, how to score, etc. Thankfully because of this, there are no options. Just press the Add button below to add players.",

		TOURNAMENTS_PLAYERS: "Players",
		TOURNAMENT_SWAP_LOG: "Automatic Player Swap Log",
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
		TOURNAMENT_SWAP: "Swap",
		TOURNAMENT_SWAPPING: "Swapping",
		TOURNAMENT_SWAP_WITH: "Swap With",
		TOURNAMENT_CHOOSE_PLAYER_TO_SWAP: "Choose a player to swap with.",
		TOURNAMENT_CANCEL_SWAP: "Cancel Swap Mode",


		WELCOME_BUTTON_MANAGE_PLAYERS: "Manage Players",
		WELCOME_BUTTON_MANAGE_PLAYERS_DESC: "Before you can actually set up a tournament, you'll probably need to add some players here.",
		WELCOME_BUTTON_MANAGE_TOURNAMENTS: "Manage Tournaments",
		WELCOME_BUTTON_MANAGE_TOURNAMENTS_DESC: "In this area you'll find your past tournaments you've tracked on this device."

	}

} );
