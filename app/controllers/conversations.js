/* eslint-disable brace-style */
/* eslint-disable camelcase */

module.exports = function (controller, controllerslack) {
  // this is triggered when a user clicks the send-to-messenger plugin

var botslack = controllerslack.spawn({
    token: "xoxb-141241591894-P74g6ZUIwgSZyLT2xqY8hL5l"
}).startRTM();

var bot = controller.spawn({});
var human = false;



  controller.on('facebook_optin', function (bot, message) {
    bot.reply(message, "Hello moi c'est Timy ! Je te livre tout Grenoble dans l'heure pour 2,5€");
  })

  var user;

//demarrage conversation
  controller.hears(['bonjour', 'salut', 'wesh','salu','coucou','yo','bjr','slt','reboot'], 'message_received', function(bot,message) {
    var recap = "";
    var adresse = "";
    var heure_livraison ="";
    var panier="";
    var phone="";
    var promo="";

    // 1/ bonjour, que voulez vous ?
    var begin = function(err, convo) {
      convo.ask({
            attachment: {
                'type': 'template',
                'payload': {
                    'template_type': 'generic',
                    'elements': [
                        {
                            'title': 'Que puis-je faire pour toi ?',
                            'buttons': [
                                                                {
                                    'type': 'postback',
                                    'title': 'Commander',
                                    'payload': 'commande'
                                },
                                                                {
                                    'type': 'postback',
                                    'title': 'Crossover',
                                    'payload': 'crossover'
                                },
                                                                {
                                    'type': 'web_url',
                                    'title': 'Découvrir Timy',
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
                case 'crossover':
                  crossover(response,convo);
                  convo.next();
                    break;
                case 'cancel':
                  annuler(response, convo);
                  convo.next();
                    break;
                case 'reboot':
                convo.say("redémarrage en cours");
                  begin(response, convo);
                  convo.next();
                    break;
                case 'humain':
                convo.say("humain demandé");
                  humain(response, convo);
                  convo.next();
                    break;
                default:
                  convo.say("je n'ai pas compris");
                  begin(response, convo);
                  convo.next();
            }
      });
    };

    //retour au menu
    var annuler = function(response, convo) {
        convo.say("Ok! tant pis :(");
        convo.next();
    };

    var crossover = function(response, convo) {
      convo.say("Moi c'est Timy, je te livre tout ce dont tu as besoin sur Grenoble (boissons, fast food, cigarettes, etc.). Livraison garantie dans l'heure et à partir de 2,50€ ! On propose aussi d'autres services comme la laverie, les visites d'appartements. En bref, si t'as pas envie, appelle Timy !");
        convo.ask({
       text: "Pour notre partenariat avec le Crossover, on offre à 80 personnes leur première livraison Timy",
        quick_replies: [{
          content_type: 'text',
          title: 'Trop cool !',
          payload: 'cool',
        }, {
          content_type: 'text',
          title: 'Non merci',
          payload: 'no_thanks',
        }],

      }, function(response, convo) {
            switch(response.text) {
                case 'Trop cool !':
                  cool(response, convo);
                  convo.next();
                    break;
                case 'Non merci':
                  no_thanks(response, convo);
                  convo.next();
                    break;
                case 'cancel':
                  annuler(response, convo);
                  convo.next();
                    break;
                case 'reboot':
                convo.say("redemarrage en cours");
                  begin(response, convo);
                  convo.next();
                    break;
                default:
                  convo.say("je n'ai pas compris");
                  livraison(response, convo);
                  convo.next();
            }
      });
        convo.next();
    };

    var cool = function(response, convo) {
        convo.say("C'est noté. Bonne chance ! Passe nous voir sur le stand samedi au Crossover :) A samedi");
        convo.next();
    };

    var no_thanks = function(response, convo) {
        convo.say("Dommage :( N'hésite pas à passer nous voir sur le stand samedi au Crossover :) A samedi.");
        convo.next();
    };


    //commander
    var livraison = function(response, convo) {
      convo.ask({
 text: 'À quelle heure souhaites tu être livré ?',
  quick_replies: [{
    content_type: 'text',
    title: 'Maintenant',
    payload: 'now',
  }, {
    content_type: 'text',
    title: 'Plus tard',
    payload: 'later',
  }],

}, function(response, convo) {
            switch(response.text) {
                case 'Maintenant':
                  now(response, convo);
                  convo.next();
                    break;
                case 'Plus tard':
                  later(response, convo);
                  convo.next();
                    break;
                case 'cancel':
                  annuler(response, convo);
                  convo.next();
                    break;
                case 'reboot':
                convo.say("redemarrage en cours");
                  begin(response, convo);
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
        console.log(heure);
        if (heure >= 16 && heure < 22){
            heure_livraison = "Quand : Maintenant\n"
            convo.say('Très bien!');
            start_livraison(response, convo);
            convo.next();

        }else{
          convo.ask({
                            'text': "Oups, nous sommes en dehors des horaires. Tu peux quand même passer commande mais une réponse n'est pas garantie",
                            'quick_replies': [
                                                                {
                                    'type': 'postback',
                                    'title': 'Annuler',
                                    'payload': 'annuler'
                                },
                                                                {
                                    'type': 'postback',
                                    'title': 'Continuer',
                                    'payload': 'start_livraison'
                                }
                            ]
                        
                    
                
            

        }, function(response, convo) {
          switch(response.text) {
                case 'Continuer':
                  later(response, convo);
                  convo.next();
                    break;
                case 'Annuler':
                  annuler(response, convo);
                  convo.next();
                    break;
                case 'cancel':
                  annuler(response, convo);
                  convo.next();
                    break;
                case 'reboot':
                convo.say("redemarrage en cours");
                  begin(response, convo);
                  convo.next();
                    break;
                default:
                  convo.say("je n'ai pas compris");
                  now(response, convo);
                  convo.next();
            }
        });

        }

    };

    //plus tard (à finir)
    var later = function(response, convo) {
      convo.ask("Quand souhaites tu être livré ? Nous sommes ouvert du lundi au samedi de 16h à 22h et le dimanche de 10h à 14h", 
        function(response, convo) {
          switch(response.text) {
                case 'annuler':
                  annuler(response, convo);
                  convo.next();
                    break;
                case 'cancel':
                  annuler(response, convo);
                  convo.next();
                    break;
                case 'reboot':
                convo.say("redemarrage en cours");
                  begin(response, convo);
                  convo.next();
                    break;
                default:
                  heure_livraison = "Quand : " +response.text+"\n";
                  start_livraison(response, convo);
                  convo.next();
          }
      });
    };

    // 
    var start_livraison = function(response, convo) {
      convo.ask({
                  'text': "Quelle est l'adresse de livraison ?",
                  'quick_replies': [
                                                      {
                          'type': 'postback',
                          'title': '38000',
                          'payload': 'in_grenoble'
                      },
                                                      {
                          'type': 'postback',
                          'title': 'Autre',
                          'payload': 'out_grenoble'
                      }
                  ]
              
        }, function(response, convo) {
              switch(response.text) {
                case '38000':
                  in_grenoble(response, convo);
                  convo.next();
                    break;
                case 'Autre':
                  out_grenoble(response, convo);
                  convo.next();
                    break;
                case 'cancel':
                  annuler(response, convo);
                  convo.next();
                    break;
                case 'reboot':
                convo.say("redemarrage en cours");
                  begin(response, convo);
                  convo.next();
                    break;
                default:
                  convo.say("je n'ai pas compris");
                  start_livraison(response, convo);
                  convo.next();
            }
      });
    };


    var in_grenoble = function(response, convo) {
      convo.ask("Merci de nous indiquer l'adresse précise dans Grenoble 38000 (n°, digicode, étage)", function(response, convo) {
        switch(response.text) {
                case 'annuler':
                  annuler(response, convo);
                  convo.next();
                    break;
                case 'cancel':
                  annuler(response, convo);
                  convo.next();
                    break;
                case 'reboot':
                convo.say("redemarrage en cours");
                  begin(response, convo);
                  convo.next();
                    break;
                default:
        adresse = "Adresse : " +response.text+"\n";
        quoi(response, convo);
        convo.next();
        }
      });
    };

    var out_grenoble = function(response, convo) {
        convo.say("Oups, nous ne livrons pas en dehors de grenoble 38000, mais nous arrivons prochainement sur Saint Martin d'Hères");
        convo.ask({
                  'text': "Es tu sur de ne pas habiter Grenoble 38000 ? ;)",
                  'quick_replies': [
                                                      {
                          'type': 'postback',
                          'title': 'oui',
                          'payload': 'oui'
                      },
                                                      {
                          'type': 'postback',
                          'title': 'non',
                          'payload': 'non'
                      }
                  ]
              
        }, function(response, convo) {
        switch(response.text) {
                case 'oui':
                  annuler(response, convo);
                  convo.next();
                    break;
                case 'non':
                  in_grenoble(response, convo);
                  convo.next();
                    break;
                case 'annuler':
                  annuler(response, convo);
                  convo.next();
                    break;
                case 'cancel':
                  annuler(response, convo);
                  convo.next();
                    break;
                case 'reboot':
                convo.say("redemarrage en cours");
                  begin(response, convo);
                  convo.next();
                    break;
                default:
        panier += "Quoi : " +response.text +"\n";
        telephone(response, convo);
        convo.next();
      }
      });
        convo.next();
    };

    var quoi = function(response, convo) {
      convo.ask("Que souhaite tu te faire livrer ? essaye d'etre le plus precis possible", function(response, convo) {
        switch(response.text) {
                case 'annuler':
                  annuler(response, convo);
                  convo.next();
                    break;
                case 'cancel':
                  annuler(response, convo);
                  convo.next();
                    break;
                case 'reboot':
                convo.say("redemarrage en cours");
                  begin(response, convo);
                  convo.next();
                    break;
                default:
        panier += "Quoi : " +response.text +"\n";
        promo(response, convo);
        convo.next();
      }
      });
    };

    var promo = function(response, convo) {
      convo.ask("As-tu un code promo ?", function(response, convo) {
        switch(response.text) {
                case 'annuler':
                  annuler(response, convo);
                  convo.next();
                    break;
                case 'cancel':
                  annuler(response, convo);
                  convo.next();
                    break;
                case 'reboot':
                convo.say("redemarrage en cours");
                  begin(response, convo);
                  convo.next();
                    break;
                default:
        promo += "Code promo : " +response.text +"\n";
        telephone(response, convo);
        convo.next();
      }
      });
    };

    var telephone = function(response, convo) {
      convo.ask("Peux tu me donner ton numero de téléphone ?", function(response, convo) {
        switch(response.text) {
                case 'annuler':
                  annuler(response, convo);
                  convo.next();
                    break;
                case 'cancel':
                  annuler(response, convo);
                  convo.next();
                    break;
                case 'reboot':
                convo.say("redemarrage en cours");
                  begin(response, convo);
                  convo.next();
                    break;
                default:
         phone="";
         phone += "Téléphone : " +response.text;
        recapitulatif(response, convo);
        convo.next();
        }
      });
    };

    var recapitulatif = function(response, convo) {
      recap = adresse + heure_livraison + panier + promo + phone;
      convo.say('Votre commande :\n' + recap);
      convo.ask({
                  'text': "C'est bien ça ?",
                  'quick_replies': [
                                        {
                          'type': 'postback',
                          'title': 'confirmer',
                          'payload': 'confirmer'
                      },
                                                      {
                          'type': 'postback',
                          'title': 'modifier',
                          'payload': 'modifier'
                      },
                                                      {
                          'type': 'postback',
                          'title': 'annuler',
                          'payload': 'annuler'
                      }
                  ]

        }, function(response, convo) {
              switch(response.text) {
                case 'modifier':
                  start_livraison(response, convo);
                  convo.next();
                    break;
                case 'annuler':
                  annuler(response, convo);
                  convo.next();
                    break;
                case 'confirmer':
                  confirmer(response, convo);
                  convo.next();
                    break;
                case 'cancel':
                  annuler(response, convo);
                  convo.next();
                    break;
                case 'reboot':
                convo.say("redemarrage en cours");
                  begin(response, convo);
                  convo.next();
                    break;
                default:
                  convo.say("je n'ai pas compris");
                  recapitulatif(response, convo);
                  convo.next();
            }
      });
    };

    var confirmer = function(response, convo) {
      botslack.say(
                    {
                      text: recap,
                      channel: 'G3ZTJCDA4',
                       // a valid slack channel, group, mpim, or im ID
                    }
                  );
                  convo.next();
      convo.say("Votre commande a été envoyé à nos taskers :)");     
      convo.next();
    };

    var help = function(response, convo) {
      human = true
      convo.stop();
    }








    bot.startConversation(message, begin);
});

  // user said hello
  controller.hears(['nfbdskjfhdsjkfhdskj'], 'message_received', function (bot, message) {

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
                  bot.reply(message,          {quick_replies: [{
                content_type:"text",
                title:"Red",
                payload:"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED",
                image_url:"https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Button_Icon_Red.svg/300px-Button_Icon_Red.svg.png"
            },            
            {
                content_type:"text",
                title:"Blue",
                payload:"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_BLUE",
                image_url:"https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Button_Icon_Blue.svg/768px-Button_Icon_Blue.svg.png"
            }]});
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

  controller.hears('Merci', 'message_received', function (bot, message) {
    bot.reply(message, 'De rien ;)')
  })

  // user says anything else
  controller.hears('(.*)', 'message_received', function (bot, message) {
    console.log("-----------------------anything--------------------")
    if(!human){
      bot.reply(message, "Désolé, mais il faut me dire bonjour avant que je puisse t'aider")
    }
  })

}
