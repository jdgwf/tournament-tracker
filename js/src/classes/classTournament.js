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

	this.scoring =
	this.extraPoints = Array();

	this.pointsPainting = Array();
	this.pointsComposition = Array();
	this.pointsSportsmanship = Array();

	this.currentRound = 0;
	this.matches = Array();

	this.createPlayerObjs = function( playersObjs) {
		this.playerObjs = Array();
		for( var playerC = 0; playerC < this.players.length; playerC++ ) {
			var player = getPlayerByID( playersObjs, this.players[ playerC] );
			if( player )
				this.playerObjs.push( player );
		}

		for( var roundC = 0; roundC < this.numberOfRounds; roundC++ ) {
			if( typeof( this.scoring[ roundC ] ) == "undefined")
				this.scoring[ roundC ] = Array();
			for( var playerC = 0; playerC < this.playerObjs.length; playerC++ ) {
				if( typeof( this.scoring[ roundC ][this.playerObjs[playerC].id] ) == "undefined")
					this.scoring[ roundC ][this.playerObjs[playerC].id] = -1;

				if( typeof( this.pointsPainting[this.playerObjs[playerC].id] ) == "undefined")
					this.pointsPainting[this.playerObjs[playerC].id] = -1;

				if( typeof( this.pointsComposition[this.playerObjs[playerC].id] ) == "undefined")
					this.pointsComposition[this.playerObjs[playerC].id] = -1;

				if( typeof( this.pointsSportsmanship[this.playerObjs[playerC].id] ) == "undefined")
					this.pointsSportsmanship[this.playerObjs[playerC].id] = -1;
			}
		}
	}

	this.calculateResults = function() {
		this.totals = Array();
		for( var playerC = 0; playerC < this.playerObjs.length; playerC++ ) {
			numByes = 0;
			playerTotal = 0;
			for( var roundC = 0; roundC < this.scoring; roundC++ ) {
				if( this.scoring[ roundC ][ this.playerObjs[playerC].id ] != "bye" && this.scoring[ roundC ][ this.playerObjs[playerC].id ] > -1) {
					playerTotal += this.scoring[ roundC ][ this.playerObjs[playerC].id ];
				}
				if( this.scoring[ roundC ][ this.playerObjs[playerC].id ] != "bye") {
					if( !this.byeIsAverage ) {
						playerTotal += this.pointsForBye;
					}
					numByes++;
				}
			}
			if( this.byeIsAverage && numByes > 0 && this.currentRound > 1) {
				averageRound = Math.round(playerTotal / ( this.numberOfRounds - numByes ));
				playerTotal += averageRound * numByes;
			}
			this.totals[ this.playerObjs[ playerC].id ] = playerTotal;

			this.playerObjs[ playerC].pointsBase = playerTotal;


			this.playerObjs[ playerC].pointsFinal = this.playerObjs[ playerC].pointsBase;

			if( this.pointsPainting[ this.playerObjs[ playerC].id] > 0 )
				this.playerObjs[ playerC].pointsFinal += this.pointsPainting[ this.playerObjs[ playerC].id];

			if( this.pointsComposition[ this.playerObjs[ playerC].id] > 0 )
				this.playerObjs[ playerC].pointsFinal +=  this.pointsComposition[ this.playerObjs[ playerC].id];


			if( this.pointsSportsmanship[ this.playerObjs[ playerC].id] > 0 )
				this.playerObjs[ playerC].pointsFinal += this.pointsSportsmanship[ this.playerObjs[ playerC].id];

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

	}

	if( typeof(playerObjects) != "undefined" ) {
		this.createPlayerObjs(playerObjects);
	}

}
