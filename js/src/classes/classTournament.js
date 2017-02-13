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
