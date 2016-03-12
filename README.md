# Amihan-1.0
Android: Netrunner Facebook Chat Bot using [facebook-chat-api](https://www.npmjs.com/package/facebook-chat-api)

Inspired by: [netrunnerbot](https://github.com/b0wmz1337/redditbots/tree/master/netrunnerbot)

I decided to make a fun little facebook chatbot for our community's facebook chat. 

##Setup

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

Then run init script
```
./init.sh
```

You must then enter facebook account details for the bot account. No account credentials are saved in the files.

##Commands

Chat Command Format

['card name'] or ['card name'MODIFIER] or [COMMANDS]

Amihan returns netrunnerdb links for 'card name'.

+ MODIFIERS
+ $f - flavor
+ $t - card text only
+ $faq - ANCUR link

COMMANDS:
+ help - show list of commands
+ rand - random card
+ flavor - random flavor text
+ flip - flips a coin
+ psi - 'play' a PSI Game
+ about - return github page
