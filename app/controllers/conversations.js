/* eslint-disable brace-style */
/* eslint-disable camelcase */

module.exports = function (controller) {
  // this is triggered when a user clicks the send-to-messenger plugin
  controller.on('facebook_optin', function (bot, message) {
    bot.reply(message, 'Welcome, friend')
  })

  // user said hello
  controller.hears(['bonjour', 'salut', 'wesh','salu','coucou'], 'message_received', function (bot, message) {
    console.log("message");
        var test = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"button",
        "text":"Bonjour, tu es ici pour commander quelque chose ou tu veux des informations sur Timy ?",
        "buttons":[
          {
            "type":"postback",
            "title":"Je suis la pour passer commande",
            "payload":"order"
          },
          {
            "type":"web_url",
            "url":"https://www.oculus.com/en-us/rift/",
            "title":"Je veux plus d'information"
          }
        ]
      }
    }
  }
    bot.reply(message, test)
  })

// user 


controller.on('facebook_postback', function(bot, message) {
    // console.log(bot, message);
   bot.reply(message, 'Great Choice!!!! (' + message.payload + ')');

})





// user pass an order
  controller.hears(['Ma commande'], 'message_received', function (bot, message) {
    bot.reply(message, 'Votre commande : ' + message.match[1])
  })

  // user says anything else
  controller.hears('(.*)', 'message_received', function (bot, message) {
    bot.reply(message, 'you said ' + message.match[1])
  })
}
