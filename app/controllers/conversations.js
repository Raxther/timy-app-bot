/* eslint-disable brace-style */
/* eslint-disable camelcase */

module.exports = function (controller) {
  // this is triggered when a user clicks the send-to-messenger plugin
  controller.on('facebook_optin', function (bot, message) {
    bot.reply(message, 'Bonjour :)')
  })

  // user said hello
  controller.hears(['bonjour', 'salut', 'wesh','salu','coucou','yo'], 'message_received', function (bot, message) {
    bot.startConversation(message, function(err, convo) {
        convo.ask({
            attachment: {
                'type': 'template',
                'payload': {
                    'template_type': 'generic',
                    'elements': [
                        {
                            'title': 'Passer commande generale',
                            'image_url': 'http://petersapparel.parseapp.com/img/item100-thumb.png',
                            'subtitle': 'Mac donald, cigarette',
                            'buttons': [
                                {
                                    'type': 'web_url',
                                    'url': 'https://petersapparel.parseapp.com/view_item?item_id=100',
                                    'title': 'View Item'
                                },
                                {
                                    'type': 'web_url',
                                    'url': 'https://petersapparel.parseapp.com/buy_item?item_id=100',
                                    'title': 'Buy Item'
                                },
                                {
                                    'type': 'postback',
                                    'title': 'Bookmark Item',
                                    'payload': 'White T-Shirt'
                                }
                            ]
                        },
                        {
                            'title': 'Profiter de nos offres',
                            'image_url': 'http://petersapparel.parseapp.com/img/item101-thumb.png',
                            'subtitle': 'A découvrir sur notre page',
                            'buttons': [
                                {
                                    'type': 'web_url',
                                    'url': 'https://petersapparel.parseapp.com/view_item?item_id=101',
                                    'title': 'View Item'
                                },
                                {
                                    'type': 'web_url',
                                    'url': 'https://petersapparel.parseapp.com/buy_item?item_id=101',
                                    'title': 'Buy Item'
                                },
                                {
                                    'type': 'postback',
                                    'title': 'Bookmark Item',
                                    'payload': 'Grey T-Shirt'
                                }
                            ]
                        }
                    ]
                }
            }

        }, function(response, convo) {
          console.log("--------------------------------réponse " + response.text);
            switch(response.text) {
                case "Grey T-Shirt":
                  convo.next();
                    break;
                case 'White T-Shirt':
                  convo.next();
                    break;
                default:
                  bot.reply(message,'jai pas compris enculé');
                  convo.repeat();
                  convo.next();
            }
        });
      convo.say('Nos taskers sont disponibles de 16h à 23h');

      convo.ask('votre commande?', function(response, convo){
        switch(response.text) {
                case "Grey T-Shirt":
                  convo.next();
                    break;
                case 'White T-Shirt':
                  convo.next();
                    break;
                default:
                  bot.reply(message,'vous avez commandé ' + response.text);
                  convo.next();
            }
      });
      
    });
  })

// user click on button

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
    console.log("-----------------------anything--------------------")
    bot.reply(message, 'you said ' + message.match[1])
  })
}
