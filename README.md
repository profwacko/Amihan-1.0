# Amihan-1.0
Android: Netrunner Facebook Chat Bot using [facebook-chat-api](https://www.npmjs.com/package/facebook-chat-api)

Inspired by: [netrunnerbot](https://github.com/b0wmz1337/redditbots/tree/master/netrunnerbot) and [stimbot](https://github.com/dodgepong/stimbot)

I decided to make a fun little facebook chatbot for our community's facebook chat. For it to work you need a copy of the netrunnerdb list of cards to a local file (cardlist.json) and reads from that.

## Setup

To run, you need to have [forever](https://www.npmjs.com/package/forever) installed globally

```
npm install forever -g
```

Clone the repository

```
git clone https://github.com/profwacko/Amihan-1.0.git
```

Install dependencies

```
npm install
```

Download netrunnerdb cards from API in JSON format
```
./getcards.sh
```

Then run init script
```
./init.sh
```

You must then enter facebook account details for the bot account. No account credentials are saved in the files permanently.

## Commands

Chat Command Format

['card name'] or ['card name'MODIFIER] or [COMMANDS]

Amihan returns card text for 'card name'.

+ MODIFIERS
+ $f - flavor
+ $ndb - netrunnerdb links
+ $faq - ANCUR link

COMMANDS:
+ help - show list of commands
+ rand - random card
+ flavor - random flavor text
+ flip - flips a coin
+ psi - 'play' a PSI Game
+ about - return github page
