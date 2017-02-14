/* eslint-disable brace-style */
/* eslint-disable camelcase */
var facebook_handler = require('../controllers/botkit').handler

module.exports = function (app) {
  // public pages=============================================
  // root
  app.get('/', function (req, res) {
    res.render('home')
  })

  app.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === "my_voice_is_my_password_verify_me") {
      res.send(req.query['hub.challenge']);
    } else {
      res.send('Error, wrong validation token');    
    }
  })

  app.post('/webhook', function (req, res) {
    facebook_handler(req.body)

    res.send('ok')
  })
}
/* eslint-disable brace-style */
/* eslint-disable camelcase */
