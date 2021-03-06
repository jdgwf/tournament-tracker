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
