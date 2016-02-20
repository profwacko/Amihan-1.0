var login = require("facebook-chat-api");
var Regex = require("regex");
var jsonfile = require('jsonfile')
var util = require('util')
 
function CardList(filename){

	var list = {};
	var self = this;

	this.getList = function(){
		return list;
	}

	this.load = function(callback){
		jsonfile.readFile(filename, function(err, obj){
			console.log("File Read")
			self.list = obj;
			//console.dir(list);
			if (err){ 
				console.err("Could not read file.")
				return;
			}
			else callback();
		})
	}

	this.printList = function(){
		console.dir(this.list);
		return;
	}

	this.search = function(cardname){
		for (var i in self.list){
			if(self.list[i]["title"].toUpperCase() == cardname.toUpperCase()){
				return self.list[i];
			}
		}
		return 0;
	}
}

var cardlist = new CardList('cardlist.json');

cardlist.load(function(){
	//console.dir(cardlist.list);
	console.log(cardlist.list.length + " cards in database")
	//console.log(cardlist.search("Corroder"))
	amihanBot(cardlist) //FB BOT START
});

function amihanBot(list){
	login({email: "amihan.bot", password: "netrunner"}, function callback (err, api) {
	    if(err) return console.error(err);

		api.listen(function callback(err, message){

			//console.log(message.body);
			var raw_command = message.body.match(/\[\[([)@\w :&.\-'\"]+)\]\]/g)
			if(raw_command){
				for(var x = 0; x < raw_command.length;x++) {
				    //api.sendMessage(x+":"+raw_command[x].slice(2,raw_command[x].length-2),message.threadID);
				var rand = Math.floor(Math.random()*(cardlist.list.length+1))
				var command = raw_command[x].slice(2,raw_command[x].length-2);
				switch(command) {

					//check if valid card

					case "@help":
					api.sendMessage("[['commands']]\n[[@help]] - Asks for help\n[[@flip]] - Flips a Coin\n[[@psi]] - 'Play' a PSI Game\n[['Card Name']] - Returns data on the card",message.threadID);
					break;

					case "@flip":
					var flip = Math.floor((Math.random()*2));
					if(flip) api.sendMessage("Coin Flip: Heads",message.threadID);
					else api.sendMessage("Coin Flip: Tails",message.threadID);
					break;

					case "@psi":
					var psi = Math.floor((Math.random()*3));
					api.sendMessage("PSI bid: " + psi,message.threadID);
					break;

					case "@rand":
					api.sendMessage(cardlist.list[rand],message.threadID);
					break;

					case "@randflavor": //not all cards have flavor
					api.sendMessage(cardlist.list[rand]["flavor"],message.threadID);

					default:
					var card = cardlist.search(command);
					if (card){
						console.log("That's a card")
						api.sendMessage(card,message.threadID);
					}
					else {
						console.log("No cards found")
						api.sendMessage("No cards found",message.threadID);
					}
				}



				}
			}
			else if(message.body == "@amihan"){
				api.sendMessage("Haas-Bioroid -- Amihan 1.0 \n-- System Startup -- ", message.threadID);
			}

		});


	});
}
