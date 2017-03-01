/* eslint-disable brace-style */
/* eslint-disable camelcase */
var Request = require('request')

module.exports = function (controller) {
  // subscribe to page events
  Request.post('https://graph.facebook.com/me/subscribed_apps?access_token=' + "EAAKN23HlGKYBAHMVsu8TZCfNEIiSCYuK6Tsa8wkwBG3KZBbygJLsnFkHakqsiwRrZCsoULPyKhDZCnSUFZC0tYuJAdndalIjrL0CVwgWjQs0MhboFGlGFjmuDQrz9IxgCDlcbnsLgth9TVWX8AxTsw3ZABIANDYojN5NvR0yhebAZDZD",
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

  var url = 'https://graph.facebook.com/v2.6/me/thread_settings?access_token=' + "EAAKN23HlGKYBAFjRsiyn6DVqj40GnXpIAvXN1BYWZCyAgRgJyaM5IRusf8gCbYGJZApToTZBq3xuWJ1HveZAfNb410KamhWh3mbNCrujJXMTlZAP5K8zvhDUeTcwAdpiRSTTi4RoDAQVSaV7woT0CZBrtJyDEHujEy9p7QxhMjYwZDZD"

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
