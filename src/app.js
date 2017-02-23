/**
 * .env loading
 */
require ('dotenv-extended').load ();

/**
 * Dependencies
 */
const restify = require ('restify');
const path = require ('path');
const builder = require ('botbuilder');
const mongoose = require ('mongoose');

//Constants
const localePath = path.join (__dirname, 'locale/');

//=========================================================
// MongoDB Setup
//=========================================================

mongoose.connect (process.env.MONGO_URI, err => {
    if (err) {
        return console.error (err);
    }
    console.log ("Connected to MongoDB");
});

/*Fixtures Loader*/
const fixtures = require ('pow-mongodb-fixtures').connect ('dev');
fixtures.clearAllAndLoad (__dirname + '/fixtures', () => {
    console.info ('Fixtures Data Loaded');
});

//=========================================================
// Bot Setup
//=========================================================

// Create chat bot
const connector = new builder.ChatConnector ({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
const bot = new builder.UniversalBot (connector);

/**
 * Set Locale Path
 */
bot.set ('localizerSettings', {
    botLocalePath: localePath,
});

//=========================================================
// Bots Middleware
//=========================================================

bot.use (builder.Middleware.firstRun ({version: 1.0, dialogId: '*:/firstRun'}));
bot.use (builder.Middleware.sendTyping ());

/**
 * Spelling Service
 */
if (process.env.IS_SPELL_CORRECTION_ENABLED === "true") {
    bot.use ({
        botbuilder: function (session, next) {
            spellService
                .getCorrectedText (session.message.text)
                .then (text => {
                    console.log (text);
                    session.message.text = text;
                    next ();
                })
                .catch ((error) => {
                    console.error (error);
                    next ();
                });
        }
    })
}

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog ('/', require ('./dialogs/root'));
bot.dialog ('/firstRun', require ('./dialogs/firstRun/firstRun'));
bot.dialog ('/example', require ('./dialogs/example/example'));

//=========================================================
// Server Setup
//=========================================================

const server = restify.createServer ();

// Setup endpoint for incoming messages which will be passed to the bot's ChatConnector.
server.post ('/api/messages', connector.listen ());

// Start listening on 3978 by default
server.listen (process.env.port || process.env.PORT || 3978, () => {
    console.log ('%s listening to %s', server.name, server.url);
});
