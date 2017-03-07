/* eslint-disable brace-style */
/* eslint-disable camelcase */

module.exports = function (controller, controllerslack) {
  // this is triggered when a user clicks the send-to-messenger plugin

var Request = require('request');
var graph = require('fbgraph');
var fb_token = "EAAKN23HlGKYBACnXUQUUATD5i5pzvJRuvxcWUzoQub9IiA7JeYV3HYEKptjd6aRrw3N4t7AtdBhXDmZB7aCjNs2YoDtrhYCkZBt7X7KjrwYitSxX6TCY35nMyWZBezUOAhThdLEmcBIx304ZCgGVcsIoXGQBZCCJZCu5vrFm25dwZDZD"
graph.setAccessToken(fb_token);
  
var botslack = controllerslack.spawn({
    token: "xoxb-141241591894-P74g6ZUIwgSZyLT2xqY8hL5l"
}).startRTM();

var bot = controller.spawn({});



  controller.on('facebook_optin', function (bot, message) {
    //bot.reply(message, "Hello, moi c'est Timy !\nJe livre tout Grenoble en moins d'une heure et à partir de 2,50€. Mcdo, cigarettes, bières, colis .. 🍻 🍕 📱 🌂 🚬 🔑 📦. En bref, si t'as pas envie, appelle Timy. Où plutôt écris à Timy !\nNos coursiers te livrent entre 16h et 22h tous les jours et de 10h à 14h le dimanche dans tout Grenoble 38000.");
    bot.reply(message, "Dis moi hello pour commencer !");
  })

  var user;

//demarrage conversation
  controller.hears(['bonjour', 'salut', 'wesh','salu','coucou','yo','bjr','slt','reboot','hello'], 'message_received', function(bot,message) {
    var recap = "";
    var adresse = "";
    var heure_livraison ="";
    var panier="";
    var phone="";
    var promo="";

    // 1/ bonjour, que voulez vous ?
    var begin = function(err, convo) {
      //bot.reply(message, "Hello, moi c'est Timy !\nJe livre tout Grenoble en moins d'une heure et à partir de 2,50€. Mcdo, cigarettes, bières, colis .. 🍻 🍕 📱 🌂 🚬 🔑 📦. En bref, si t'as pas envie, appelle Timy. Où plutôt écris à Timy !\nNos coursiers te livrent entre 16h et 22h tous les jours et de 10h à 14h le dimanche dans tout Grenoble 38000.");
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
                                    'title': 'Réserver un service',
                                    'payload': 'service'
                                },
                                                                {
                                    'type': 'postback',
                                    'title': 'Questions',
                                    'payload': 'Autre'
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
                convo.say("Redemarrage en cours..");
                  begin(response, convo);
                  convo.next();
                    break;
                 case 'starcafe':
                  convo.say("Grâce à notre partenariat avec le Star Café, on te livre tous les jours de 12h à 13h30 dans GEM pour 1€ 🍔 🍟");
                  help(response, convo);
                  convo.next();
                    break;
                case 'Autre':
                  convo.say("Je t'écoute 👀");
                  help(response, convo);
                  convo.next();
                    break;
                case 'service':
                  convo.say("Quel service souhaites-tu reserver ?");
                  help(response, convo);
                  convo.next();
                    break;
                case 'humain':
                convo.say("J'appelle quelqu'un qui te répondra dans les plus brefs delais :)");
                  help(response, convo);
                  convo.next();
                    break;
                default:
                  convo.say("Je n'ai pas compris.. 🤔");
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
        convo.ask({
       text: "Pour notre partenariat avec le Crossover, Timy offre à 40 personnes leur première livraison ! 🚴",
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
                convo.say("Redemarrage en cours..");
                  begin(response, convo);
                  convo.next();
                    break;
                case 'humain':
                convo.say("J'appelle quelqu'un qui te répondra dans les plus brefs delais :)");
                  help(response, convo);
                  convo.next();
                    break;
                default:
                  convo.say("Je n'ai pas compris.. 🤔");
                  crossover(response, convo);
                  convo.next();
            }
      });
        convo.next();
    };

    var cool = function(response, convo) {
        convo.say("Bonne chance 🍀 Passe nous voir sur le stand Timy samedi soir, on aura des goodies ! A très vite ✨");
        convo.next();
    };

    var no_thanks = function(response, convo) {
        convo.say("Tant piiiiiiiiis ! Passe nous voir sur le stand Timy samedi soir 👋");
        convo.next();
    };


    //commander
    var livraison = function(response, convo) {
      convo.ask({
 text: 'À quelle heure souhaites tu être livré ? ⏰',
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
                convo.say("Redemarrage en cours..");
                  begin(response, convo);
                  convo.next();
                    break;
                case 'humain':
                convo.say("J'appelle quelqu'un qui te répondra dans les plus brefs delais :)");
                  help(response, convo);
                  convo.next();
                    break;
                default:
                  convo.say("Je n'ai pas compris.. 🤔");
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
            heure_livraison = "Quand ⏰ : Maintenant\n"
            convo.say('Coooool !');
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
                convo.say("Redemarrage en cours..");
                  begin(response, convo);
                  convo.next();
                    break;
                case 'humain':
                convo.say("J'appelle quelqu'un qui te répondra dans les plus brefs delais :)");
                  help(response, convo);
                  convo.next();
                    break;
                default:
                  convo.say("Je n'ai pas compris.. 🤔");
                  now(response, convo);
                  convo.next();
            }
        });

        }

    };

    //plus tard (à finir)
    var later = function(response, convo) {
      convo.ask("Quand souhaites tu être livré ? Nous sommes ouvert du Lundi au Samedi de 16h à 22h et le Dimanche de 10h à 14h. 📅", 
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
                convo.say("Redemarrage en cours..");
                  begin(response, convo);
                  convo.next();
                    break;
                case 'humain':
                convo.say("J'appelle quelqu'un qui te répondra dans les plus brefs delais :)");
                  help(response, convo);
                  convo.next();
                    break;
                default:
                  heure_livraison = "Quand ⏰ : " +response.text+"\n";
                  start_livraison(response, convo);
                  convo.next();
          }
      });
    };

    // 
    var start_livraison = function(response, convo) {
      convo.ask({
                  'text': "Quelle est la zone de livraison ? 📍",
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
                convo.say("Redemarrage en cours..");
                  begin(response, convo);
                  convo.next();
                    break;
                case 'humain':
                convo.say("J'appelle quelqu'un qui te répondra dans les plus brefs delais :)");
                  help(response, convo);
                  convo.next();
                    break;
                default:
                  convo.say("Je n'ai pas compris.. 🤔");
                  start_livraison(response, convo);
                  convo.next();
            }
      });
    };


    var in_grenoble = function(response, convo) {
      convo.ask("Merci de nous indiquer l'adresse précise dans Grenoble 38000 🏡 (n°, rue, digicode, étage)", function(response, convo) {
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
                convo.say("Redemarrage en cours..");
                  begin(response, convo);
                  convo.next();
                    break;
                case 'humain':
                convo.say("J'appelle quelqu'un qui te répondra dans les plus brefs delais :)");
                  help(response, convo);
                  convo.next();
                    break;
                default:
        adresse = "Adresse 🏡 : " +response.text+"\n";
        quoi(response, convo);
        convo.next();
        }
      });
    };

    var out_grenoble = function(response, convo) {
        convo.say("Oups, nous ne livrons pas en dehors de grenoble 38000, mais nous arrivons prochainement sur Saint Martin d'Hères");
        convo.ask({
                  'text': "Es-tu sûr de ne pas habiter Grenoble 38000 ? ;)",
                  'quick_replies': [
                                                      {
                          'type': 'postback',
                          'title': 'Oui !',
                          'payload': 'oui'
                      },
                                                      {
                          'type': 'postback',
                          'title': 'Non..',
                          'payload': 'non'
                      }
                  ]
              
        }, function(response, convo) {
        switch(response.text) {
                case 'Oui !':
                  annuler(response, convo);
                  convo.next();
                    break;
                case 'Non..':
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
                convo.say("Redemarrage en cours..");
                  begin(response, convo);
                  convo.next();
                    break;
                case 'humain':
                convo.say("J'appelle quelqu'un qui te répondra dans les plus brefs delais :)");
                  help(response, convo);
                  convo.next();
                    break;
                default:
                  convo.say("Je n'ai pas compris.. 🤔");
                  out_grenoble(response, convo);
                  convo.next();
      }
      });
        convo.next();
    };

    var quoi = function(response, convo) {
      convo.say("Que souhaites-tu te faire livrer ? (Sois le plus précis possible) 🚴");
      convo.ask("PS: Si ta demande dépasse les 9kg et/ou ne rentre pas dans un sac à dos de 30x40x40cm, le prix et le délai de livraison peuvent varier* 🐫 🎿 ✈️", function(response, convo) {
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
                convo.say("Redemarrage en cours..");
                  begin(response, convo);
                  convo.next();
                    break;
                case 'humain':
                convo.say("J'appelle quelqu'un qui te répondra dans les plus brefs delais :)");
                  help(response, convo);
                  convo.next();
                    break;
                default:
        panier = "Objet : " +response.text +"\n";
        promo(response, convo);
        convo.next();
      }
      });
    };

    var promo = function(response, convo) {
      convo.ask("As-tu un code promo ? 💵", function(response, convo) {
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
                convo.say("Redemarrage en cours..");
                  begin(response, convo);
                  convo.next();
                    break;
                case 'humain':
                convo.say("J'appelle quelqu'un qui te répondra dans les plus brefs delais :)");
                  help(response, convo);
                  convo.next();
                    break;
                default:
        promo = "Code promo 💵 : " +response.text +"\n";
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
                convo.say("Redemarrage en cours..");
                  begin(response, convo);
                  convo.next();
                    break;
                case 'humain':
                convo.say("J'appelle quelqu'un qui te répondra dans les plus brefs delais :)");
                  help(response, convo);
                  convo.next();
                    break;
                default:
                  tel = response.text;
                  if(tel.match(/^(\+33|0033|0)(4|6|7)[0-9]{8}$/g)){
                      phone = "Téléphone : " +response.text;
                      recapitulatif(response, convo);
                  }else{
                      convo.say("Je n'ai pas compris");
                      telephone(response, convo);
                  }

        convo.next();
        }
      });
    };

    var recapitulatif = function(response, convo) {
      recap = adresse + heure_livraison + panier + promo + phone;
      convo.say('Récapitulatif de ta commande : \n' + recap);
      convo.ask({
                  'text': "C'est bien ça ?",
                  'quick_replies': [
                                        {
                          'type': 'postback',
                          'title': 'Confirmer',
                          'payload': 'confirmer'
                      },
                                                      {
                          'type': 'postback',
                          'title': 'Modifier',
                          'payload': 'modifier'
                      },
                                                      {
                          'type': 'postback',
                          'title': 'Annuler',
                          'payload': 'annuler'
                      }
                  ]

        }, function(response, convo) {
              switch(response.text) {
                case 'Modifier':
                  start_livraison(response, convo);
                  convo.next();
                    break;
                case 'Annuler':
                  annuler(response, convo);
                  convo.next();
                    break;
                case 'Confirmer':
                  confirmer(response, convo);
                  convo.next();
                    break;
                case 'cancel':
                  annuler(response, convo);
                  convo.next();
                    break;
                case 'reboot':
                convo.say("Redemarrage en cours..");
                  begin(response, convo);
                  convo.next();
                    break;
                case 'humain':
                convo.say("J'appelle quelqu'un qui te répondra dans les plus brefs delais :)");
                  help(response, convo);
                  convo.next();
                    break;
                default:
                  convo.say("Je n'ai pas compris.. 🤔");
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
      graph.get(message.user, function(errr, res) {
         nom = res.first_name + " "+res.last_name; 

        bot.say(
        {
            text: nom+ " demande de l'aide sur le bot :) (et Rama pense à toi <3 )",
            channel: '1616938198321584' // a valid facebook user id or phone number
        })
      // { id: '4', name: 'Mark Zuckerberg'... }
      });

      convo.next();
    }

    bot.startConversation(message, begin);
});

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
    //bot.reply(message, 'Votre commande : ' + message.match[1])
  })

  controller.hears('humain', 'message_received', function (bot, message) {
    bot.reply(message, "J'ai appelé quelqu'un pour toi, il ne devrait pas tarder :)")
                bot.say(
      {
          text: "Quelqu'un demande de l'aide sur le bot :) (et rama pense à toi <3 )",
          channel: '1616938198321584' // a valid facebook user id or phone number
      })
  })

  // user says anything else
  controller.hears('(.*)', 'message_received', function (bot, message) {
    console.log("-----------------------anything--------------------")
    //bot.reply(message, "Désolé, mais il faut me dire bonjour avant que je puisse t'aider")
  })



}
