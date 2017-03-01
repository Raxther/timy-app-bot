/* eslint-disable brace-style */
/* eslint-disable camelcase */
var Request = require('request')

module.exports = function (controller) {
  // subscribe to page events
  Request.post('https://graph.facebook.com/me/subscribed_apps?access_token=' + "EAAKN23HlGKYBAIiXff8RDSsGiwAu6SorJGttfqsFcPIwzOGokvaA8srCkMyvM3XjIjHZAWVhdZB5qjXoz3wWc3EDWZBZCsurVsUqpWhdm3RmFsJ5HnZAzTTKyx31HzN4n0At5NZB2SqxOvpt3GXZCM0GSPaeb4ixoourY83OGjn9AZDZD",
    function (err, res, body) {
      if (err) {
        controller.log('Could not subscribe to page messages')
      }
      else {
        controller.log('Successfully subscribed to Facebook events:', body)
        console.log('Botkit can now receive messages')

        // start ticking to send conversation messages
        controller.startTicking()
      }
    })

  var url = 'https://graph.facebook.com/v2.8/me/thread_settings?access_token=' + "EAAKN23HlGKYBAIiXff8RDSsGiwAu6SorJGttfqsFcPIwzOGokvaA8srCkMyvM3XjIjHZAWVhdZB5qjXoz3wWc3EDWZBZCsurVsUqpWhdm3RmFsJ5HnZAzTTKyx31HzN4n0At5NZB2SqxOvpt3GXZCM0GSPaeb4ixoourY83OGjn9AZDZD"

  // set up CTA for FB page
  var form1 = {
    'setting_type': 'call_to_actions',
    'thread_state': 'new_thread',
    'call_to_actions': [
      {
        'payload': 'optin'
      }
    ]
  }

  Request.post(url, {form: form1}, function (err, response, body) {
    if (err) {
      console.log(err)
    }
    else {
      console.log('CTA added', body)
    }
  })

  // set up persistent menu
  var form2 = {
    'setting_type': 'call_to_actions',
    'thread_state': 'existing_thread',
    'call_to_actions': [
      {
        'type': 'postback',
        'title': "Demander l'aide d'un humain",
        'payload': 'humain'
      },
      {
        'type': 'postback',
        'title': 'Redémarrer le bot',
        'payload': 'reboot'
      },
      {
        'type': 'postback',
        'title': 'Annuler',
        'payload': 'cancel'
      }
    ]
  }

  Request.post(url, {form: form2}, function (err, response, body) {
    if (err) {
      console.log(err)
    }
    else {
      console.log('permanent menu added', body)
    }
  })

  // set up greetings
  var form3 = {
    'setting_type': 'greeting',
    'greeting': {
      'text': 'Bienvenue sur le chatbot de timy :) Appuyer sur démarrer pour passer commande !'
    }
  }

  Request.post(url, {form: form3}, function (err, response, body) {
    if (err) {
      console.log(err)
    }
    else {
      console.log('greetings added', body)
    }
  })
}

/* eslint-disable brace-style */
/* eslint-disable camelcase */
