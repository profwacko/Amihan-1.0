var login = require("facebook-chat-api");
var Regex = require("regex");
var jsonfile = require('jsonfile');
var util = require('util');
var fs = require('fs');

function CardList(filename){

	var list = {};
	var self = this;

	this.getList = function(){
		return list;
	}

	this.load = function(callback){
		jsonfile.readFile(filename, function(err, obj){
			console.log("File Read");
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
			if(self.list[i].title.toUpperCase() == cardname.toUpperCase()){
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
			console.log("Could not read file")
			return console.error(err);
		}
		amihanBot(credentials,cardlist); //FB BOT START
		fs.unlink('credentials.json');
	})
});

function amihanBot(creds,list){
	login(creds, function callback (err, api) {
	    if(err) return console.error(err);

		api.listen(function callback(err, message){
			if(err) return console.error(err);
			var raw_command = message.body.match(/\[([)@\w :&.\-'\"\$]+)\]/g)
			console.dir(raw_command);
			var help = "Hello. What do you need?" +

			"\nHere is a list of things I can do:"
			+"\n\nChat Command Format"
			+"\n['card name']"
			+"\n ['card name'MODIFIER]"
			+"\n [COMMANDS]"
			+"\nI return netrunnerdb links for 'card name'"
			+"\\nMODIFIER"
			+"\n$f - flavor"
			+"\n$t - text"
			//+"\n$faq - ANCUR link"
			+"\n\nCOMMANDS:"
			+"\nhelp - show list of commands"
			+"\nrand - random card"
			+"\nflavor - random flavor text"
			+"\nflip - flips a coin"
			+"\npsi - 'play' a PSI Game"
			+"\nabout - return github page";

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
							while(!cardlist.list[rand].flavor){
								rand = Math.floor(Math.random()*(cardlist.list.length+1));
							}

							api.sendMessage(cardlist.list[rand].flavor + '\n\n-- '+ cardlist.list[rand].title,message.threadID);
						break;

						case "about":
							api.sendMessage("https://github.com/profwacko/Amihan-1.0",message.threadID);
						break;

						default:
							var cardname = command;
							var modifier = command.slice(command.indexOf("$"),command.length);
							var card;
							
							//console.log(modifier.indexOf("$"));
							if (modifier.indexOf("$") >= 0){
								cardname = command.slice(0,command.indexOf("$"));
							}
							card = cardlist.search(cardname);

							if(card){
							switch(modifier){
								case "$f":
									//get card flavor
									if (card.flavor){
										api.sendMessage(card.flavor + '\n\n-- '+ card.title,message.threadID);
									}
									else{		
										api.sendMessage("No flavor found for: " + card.title,message.threadID);
									}
								break;

								case "$faq":
									api.sendMessage({url:card.ancurLink},message.threadID);
								break;
								
								case "$t":
									//Remove <Strong> etc
									card.text = card.text.replace(/\<\/.*\>/, '');
									card.text = card.text.replace(/\<.*\>/, '');

									api.sendMessage(
										card.title
										+ " - "
										+ card.faction
										+ " - "
										+ card.type 
										+" -- "
										+ card.subtype
										+ "\nCost: "
										+ card.cost
										+ "\n\n" 
										+ card.text
										,message.threadID);
								break;

								default:
									api.sendMessage(card,message.threadID);
								break;	
								}					
							}
							else{
								console.log("No cards found for: " + cardname)
								api.sendMessage("No cards found for: " + cardname,message.threadID);
							}		
					}
				}
			}
		});
	});
}
