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
