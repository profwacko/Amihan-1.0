var login = require("facebook-chat-api");
var Regex = require("regex");
var jsonfile = require('jsonfile');
var util = require('util');
var fs = require('fs');
var fuzzy = require('fuzzy');
var options = {
  extract: function(el){ return el.title; }
};

//move to new file
var cardtype = {
  "Corp": {
    "Identity": {
      "Decksize": "minimumdecksize",
      "Influence": "influencelimit"
    },
    "Agenda": {
      "Adv": "advancementcost",
      "Score": "agendapoints"
    },
    "ICE": {
      "STR" : "strength",
      "Rez": "cost",
      "Influence": "factioncost"
    },
    "Operation": {
      "Cost": "cost",
      "Influence": "factioncost"
    },
    "Asset": {
      "Rez": "cost",
      "Trash": "trash",
      "Influence": "factioncost"
    },
    "Upgrade": {
      "Rez": "cost",
      "Trash": "trash",
      "Influence": "factioncost"
    }
  },
  "Runner": {
    "Identity": {
      "Link": "link",
      "Decksize": "minimumdecksize",
      "Influence": "influencelimit"
    },
    "Event": {
      "Cost": "cost",
      "Influence": "factioncost"
    },
    "Hardware": {
      "Install": "cost",
      "Influence": "factioncost"
    },
    "Resource": {
      "Install": "cost",
      "Influence": "factioncost"
    },
    "Program": {
      "Install": "cost",
      "Memory": "memoryunits",
      "Strength": "strength",
      "Influence": "factioncost"
    }
  }
}

function CardList(filename){

  var list = {};
  var self = this;

  this.getList = function(){
    return self.list;
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

    //maybe also check for abbreviations?

    for (var i in self.list){
      if(self.list[i].title.toUpperCase() == cardname.toUpperCase()){
        return self.list[i];
      }
    }
    return 0;
  }

  this.fuzzysearch = function(cardname){
    var results = fuzzy.filter(cardname, self.list,options);
    var matches = results.map(function(el) {
      //console.log(el);
      return el;
    });
//    previous.score = 0;
//    for (var current in matches){
//      result = current;
//      if current.score > previous.score{
//        result = current;
//      }
//      previous = current;
//    }
//  console.log(matches);
  if (matches.length){
    //console.log(matches[0].original.title);
    return matches[0].original;
  }
  else return 0;
    //do some math to show shitty search
  }
}



//console.log(cardtype["Corp"]);
var cardlist = new CardList('cardlist.json');

cardlist.load(function(){
  console.log(cardlist.list.length + " cards in database");
  var credentials;

  jsonfile.readFile('credentials.json', function(err, obj){
    credentials = obj;
    if (err){
      return console.error(err);
    }
    else{
      console.log("Credentials Read")
      amihanBot(credentials,cardlist); //FB BOT START
      fs.unlink('credentials.json');
    }
  })
});

function getText(card){
  var template = cardtype[card.side][card.type];
  if (card.uniqueness){
    title = card.title + " •";
  }
  else{
    title = card.title;
  }

  card_text = title + "\n" + card.type +": " + card.subtype + "\n";
  for (var param in template){
    card_text = card_text + param + " " + card[template[param]] + " ";
  }

  card_text = card_text + "\n\n" + card.text + "\n\n" + card.faction
  return card_text;
}


function amihanBot(creds,list){
  login(creds, function callback (err, api) {
    if(err) return console.error(err);

    api.listen(function callback(err, message){
      if(err) {
        console.error(err);
        jsonfile.writeFile('credentials.json', creds, function (err) {
          console.error(err);
          throw new Error(err);
        })
      }
      api.sendMessage(message,message.threadID);
      var raw_command = message.body.match(/\[[^\[\]]*\]/g)
      var help = "Hello. What do you need?"
      +"\nHere is a list of things I can do:"
      +"\n\nChat Command Format"
      +"\n['card name']"
      +"\n['card name'MODIFIER]"
      +"\n[COMMANDS]"
      +"\nI return card text for 'card name'"
      +"\nMODIFIER"
      +"\n$f - flavor"
      +"\n$ndb - netrunnerdb link"
      +"\n$faq - ANCUR link"
      +"\n\nCOMMANDS:"
      +"\nhelp - show list of commands"
      +"\nrand - random card"
      +"\nflavor - random flavor text"
      +"\nflip - flips a coin"
      +"\npsi - 'play' a PSI Game"
      +"\nabout - get info page link";

      cardPrint = function (card,modifier){
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

          case "$ndb":
          var msg = {"body": "","url": card.url};
          api.sendMessage(msg,message.threadID);
          break;

          default:
          card.text = card.text.replace(/\<\/.*\>/, '');
          card.text = card.text.replace(/\<.*\>/, '');

          msg = getText(card);
          msg = msg.replace(/\[Subroutine\]/g, '->');
          api.sendMessage(msg,message.threadID);
          break;
        }
        return;
      }

      if(raw_command){
        console.dir(raw_command);
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
            api.sendMessage("Amihan 1.0 by profwacko on github: https://github.com/profwacko/Amihan-1.0",message.threadID);
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
            //If search failed, fuzzy search;

            if(card){
              cardPrint(card,modifier);
            }
            else{
              //do fuzzy search Here
              if (cardname.length > 4){
                card = cardlist.fuzzysearch(cardname);
              }
              else {
                card = 0;
              }
              if(card){
                api.sendMessage("Did you mean: " + card.title,message.threadID);
                cardPrint(card,modifier);
              }
              else{
                console.log("No cards found for: " + cardname)
                api.sendMessage("No cards found for: " + cardname,message.threadID);
              }
            }
          }
        }
      }
    });
  });
}
