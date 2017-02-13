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
	this.id = -1;

	if( typeof(importPlayer) != "undefined" ) {
		if( typeof(importPlayer.email) != "undefined") {
			this.name = {
				first: importPlayer.name.first,
				last: importPlayer.name.last,
				nick: importPlayer.name.nick,
			};
		}

		if( typeof(importPlayer.created) != "undefined" )
			this.created = importPlayer.created;

		if( typeof(importPlayer.updated) != "undefined" )
			this.updated = importPlayer.updated;

		if( typeof(importPlayer.email) != "undefined")
			this.email = importPlayer.email;
		if( typeof(importPlayer.phone1) != "undefined")
			this.phone1 = importPlayer.phone1;

		if( typeof(importPlayer.active) != "undefined")
			this.active = importPlayer.active;
		if( typeof(importPlayer.id) != "undefined")
			this.id = importPlayer.id;
	}

	this.newFunction = function() {

	}
}
