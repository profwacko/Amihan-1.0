var login = require("facebook-chat-api");
var Regex = require("regex");
var jsonfile = require('jsonfile');
var util = require('util');
var fs = require('fs');
var fuzzy = require('fuzzy');
var options = {
  extract: function(el){ return el.title; }
};

String.prototype.caps = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

var abbrev = {
  'proco': 'Professional Contacts',
  'procon': 'Professional Contacts',
  'jhow': 'Jackson Howard',
  'smc': 'Self-modifying Code',
  'kit': 'Rielle "Kit" Peddler',
  'abt': 'Accelerated Beta Test',
  'mopus': 'Magnum Opus',
  'mo': 'Magnum Opus',
  'charizard': 'Scheherazade',
  ':charizard:': 'Scheherazade',
  'siphon': 'Account Siphon',
  'deja': 'Déjà Vu',
  'Deja Vu': 'Déjà Vu',
  'gov takeover': 'Government Takeover',
  'gt': 'Government Takeover',
  'baby': 'Symmetrical Visage',
  'pancakes': 'Adjusted Chronotype',
  'dlr': 'Data Leak Reversal',
  'bn': 'Breaking News',
  'rp': 'Replicating Perfection',
  'neh': 'Near-Earth Hub',
  'pe': 'Perfecting Evolution',
  'white tree': 'Replicating Perfection',
  'black tree': 'Perfecting Evolution',
  'ci': 'Cerebral Imaging',
  'ppvp': 'Prepaid VoicePAD',
  'pvpp': 'Prepaid VoicePAD',
  'sfss': 'Shipment from SanSan',
  'rdi': 'R&D Interface',
  'hqi': 'HQ Interface',
  'gfi': 'Global Food Initiative',
  'dbs': 'Daily Business Show',
  'nre': 'Net-Ready Eyes',
  'elp': 'Enhanced Login Protocol',
  'levy': 'Levy AR Lab Access',
  'oai': 'Oversight AI',
  'fao': 'Forged Activation Orders',
  'psf': 'Private Security Force',
  'david': 'D4v1d',
  'ihw': 'I\'ve Had Worse',
  'qt': 'Quality Time',
  'nisei': 'Nisei MK II',
  'dhpp': 'Director Haas\' Pet Project',
  'tfin': 'The Future is Now',
  'ash': 'Ash 2X3ZB9CY',
  'cvs': 'Cyberdex Virus Suite',
  'otg': 'Off the Grid',
  'ts': 'Team Sponsorship',
  'glc': 'Green Level Clearance',
  'blc': 'Blue Level Clearance',
  'pp': 'Product Placement',
  'asi': 'All-Seeing I',
  'nas': 'New Angeles Sol',
  'bbg': 'Breaker Bay Grid',
  'drt': 'Dedicated Response Team',
  'sot': 'Same Old Thing',
  'stamherk': 'Stimhack',
  'stam herk': 'Stimhack',
  'tempo': 'Professional Contacts',
  'ff': 'Feedback Filter',
  'fis': 'Fisk Investment Seminar',
  'fisk': 'Laramy Fisk',
  'lf': 'Lucky Find',
  'prof': 'The Professor',
  'tol': 'Trick of Light',
  'manup': 'Mandatory Upgrades',
  'ij': 'Inside Job',
  'andy': 'Andromeda',
  'qpm': 'Quantum Predictive Model',
  'smashy dino': 'Shattered Remains',
  'smashy dinosaur': 'Shattered Remains',
  'mhc': 'Mental Health Clinic',
  'etf': 'Engineering the Future',
  'st': 'Stronger Together',
  'babw': 'Building a Better World',
  'bwbi': 'Because We Built It',
  'mn': 'Making News',
  'ct': 'Chaos Theory',
  'oycr': 'An Offer You Can\'t Refuse',
  'aoycr': 'An Offer You Can\'t Refuse',
  'hok': 'House of Knives',
  'cc': 'Clone Chip',
  'ta': 'Traffic Accident',
  'jesus': 'Jackson Howard',
  'baby bucks': 'Symmetrical Visage',
  'babybucks': 'Symmetrical Visage',
  'mediohxcore': 'Deuces Wild',
  'calimsha': 'Kate "Mac" McCaffrey',
  'spags': 'Troll',
  'bs': 'Blue Sun',
  'larla': 'Levy AR Lab Access',
  'ig': 'Industrial Genomics',
  'clone': 'Clone Chip',
  'josh01': 'Professional Contacts',
  'hiro': 'Chairman Hiro',
  'director': 'Director Haas',
  'haas': 'Director Haas',
  'zeromus': 'Mushin No Shin',
  'tldr': 'TL;DR',
  'sportsball': 'Team Sponsorship',
  'sports ball': 'Team Sponsorship',
  'sports': 'Team Sponsorship',
  'crfluency': 'Blue Sun',
  'dodgepong': 'Broadcast Square',
  'cheese potato': 'Data Leak Reversal',
  'cheese potatos': 'Data Leak Reversal',
  'cheese potatoes': 'Data Leak Reversal',
  'cycy': 'Cyber-Cipher',
  'cy cy': 'Cyber-Cipher',
  'cy-cy': 'Cyber-Cipher',
  'expose': 'Exposé',
  'sneakysly': 'Stimhack',
  'eap': 'Explode-a-palooza',
  'wnp': 'Wireless Net Pavilion',
  'mcg': 'Mumbad City Grid',
  'sscg': 'SanSan City Grid',
  'jes': 'Jesminder Sareen',
  'jess': 'Jesminder Sareen',
  'jessie': 'Jesminder Sareen',
  'palana': 'Pālanā Foods',
  ' Palana Foods': 'Pālanā Foods',
  'plop': 'Political Operative',
  'polop': 'Political Operative',
  'pol op': 'Political Operative',
  'poop': 'Political Operative',
  'mcc': 'Mumbad Construction Co.',
  'coco': 'Mumbad Construction Co.',
  'moh': 'Museum of History',
  'cst': 'Corporate Sales Team',
  'panera': 'Panchatantra',
  'pancetta': 'Panchatantra',
  'hhn': 'Hard-Hitting News',
  'adap': 'Another Day, Another Paycheck',
  'maus': 'Mausolus',
  'eoi': 'Exchange of Information ',
  'oota': 'Out of the Ashes',
  'tw': 'The Turning Wheel',
  'dnn': 'Dedicated Neural Net',
  'ftm': 'Fear the Masses',
  'ttw': 'The Turning Wheel',
  'tw': 'The Turning Wheel',
  'tbf': 'The Black File',
  'bf': 'The Black File',
  'ips': 'Improved Protien Source',
  'nmcg': 'Navi Mumbai City Grid',
  'tpof': 'The Price of Freedom',
  'pgo': 'Power Grid Overload',
  'am': 'Archived Memories',
  'ro': 'Reclamation Order',
  'mch': 'Mumbad City Hall',
  'nach': 'New Angeles City Hall',
  'dl': 'Dirty Laundry',
  'tr': 'Test Run',
  'itd': 'IT Department',
  'it': 'IT Department',
  'vi': 'Voter Intimidation',
  'fte': 'Freedom Through Equality',
  'vbg': 'Virus Breeding Ground',
  'exploda': 'Explode-a-palooza',
  'ctm': 'NBN: Controlling the Message',
  'hrf': 'Hyouba Research Facility',
  'abr': 'Always Be Running',
  'dan': 'Deuces Wild',
  ':dan:': 'Deuces Wild',
  ':themtg:': 'Deuces Wild',
  'pornstache': 'Hernando Cortez',
  'porn stache': 'Hernando Cortez',
  'porn-stache': 'Hernando Cortez',
  'vape': 'Deuces Wild',
  'fair1': 'Fairchild 1.0',
  'fc1': 'Fairchild 1.0',
  'fc 1': 'Fairchild 1.0',
  'fair2': 'Fairchild 2.0',
  'fc2': 'Fairchild 2.0',
  'fc 2': 'Fairchild 2.0',
  'fair3': 'Fairchild 3.0',
  'fc3': 'Fairchild 3.0',
  'fc 3': 'Fairchild 3.0',
  'fc4': 'Fairchild',
  'fc 4': 'Fairchild',
  'fcp': 'Fairchild',
  'fcprime': 'Fairchild',
  "fc'": 'Fairchild',
  'psk': 'Rumor Mill',
  'khantract': 'Temüjin Contract',
  'tc': 'Temüjin Contract',
  'clippy': 'Paperclip',
  'clippit': 'Paperclip',
  'crouton': 'Curtain Wall',
  'bon': 'Weyland: Builder of Nations',
  'aot': 'Archtects of Tomorrow',
  'pu': 'Jinteki: Potential Unleashed',
  'smoke': 'Ele "Smoke" Scovak',
  'bl': 'Biotic Labor',
  'ad': 'Accelerated Diagnostics',
  'sfm': 'Shipment from Mirrormorph',
  'sfmm': 'Shipment from Mirrormorph',
  'sfk': 'Shipment from Kaguya',
  'psyfield': 'Psychic Field',
  'psy field': 'Psychic Field',
  'psifield': 'Psychic Field',
  'psi field': 'Psychic Field',
  'mvt': 'Mumbad Virtual Tour',
  'eff comm': 'Efficiency Committee',
  'eff com': 'Efficiency Committee',
  'effcomm': 'Efficiency Committee',
  'effcom': 'Efficiency Committee',
  'ec': 'Efficiency Committee',
  'd1en': 'MemStrips',
  'dien': 'MemStrips',
  'ber': 'Bioroid Efficiency Research',
  'ci fund': 'C.I. Fund',
  'vlc': 'Violet Level Clearance',
  'pv': 'Project Vitruvius',
  'sac con': 'Sacrificial Construct',
  'saccon': 'Sacrificial Construct',
  'sc': 'Sacrificial Construct',
  'willow': "Will-o'-the-Wisp",
  'will o': "Will-o'-the-Wisp",
  'willo': "Will-o'-the-Wisp",
  'will-o': "Will-o'-the-Wisp",
  'wotw': "Will-o'-the-Wisp",
  'fihp': 'Friends in High Places',
  'otl': 'On the Lam',
  'sifr': 'Ṣifr',
  'piot': 'Peace in Our Time',
  'sna': 'Sensor Net Activation',
  'Sunya': 'Sūnya',
  'barney': 'Bryan Stinson',
  'hat': 'Hellion Alpha Test',
  'hbt': 'Hellion Beta Test',
  'csm': 'Clone Suffrage Movement',
  'mogo': 'Mother Goddess',
  'uwc': 'Underworld Contacts',
  ':dien:': 'MemStrips',
  'o2': 'O₂ Shortage',
  ':damon:': 'O₂ Shortage',
  ':lukas:': 'AstroScript Pilot Program',
  ':mtgdan:': 'Deuces Wild',
  ':spags:': 'Troll',
  'deuces mild': 'Build Script',
  'sau': 'Sensie Actors Union',
  'sft': 'Shipment from Tennin',
  'moon': 'Estelle Moon',
  'uvc': 'Ultraviolet Clearance',
  'sva': 'Salvaged Vanadis Armory',
  'bob': 'Bug Out Bag',
  'turtle': 'Aumakua',
  'tla': 'Threat Level Alpha',
  'mca': 'MCA Austerity Policy',
  'map': 'MCA Austerity Policy',
  'nanotech': "Na'Not'K",
  'nanotek': "Na'Not'K"
  'ci fund': 'C.I. Fund',
  'temujin contract' : 'Temüjin Contract',
  'temu' : 'Temüjin Contract',
  'sifr' : 'Şifr',
  'boom' : 'Boom!'
}

var cardtype = {
  "corp": {
    "identity": {
      "Decksize": "minimum_deck_size",
      "Influence": "influence_limit"
    },
    "agenda": {
      "Adv": "advancement_cost",
      "Score": "agenda_points"
    },
    "ice": {
      "STR" : "strength",
      "Rez": "cost",
      "Influence": "faction_cost"
    },
    "operation": {
      "Cost": "cost",
      "Influence": "faction_cost"
    },
    "asset": {
      "Rez": "cost",
      "Trash": "trash_cost",
      "Influence": "faction_cost"
    },
    "upgrade": {
      "Rez": "cost",
      "Trash": "trash_cost",
      "Influence": "faction_cost"
    }
  },
  "runner": {
    "identity": {
      "Link": "link",
      "Decksize": "minimum_deck_size",
      "Influence": "influence_limit"
    },
    "event": {
      "Cost": "cost",
      "Influence": "faction_cost"
    },
    "hardware": {
      "Install": "cost",
      "Influence": "faction_cost"
    },
    "resource": {
      "Install": "cost",
      "Influence": "faction_cost"
    },
    "program": {
      "Install": "cost",
      "Memory": "memory_cost",
      "Strength": "strength",
      "Influence": "faction_cost"
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
      self.list = obj.data;
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

    for (var x in abbrev){
      if (x.toUpperCase() == cardname.toUpperCase()){
        cardname = abbrev[x];
      }
    }
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
      return el;
    });

  if (matches.length){
    return matches[0].original;
  }
  else return 0;
    //do some math to show shitty search
  }
}

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
  var template = cardtype[card.side_code][card.type_code];
  if (card.uniqueness){
    title = card.title + " •";
  }
  else{
    title = card.title;
  }
  //Check if no subtype
  card_text = title + "\n" + card.faction_code.caps() + "\n" + card.type_code.caps() 
  
  if (card.keywords){
  card_text = card_text +": " + card.keywords + "\n";
  }
  else{
    card_text = card_text + "\n"
  }
  for (var param in template){
    card_text = card_text + param.caps() + " " + card[template[param]] + " ";
  }

  card_text = card_text + "\n\n" + card.text 
  return card_text;
}


function amihanBot(creds,list){
  login(creds, function callback(err, api) {
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
          msg = msg.replace(/\[subroutine\]/g, '->');
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

            //console.log(cardname);
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
