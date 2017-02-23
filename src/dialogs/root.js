const {IntentDialog, DialogAction} = require ('botbuilder');
const {witRecognizer} = require ('../helpers/witRecognizer');

module.exports = new IntentDialog ({recognizers: [witRecognizer]})
    .matches ('example', DialogAction.beginDialog ('/example'))
    .onDefault ((session) => {
        session.send ('Example Default Text If Intent is not recognized');
    });