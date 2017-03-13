/* eslint-disable brace-style */
/* eslint-disable camelcase */

module.exports = function (controller, controllerslack) {
  // this is triggered when a user clicks the send-to-messenger plugin

var Request = require('request');
var graph = require('fbgraph');
var moment = require('moment');
moment.locale('fr');
var fb_token = "EAAKN23HlGKYBACnXUQUUATD5i5pzvJRuvxcWUzoQub9IiA7JeYV3HYEKptjd6aRrw3N4t7AtdBhXDmZB7aCjNs2YoDtrhYCkZBt7X7KjrwYitSxX6TCY35nMyWZBezUOAhThdLEmcBIx304ZCgGVcsIoXGQBZCCJZCu5vrFm25dwZDZD"
graph.setAccessToken(fb_token);
  
var botslack = controllerslack.spawn({
    token: "xoxb-153212029911-LpKqJu6PLxYnnwAzG7eXzHWo"
  }).startRTM();

var bot = controller.spawn({});



  controller.on('facebook_optin', function (bot, message) {
    //bot.reply(message, "Hello, moi c'est Timy !\nJe livre tout Grenoble en moins d'une heure et à partir de 2,50€. Mcdo, cigarettes, bières, colis .. 🍻 🍕 📱 🌂 🚬 🔑 📦. En bref, si t'as pas envie, appelle Timy. Où plutôt écris à Timy !\nNos coursiers te livrent entre 16h et 22h tous les jours et de 10h à 14h le dimanche dans tout Grenoble 38000.");
    bot.reply(message, "Dis moi hello pour commencer !");
  })

  var user;

//demarrage conversation
  controller.hears(['bonjour', 'salut', 'wesh','salu','coucou','yo','bjr','slt','reboot','hello','commander'], 'message_received', function(bot,message) {
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
                                    'title': 'Me faire livrer',
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
                  convo.say("J'appelle quelqu'un qui te répondra dans les plus brefs delais :)");
                  help(response, convo);
                  convo.next();
                    break;
                case 'service':
                  //convo.say("Quel service souhaites-tu reserver ?");
                  ask_service(response, convo);
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
        convo.say("Ok! Dommage :(\nPeux tu nous dire pourquoi ? Cela nous aiderai à nous améliorer");
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
        var n = date.getDay();
        heure = 1 + date.getHours();
        var horraire_semaine = (heure >= 18 && heure < 22) && (n != 0);
        var horraire_dimanche = (n == 0) && (heure >= 10 && heure < 14);
        if (horraire_dimanche || horraire_semaine){
            heure_livraison = "Maintenant"
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
      convo.ask({
                    'text':"Quand souhaites tu être livré ? Nous sommes ouvert du Lundi au Samedi de 18h à 22h et le Dimanche de 10h à 14h. 📅", 
                    'quick_replies': [
                                                        {
                            'type': 'postback',
                            'title': 'Annuler',
                            'payload': 'Annuler'
                        }]
        },function(response, convo) {
          switch(response.text) {
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
                  heure_livraison = response.text;
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
        adresse = response.text;
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
        panier =  response.text;
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
        promo =  response.text;
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
                      phone = response.text;
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
      recap = "Adresse 🏡 : " + adresse + "\nQuand ⏰ : "+ heure_livraison + "\nObjet : " + panier + "\nCode promo 💵 : " + promo + "\nTéléphone : " +phone;
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

    var order_to_database = function (id) {
          graph.get(id, function(err, res) {
            var mongoose = require('mongoose');
            var fake_id = mongoose.Types.ObjectId();
            nom = res.first_name + " "+res.last_name; 
            date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
            controller.storage.teams.save({id : fake_id, created_at: date, name : nom, adresse : adresse, when : heure_livraison, panier: panier, promo : promo})// { id: '4', name: 'Mark Zuckerberg'... }
          });

    }

    var confirmer = function(response, convo) {
      
      order_to_database(message.user);
      botslack.say(
                    {

                                      
                    "text": recap,
                    "attachments": [
                        {
                            "text": "Que faire",
                            "fallback": "trop tard",
                            "callback_id": "wopr_game",
                            "color": "#3AA3E3",
                            "attachment_type": "default",
                            "replace_original":"false",
                            "actions": [
                                {
                                  "name": "recommend",
                                  "value": "yes",
                                  "type": "button"
                                }
                              ],
                              "callback_id": "comic_1234_xyz",
                              "team": {
                                "id": "T47563693",
                                "domain": "watermelonsugar"
                              },
                              "channel": {
                                "id": "C065W1189",
                                "name": "forgotten-works"
                              },
                              "user": {
                                "id": "U045VRZFT",
                                "name": "brautigan"
                              },
                              "action_ts": "1458170917.164398",
                              "message_ts": "1458170866.000004",
                              "attachment_id": "1",
                              "token": "xAB3yVzGS4BQ3O9FACTa8Ho4",
                              "original_message": {"text":"New comic book alert!","attachments":[{"title":"The Further Adventures of Slackbot","fields":[{"title":"Volume","value":"1","short":true},{"title":"Issue","value":"3","short":true}],"author_name":"Stanford S. Strickland","author_icon":"https://api.slack.comhttps://a.slack-edge.com/bfaba/img/api/homepage_custom_integrations-2x.png","image_url":"http://i.imgur.com/OJkaVOI.jpg?1"},{"title":"Synopsis","text":"After @episod pushed exciting changes to a devious new branch back in Issue 1, Slackbot notifies @don about an unexpected deploy..."},{"fallback":"Would you recommend it to customers?","title":"Would you recommend it to customers?","callback_id":"comic_1234_xyz","color":"#3AA3E3","attachment_type":"default","actions":[{"name":"recommend","text":"Recommend","type":"button","value":"recommend"},{"name":"no","text":"No","type":"button","value":"bad"}]}]},
                              "response_url": "https://glacial-refuge-61166.herokuapp.com/webhook"
                                                    }
                        ],
                      channel: 'C4H5ARUCW',
                       // a valid slack channel, group, mpim, or im ID
                    }
                  );
      convo.say("Votre commande a été envoyé à nos taskers :)");     
      convo.next();
    };

    var ask_service = function(response, convo) {
      convo.ask({
                  'text': "Quel service souhaites-tu ?",
                  'quick_replies': [
                                                      {
                          'type': 'postback',
                          'title': 'Laverie 👕',
                          'payload': 'Laverie 👕'
                      },
                                                      {
                          'type': 'postback',
                          'title': 'Autre',
                          'payload': 'Autre'
                      }
                  ]
              
        }, function(response, convo) {
              switch(response.text) {
                case 'Laverie 👕':
                  laverie(response, convo);
                  convo.next();
                    break;
                case 'Autre':
                  convo.say("Je t'écoute 👀");
                  help(response, convo);
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
                  ask_service(response, convo);
                  convo.next();
            }
      });
    };    

    var laverie = function(response, convo) {
      convo.say("Tarifs : \n12€ = 1 sac 🎒 \n16€ =  2 sacs 🎒🎒 \n21€ = 3 sacs 🎒🎒🎒\n*1 sac : l’équivalent d'un sac de course de 3 à 5 kilos\nLes tarifs comprennent le coût de la machine, le sèche linge, les produits et le prix du service Timy");
      //convo.say("Nous ne trions pas le linge. Tout est lavé à 40°, avec une lingette anti décoloration. ");
      convo.ask({
                  'text': "La laverie, c’est tous les mercredis sur le campus & tous les jeudis en centre ville. Quel jour souhaites-tu réserver ? 📅",
                  'quick_replies': [
                                                      {
                          'type': 'postback',
                          'title': 'Mercredi',
                          'payload': 'Mercredi'
                      },
                                                      {
                          'type': 'postback',
                          'title': 'Jeudi',
                          'payload': 'Jeudi'
                      }
                  ]
              
        }, function(response, convo) {
              switch(response.text) {
                case 'Mercredi':
                  //convo.say("Mercredi devant l'IAE à 13h ?");
                  j_laverie(response, convo, 'Mercredi');
                  convo.next();
                    break;
                case 'Jeudi':
                  //convo.say("Jeudi devant GEM à 13h ?");
                  j_laverie(response, convo, 'Jeudi');
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
                  laverie(response, convo);
                  convo.next();
            }
      });
    };

    var j_laverie = function(response, convo, day) {
      if(day=='Mercredi'){
                texte = "☐ Dépose à 9h arrêt Bibliothèque Université (B et C) et récupération à 13h\n☐ Dépose à 9h30 les Taillés Université et récupération à 13h30"
          }else{
                texte = "☐ Dépose à 9h arrêt Saint Bruno ( A et B ) et récupération à 13h\n☐ Dépose à 9h30 arrêt Victor Hugo ( A et B ) et récupération à 13h30"
          }
      convo.ask(
      {
                  'text': texte,
                  'quick_replies': [
                                        {
                          'type': 'postback',
                          'title': '9h',
                          'payload': '9h'
                      },
                                                      {
                          'type': 'postback',
                          'title': '9h30',
                          'payload': '9h30'
                      }
                  ]

        }, function(response, convo) {
              switch(response.text) {
                case '9h':
                  telephone_laverie(response, convo , day , '9h');
                  convo.next();
                    break;
                case '9h30':
                  telephone_laverie(response, convo , day, '9h30');
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

  var telephone_laverie = function(response, convo, day, heure) {
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
                      phone = response.text;
                      recap_laverie(response, convo, day, heure);
                  }else{
                      convo.say("Je n'ai pas compris");
                      telephone_laverie(response, convo);
                  }

        convo.next();
        }
      });

    };

    var recap_laverie = function(response, convo, day, heure) {
      if(day =='mercredi'){
        resa = moment().day(10).format('dddd Do MMMM');
      }else{
        resa = moment().day(11).format('dddd Do MMMM');

      }
      convo.say('Récapitulatif de ta commande : Laverie à ' +heure+ ' le '+resa+"\nTéléphone : "+phone);
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
                          'title': 'Annuler',
                          'payload': 'annuler'
                      }
                  ]

        }, function(response, convo) {
              switch(response.text) {
                case 'Annuler':
                  annuler(response, convo);
                  convo.next();
                    break;
                case 'Confirmer':
                  confirmer_laverie(response, convo, day , heure, resa);
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
                  recap_laverie(response, convo);
                  convo.next();
            }
      });
    };

  var confirmer_laverie = function(response, convo, day, heure, resa) {

      
      graph.get(message.user, function(err, res) {
         nom = res.first_name + " "+res.last_name; 
         laverie_to_database(nom, day, heure);
                  botslack.say(
                    {
                      text: "une laverie a été reservé par "+ nom +" le " +resa+" à "+heure+"\n Telephone :"+phone,
                      channel: 'C4H5ARUCW',
                       // a valid slack channel, group, mpim, or im ID
                    }
                  );


      });
      
      convo.say("Votre laverie a été envoyé à nos taskers :)"); 
      convo.say("Infos complémentaires: Nous ne trions pas le linge. Tout est lavé à 40°, avec une lingette anti décoloration.");    
      convo.next();

  }


      var laverie_to_database = function (nom, day, heure) {
            var mongoose = require('mongoose');
            var fake_id = mongoose.Types.ObjectId();
            date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

            switch(day) {
                case 'Mercredi':
                resa = moment().day(10).format('dddd Do MMMM')
                  if(heure=='9h'){
                      lieu = "Campus - Bibliothèque"
                  }else{
                      lieu = "Campus - Taillés"
                  }
                    break;
                case 'Jeudi':
                resa = moment().day(11).format('dddd Do MMMM')
                if(heure=='9h'){
                    lieu = "Centre ville - Saint Bruno"
                  }else{
                    lieu = "Centre ville - Victor Hugo"

                  }
                   break;
            }
            controller.storage.channels.save({id : fake_id, name : nom, created_at: date, lieu : lieu, when : resa +" à " +heure, tel:phone})// { id: '4', name: 'Mark Zuckerberg'... }
    }





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



  })

 controllerslack.on('interactive_message_callback', function(botslack, message) {
         var reply =   {
            text: 'cool',
            channel: G4GEQBJ9Y,
             // a valid slack channel, group, mpim, or im ID
          }
  bot.say(message, reply);



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
