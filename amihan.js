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
				console.error("Could not read file.")
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
	console.log(cardlist.list.length + " cards in database");
	amihanBot(username,password,cardlist); //FB BOT START
});

function amihanBot(user,pass,list){
	login({email: user, password: pass}, function callback (err, api) {
	    if(err) return console.error(err);

		api.listen(function callback(err, message){

			var raw_command = message.body.match(/\[\[([)@\w :&.\-'\"]+)\]\]/g)
			console.dir(raw_command);
			var help = "FORMAT - [['commands']]"
			+"\n\nCOMMANDS:"
			+"\nhelp - Asks for help"
			+"\n'Card Name' - Returns netrunnerdb link on the card"
			+"\n rand - load a random card"
			+"\n flavor - loads random flavor text"
			+"\nflip - Flips a Coin"
			+"\npsi - 'Play' a PSI Game";

			if(raw_command){
				for(var x = 0; x < raw_command.length;x++) {
					var rand = Math.floor(Math.random()*(cardlist.list.length+1))
					var command = raw_command[x].slice(2,raw_command[x].length-2);
					switch(command) {

						case "help":
						api.sendMessage(help,message.threadID);
						break;

						case "hello":
						break;

						case "flip":
						var flip = Math.floor((Math.random()*2));
						if(flip) api.sendMessage("Coin Flip: Heads",message.threadID);
						else api.sendMessage("Coin Flip: Tails",message.threadID);
						break;

						case "psi":
						var psi = Math.floor((Math.random()*3));
						api.sendMessage("PSI bid: " + psi,message.threadID);
						break;

						case "rand":
						api.sendMessage(cardlist.list[rand],message.threadID);
						break;

						case "flavor": 

						while(!cardlist.list[rand]["flavor"]){
							rand = Math.floor(Math.random()*(cardlist.list.length+1));
						}

						api.sendMessage(cardlist.list[rand]["flavor"] + '\n\n-- '+ cardlist.list[rand]["title"],message.threadID);
						break;

						default:
						//handle multiple in a string
						var card = cardlist.search(command);

						if (card){
							api.sendMessage(card,message.threadID);
						}
						else {
							console.log("No cards found for: " + command)
							api.sendMessage("No cards found for: " + command,message.threadID);
						}
					}
				}
			}

			else if(message.body == "amihan_init"){
				api.sendMessage("Haas-Bioroid -- XX 1.0 \n-- System Startup -- ", message.threadID);
			}
		});
	});
}
