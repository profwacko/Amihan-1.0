var login = require("facebook-chat-api");
var Regex = require("regex");
var jsonfile = require('jsonfile')
var util = require('util')
var fs = require('fs')

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
	var credentials;

	jsonfile.readFile('credentials.json', function(err, obj){
		console.log("Credentials Read")
		credentials = obj;
		if (err){ 
			console.error("Could not read file.")
		}
		amihanBot(credentials,cardlist); //FB BOT START
		fs.unlink('credentials.json')
	})
});

function amihanBot(creds,list){
	login(creds, function callback (err, api) {
		delete creds;
	    if(err) return console.error(err);

		api.listen(function callback(err, message){
			if(err) return console.error(err);
			var raw_command = message.body.match(/\[([)@\w :&.\-'\"\$]+)\]/g)
			console.dir(raw_command);
			var help = "Hello. What do you need?" +

			"\nHere is a list of things I can do:"
			+"\n\nChat Command Format"
			+"\n['card name'] or [COMMANDS]"
			+"\n I return netrunnerdb links for 'card name'"
			+"\n\nCOMMANDS:"
			+"\nhelp - show list of commands"
			+"\nrand - random card"
			+"\nflavor - random flavor text"
			+"\nflip - flips a coin"
			+"\npsi - 'play' a PSI Game";

			if(raw_command){
				for(var x = 0; x < raw_command.length;x++) {
					var rand = Math.floor(Math.random()*(cardlist.list.length+1))
					var command = raw_command[x].slice(1,raw_command[x].length-1);
					switch(command.toLowerCase()) {

						case "help":
						api.sendMessage(help,message.threadID);
						break;

						case "hello":
						api.sendMessage("Hello" + message.senderName,message.threadID)
						break;

						case "flip":
						var flip = Math.floor((Math.random()*2));
						if(flip) api.sendMessage("Coin Flip: Heads",message.threadID);
						else api.sendMessage("Coin Flip: Tails",message.threadID);
						break;

						case "psi":
						var psi = Math.floor((Math.random()*3));
						api.sendMessage("Psi bid: " + psi,message.threadID);
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

						case "about":
							api.sendMessage("",message.threadID);
						break;

						default:
						switch(command.slice(command.length-2,command.length) ){
							case "$f":
								//get card flavor
								var card = cardlist.search(command.slice(0,command.length-2));
								if (card){
									if (card["flavor"]){
										api.sendMessage(card["flavor"] + '\n\n-- '+ card["title"],message.threadID);
									}
									else{		
										api.sendMessage("No flavor found for: " + card["title"],message.threadID);
									}
								}
								else {
									console.log("No cards found for: " + command.slice(0,command.length-2))
									api.sendMessage("No cards found for: " + command.slice(0,command.length-2),message.threadID);
								}
							break;
							
							case "$t":
								var card = cardlist.search(command.slice(0,command.length-2));
								if (card){
									api.sendMessage(card["title"] + "\n" + card["text"] ,message.threadID);
								}
								else{
									console.log("No cards found for: " + command.slice(0,command.length-2))
									api.sendMessage("No cards found for: " + command.slice(0,command.length-2),message.threadID);
								}
							
							default:
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
			}

			else if(message.body == "amihan_init"){
				api.sendMessage("Haas-Bioroid -- Amihan 1.0 \n-- System Startup -- ", message.threadID);
			}
		});
	});
}
