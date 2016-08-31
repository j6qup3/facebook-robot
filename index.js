var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen((process.env.PORT || 3000));

// Server frontpage
app.get('/', function (req, res) {
    res.send('This is TestBot Server');
});

// Facebook Webhook
app.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === '378815') {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Invalid verify token');
    }
});

app.post('/webhook', function (req, res) {

  console.log(req.body);

  var messaging_events = req.body.entry[0].messaging;
  for (var i = 0; i < messaging_events.length; i++) {
    var event = req.body.entry[0].messaging[i];
    var sender = event.sender.id;
    if (event.message && event.message.text) {
      var text = event.message.text;
      sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200));
    }
  }
  res.sendStatus(200);
});

function sendTextMessage(sender, text) {

  var messageData = {
    text: text
  };

  (0, _request2.default)({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {
      access_token: 'EAAChxz0eOssBAPJZCQZAx93U97XBdvAMsVgNnWTstzplVTvfZBK7UpwyW39zwzXhZAkDmSZBwAz1ZBbSnZBTYc9ayDpgT02SXSMNTvtiX8zyxyyNl92J7bGrU8mHuf6iz1ihJcRZAZCgOqKcHS4heAzScvoWNZAhEwyeSI0tgcbKit1wZDZD'
    },
    method: 'POST',
    json: {
      recipient: {
        id: sender
      },
      message: messageData
    }
  }, function (error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}
