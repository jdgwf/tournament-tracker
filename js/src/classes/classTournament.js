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
	this.extraPoints = Array(); // per game extra points

	this.steamControlPoints = Array(); // Steamroller control points
	this.steamArmyPoints = Array(); // Steamroller army points

	this.pointsPainting = Array();
	this.pointsComposition = Array();
	this.pointsSportsmanship = Array();

	this.currentRound = 0;
	this.matches = Array();

	this.noDuplicateMatchups = true;
	this.matchupType = "highest-ranking";

	this.swapLog = "";

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
		//~ if( this.playerObjs.length % 2 == 0 ) {
			//~ while( matchCounter <  this.playerObjs.length  ) {
				//~ var matchObj = {
					//~ table: tableNumber,
					//~ player1: this.playerObjs[ matchCounter ].id,
					//~ player2: this.playerObjs[ matchCounter + 1 ].id
				//~ };

				//~ this.matches[ roundNumber ].push( matchObj );

				//~ tableNumber++;

				//~ matchCounter += 2;
			//~ }
		//~ } else {
			var theBye = -1;
			if( this.playerObjs.length % 2 != 0 ) {
				switch( this.tournamentType ) {
					case "steamroller":
						theBye = (this.playerObjs.length - 1) /2;
						break;
					case "swiss":
						theBye = (this.playerObjs.length - 1) /2;
						break;
					default:
						theBye = (this.playerObjs.length - 1) /2;
						break;
				}
			}

			//~ console.log( "theBye", theBye );

			while( theBye > 0 && this.hasHadBye( this.playerObjs[ theBye ].id)  ) {
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
						player2: -1
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


			//~ console.log( this.matches[ roundNumber ] );

		//~ }

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
		if( typeof(this.scoring[ roundNumber - 1]) == "undefined" )
			this.scoring[ roundNumber - 1] = Array();

		if( typeof(this.scoring[ roundNumber - 1][playerID]) == "undefined" )
			this.scoring[ roundNumber - 1][playerID] = "-1";

		this.scoring[ roundNumber - 1][playerID] = newScore
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
			this.steamArmyPoints[ roundNumber - 1] = Array();

		if( typeof(this.steamArmyPoints[ roundNumber - 1][playerID]) == "undefined" )
			this.steamArmyPoints[ roundNumber - 1][playerID] = -1;

		this.steamArmyPoints[ roundNumber - 1][playerID] = newScore
		return this.steamArmyPoints[ roundNumber - 1][playerID];
	}

	this.setSteamControlPoints = function( roundNumber, playerID, newScore ) {
		if( typeof(this.steamControlPoints[ roundNumber - 1]) == "undefined" )
			this.steamControlPoints[ roundNumber - 1] = Array();

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
		if( player1ID == -1 || player2ID == -1 )
			return false;
		//~ console.log( "-------------------------hasPlayedEachOther this.matches", this.matches);
		if( this.currentRound == 0 )
			return false;
		if( this.noDuplicateMatchups == false )
			return false;
		//~ console.log( "this.currentRound", this.currentRound);
		for( var roundC = 0; roundC < this.currentRound; roundC++) {

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
		for( var roundC = 1; roundC < this.currentRound; roundC++) {

			//~ console.log( "---------------------------------- this.matches[ roundC ]", roundC, this.matches[ roundC ]);
			if( this.matches[ roundC ] ) {
				for( var matchC = 0; matchC < this.matches.length - 1; matchC++ ) {
					//~ console.log( "matchC", matchC );
					//~ console.log("this.matches[ roundC ][ matchC ]", this.matches[ roundC ][ matchC ]);
					//~ console.log( this.matches[ roundC ][ matchC ].player1, this.matches[ roundC ][ matchC ].player2 );
					if(
						(
							this.matches[ roundC ][ matchC ].player1 == player1ID
								&&
							this.matches[ roundC ][ matchC ].player2 == -1
						)
							||
						(
							this.matches[ roundC ][ matchC ].player1 == -1
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
				this.scoring[ roundC ] = Array();
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
		}

		//~ console.log( "this.scoring", this.scoring);
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
					}
					numByes++;
				}
			}

			if( this.byeIsAverage == true && numByes > 0 && this.currentRound > 1) {
				//~ console.log("average bye", numByes, playerTotal);
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

		if( typeof(importTournament.type) != "undefined" )
			this.type = importTournament.type;


		if( typeof(importTournament.steamArmyPoints) != "undefined" )
			this.steamArmyPoints = importTournament.steamArmyPoints;

		if( typeof(importTournament.steamControlPoints) != "undefined" )
			this.steamControlPoints = importTournament.steamControlPoints;
	}

	if( typeof(playerObjects) != "undefined" ) {
		this.createPlayerObjs(playerObjects);
	}

}
