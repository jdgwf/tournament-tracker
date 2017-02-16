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
