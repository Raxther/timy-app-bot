/* eslint-disable brace-style */
/* eslint-disable camelcase */

module.exports = function (controller, controllerslack) {
  // this is triggered when a user clicks the send-to-messenger plugin

var botslack = controllerslack.spawn({
    token: "xoxb-141241591894-P74g6ZUIwgSZyLT2xqY8hL5l"
}).startRTM();

var bot = controller.spawn({});



  controller.on('facebook_optin', function (bot, message) {
    bot.reply(message, 'Bienvenue sur le chatbot de Timy, Appuyez sur démarrer pour commander');
  })

  var user;

//demarrage conversation
  controller.hears(['pizza'], 'message_received', function(bot,message) {


    // 1/ bonjour, que voulez vous ?
    var begin = function(err, convo) {
      convo.say('Bonjour, bienvenue sur le bot timy');
      convo.ask({
            attachment: {
                'type': 'template',
                'payload': {
                    'template_type': 'generic',
                    'elements': [
                        {
                            'title': 'Que souhaitez vous faire ?',
                            'subtitle': 'Mac donald, cigarette, ect',
                            'buttons': [
                                                                {
                                    'type': 'postback',
                                    'title': 'Passer commande',
                                    'payload': 'commande'
                                },
                                                                {
                                    'type': 'postback',
                                    'title': 'Profiter de nos offres',
                                    'payload': 'offres'
                                },
                                {
                                    'type': 'web_url',
                                    'title': 'En savoir plus',
                                    'url': 'www.timy-app.fr'
                                }
                            ]
                        }
                    ]
                }
            }

        }, function(response, convo) {
            switch(response.text) {
                case 'commande':
                  livraison(response, convo);
                  convo.next();
                    break;
                case 'offres':
                  convo.next();
                    break;
                default:
                  convo.say("je n'ai pas compris");
                  annuler(response, convo);
                  convo.repeat();
                  convo.next();
            }
      });
    };

    //retour au menu
    var annuler = function(response, convo) {
        begin(response, convo);
        convo.next();
    };


    //commander
    var livraison = function(response, convo) {
      convo.ask({
            attachment: {
                'type': 'template',
                'payload': {
                    'template_type': 'generic',
                    'elements': [
                        {
                            'title': "A quelle heure souhaite tu etre livré ?",
                            'buttons': [
                                                                {
                                    'type': 'postback',
                                    'title': 'Maintenant',
                                    'payload': 'now'
                                },
                                                                {
                                    'type': 'postback',
                                    'title': 'Plus Tard',
                                    'payload': 'later'
                                }
                            ]
                        }
                    ]
                }
            }

        }, function(response, convo) {
            switch(response.text) {
                case 'now':
                  now(response, convo);
                  convo.next();
                    break;
                case 'later':
                  later(response, convo);
                  convo.next();
                    break;
                default:
                  convo.say("je n'ai pas compris");
                  livraison(response, convo);
                  convo.next();
            }
      });
    };

    //maintenant
    var now = function(response, convo) {
        var date = new Date();
        heure = 1 + date.getHours();
        if (heure > 16 && heure < 22){
          convo.ask('A quelle heure souhaites tu etre livré', function(response, convo) {
            convo.say('Ok! Good bye.');
            convo.next();
          });
        }else{
          convo.ask({
            attachment: {
                'type': 'template',
                'payload': {
                    'template_type': 'generic',
                    'elements': [
                        {
                            'title': "Oups, nous sommes en dehors des horaires mais une réponse n'est pas garantie",
                            'buttons': [
                                                                {
                                    'type': 'postback',
                                    'title': 'Annuler',
                                    'payload': 'annuler'
                                },
                                                                {
                                    'type': 'postback',
                                    'title': 'Continuer quand meme',
                                    'payload': 'start_livraison'
                                }
                            ]
                        }
                    ]
                }
            }

        }, function(response, convo) {
          convo.say('Ok! Good bye.');
          convo.next();
        });

        }

    };

    //plus tard
    var later = function(response, convo) {
      convo.ask('A quelle heure souhaites tu etre livré', function(response, convo) {
        var now = new Date();
        heure = 1 + now.getHours();
        convo.say('Ok! Good bye.');
        convo.next();
      });
    };









    bot.startConversation(message, begin);
});

  // user said hello
  controller.hears(['bonjour', 'salut', 'wesh','salu','coucou','yo'], 'message_received', function (bot, message) {
    var recap = "";

    bot.startConversation(message, function(err, convo) {
        convo.say('Bonjour, bienvenue sur le bot timy');
        convo.ask({
            attachment: {
                'type': 'template',
                'payload': {
                    'template_type': 'generic',
                    'elements': [
                        {
                            'title': 'Que souhaitez vous faire ?',
                            'subtitle': 'Mac donald, cigarette, ect',
                            'buttons': [
                                                                {
                                    'type': 'postback',
                                    'title': 'Passer commande',
                                    'payload': 'commande'
                                },
                                                                {
                                    'type': 'postback',
                                    'title': 'Profiter de nos offres',
                                    'payload': 'offres'
                                },
                                {
                                    'type': 'web_url',
                                    'title': 'En savoir plus',
                                    'url': 'www.timy-app.fr'
                                }
                            ]
                        }
                    ]
                }
            }

        }, function(response, convo) {
          console.log("--------------------------------réponse " + response.text);
            switch(response.text) {
                case 'commande':
                  convo.next();
                    break;
                case 'offres':
                  convo.next();
                    break;
                default:
                  bot.reply(message,"je n'ai pas compris");
                  convo.repeat();
                  convo.next();
            }
        });

      convo.say('Nos taskers sont disponibles de 16h à 23h');

      convo.ask({
        "message":{
          text: 'How old are you?',
          quick_replies: [{
            content_type: 'text',
            title: 'Child',
            payload: '< 13',
          }, {
            content_type: 'text',
            title: 'Teenager',
            payload: '13 - 19',
          }, {
            content_type: 'text',
            title: 'Adult',
            payload: '> 19',
          }],
        }}, function(response, convo) {
          convo.next();
        });

      convo.ask('votre commande?', function(response, convo){
        switch(response.text) {
                case 'White T-Shirt':
                  convo.next();
                    break;
                default:
                recap += response.text+"\n";
                  //bot.reply(message,'vous avez commandé ' + response.text);
                  convo.next();
            }
      });


      convo.ask('ou ?', function(response, convo){
        switch(response.text) {
                case 'White T-Shirt':
                  convo.next();
                    break;
                default:
                  recap += "lieu : " +response.text+"\n";
                  //bot.reply(message,'vous avez commandé ' + response.text);
                  convo.next();
            }
      });

      convo.ask('quand ?', function(response, convo){
        switch(response.text) {
                case 'White T-Shirt':
                  convo.next();
                    break;
                default:
                  recap += "date : " +response.text+ "\n";
                  bot.reply(message,'votre commande : ' + recap);
                  convo.next();
            }
      });

      convo.ask({
            attachment: {
                'type': 'template',
                'payload': {
                    'template_type': 'generic',
                    'elements': [
                        {
                            'title': "C'est bien ça ?",
                            'buttons': [
                                                                {
                                    'type': 'postback',
                                    'title': 'Oui',
                                    'payload': 'oui'
                                },
                                                                {
                                    'type': 'postback',
                                    'title': 'Non',
                                    'payload': 'non'
                                }
                            ]
                        }
                    ]
                }
            }

        }, function(response, convo){
        switch(response.text) {
                case 'oui':
                user = message.user;
                  botslack.say(
                    {
                      text: recap,
                      channel: 'G3ZTJCDA4',
                       // a valid slack channel, group, mpim, or im ID
                    }
                  );
                  convo.next();
                    break;

                    case 'non':
                  
                  convo.next();
                    break;

                default:
                  bot.reply(message,'vous aviez commandé ' + response.text);
                  convo.next();
            }
      });
      
    });
  })





// user click on button

controller.on('facebook_postback', function(bot, message) {
    // console.log(bot, message);
   // bot.reply(message, 'Great Choice!!!! (' + message.payload + ')');

})

 controllerslack.hears(['Je prends'], ['ambient'], function (botslack, message) {
      console.log(message.user);
      botslack.say(
          {
            text: 'vous avez pris la commande',
            channel: message.user,
             // a valid slack channel, group, mpim, or im ID
          }
        );

      bot.say(
      {
          text: 'votre commande à été prise en compte',
          channel: user // a valid facebook user id or phone number
      }
      );


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
