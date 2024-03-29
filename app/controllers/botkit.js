/* eslint-disable brace-style */
/* eslint-disable camelcase */
// CONFIG===============================================
/* Uses the slack button feature to offer a real time bot to multiple teams */
var Botkit = require('botkit')
var graph = require('fbgraph');
var mongoUri = process.env.MONGODB_URI || 'mongodb://localhost/botkit-demo'
var db = require('../../config/db')({mongoUri: mongoUri})

var controller = Botkit.facebookbot({
  debug: false,
  access_token: "",
  verify_token: "",
  storage: db
})

var bot = controller.spawn({})

var controllerslack = Botkit.slackbot({
    //debug: true,
});

var botslack = controllerslack.spawn({
    token: "xoxb-153212029911-LpKqJu6PLxYnnwAzG7eXzHWo"
  }).startRTM();


// SETUP
require('./facebook_setup')(controller)
var fb_token = ""
graph.setAccessToken(fb_token);


// Conversation logic
require('./conversations')(controller, controllerslack)

// this function processes the POST request to the webhook
var handler = function (obj) {
  console.log(obj);

  controller.debug('Message received from FB')
  var message
  if (obj.entry) {
    for (var e = 0; e < obj.entry.length; e++) {
      for (var m = 0; m < obj.entry[e].messaging.length; m++) {
        var facebook_message = obj.entry[e].messaging[m]

        console.log(facebook_message)

        // normal message
        if (facebook_message.message) {
          message = {
            text: facebook_message.message.text,
            user: facebook_message.sender.id,
            channel: facebook_message.sender.id,
            timestamp: facebook_message.timestamp,
            seq: facebook_message.message.seq,
            mid: facebook_message.message.mid,
            attachments: facebook_message.message.attachments
          }

          // save if user comes from m.me adress or Facebook search
          create_user_if_new(facebook_message.sender.id, facebook_message.timestamp)

          controller.receiveMessage(bot, message)
        }
        // When a user clicks on "Send to Messenger"
        else if (facebook_message.optin ||
                (facebook_message.postback && facebook_message.postback.payload === 'optin')) {
          message = {
            optin: facebook_message.optin,
            user: facebook_message.sender.id,
            channel: facebook_message.sender.id,
            timestamp: facebook_message.timestamp
          }

            // save if user comes from "Send to Messenger"
          create_user_if_new(facebook_message.sender.id, facebook_message.timestamp)

          controller.trigger('facebook_optin', [bot, message])
        }
        // clicks on a postback action in an attachment
        else if (facebook_message.postback) {
          // trigger BOTH a facebook_postback event
          // and a normal message received event.
          // this allows developers to receive postbacks as part of a conversation.
          message = {
            payload: facebook_message.postback.payload,
            user: facebook_message.sender.id,
            channel: facebook_message.sender.id,
            timestamp: facebook_message.timestamp
          }

          controller.trigger('facebook_postback', [bot, message])

          message = {
            text: facebook_message.postback.payload,
            user: facebook_message.sender.id,
            channel: facebook_message.sender.id,
            timestamp: facebook_message.timestamp
          }

          controller.receiveMessage(bot, message)
        }
        // message delivered callback
        else if (facebook_message.delivery) {
          message = {
            optin: facebook_message.delivery,
            user: facebook_message.sender.id,
            channel: facebook_message.sender.id,
            timestamp: facebook_message.timestamp
          }

          controller.trigger('message_delivered', [bot, message])
        }
        else {
          controller.log('Got an unexpected message from Facebook: ', facebook_message)
        }
      }
    }
  }else if(obj.payload){
    message = JSON.parse(obj.payload)
    console.log(message);
    console.log(message.actions);
        if(message.actions){
          console.log("action reçue");
          controllerslack.trigger('interactive_message_callback', [botslack, message]);
        }
        
    }

  
}

var create_user_if_new = function (id, ts) {
  controller.storage.users.get(id, function (err, user) {
    if (err) {
      console.log(err)
    }
    else if (!user || !user.name) {
      graph.get(id, function(err, res) {
        nom = res.first_name + " "+res.last_name; 
        date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        controller.storage.users.save({id: id, name : nom, created_at: date})// { id: '4', name: 'Mark Zuckerberg'... }
      });
      //controller.storage.users.save({id: id, created_at: ts})
    }

  //controller.storage.users.update({id: id}, {$set: { some_key : new_info  }})
  })
}

exports.handler = handler
/* eslint-disable brace-style */
/* eslint-disable camelcase */
