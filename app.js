/**
 * Copyright 2016 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License atb
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

 
require('dotenv').load();
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
//var sendMail = require('sendEmail');


//------------------ Déclencheure ---------------------------------------
const facebook = require('./bot-facebook.js');
//var server = require('./server.js');


const {controller} = facebook;
const botty = controller.spawn({});


facebook.setGetStarted('start');

facebook.setGreeting('Bonjour Mme/Mr {{user_full_name}} , je suis votre charger bancaire après-vente, Je suis là pour vous accompagner!');

controller.on('facebook_postback', (bot1, message) => {
  console.log('postback');
  if (message.payload === 'start') {
    bot1.startConversation(message, (err, convo) => {
      convo.addMessage('Bonjour Mme/Mr {{user_full_name}} , je suis votre charger bancaire après-vente, Je suis là pour vous accompagner!'+'\n\nAvant de commencer, merci de saisir le code que vous avez reçu par e-mail.');
    });
  } else {
    bot1.startConversation(message, (err, convo) => {
      convo.addMessage('Hello, you added a postback?');
    });
  }});

 /* controller.hears(['talk'],
                 'message_received',
                 (bot1, message) => {
                   bot1.startConversation(message, (err, convo) => {
                     convo.addQuestion('Say something',
                                       (res, con) => con.next());
                     convo.addQuestion('Ok bye', (res, con) => con.next());
                   });
                 });*/

        /*         const myBot = facebook.controller.spawn({});
facebook.start(myBot, (err, webserver) => {
  webserver.get('/', (req, res) => {
    res.send('<h3>This is a bot</h3>');
  });
  webserver.get('/other', (req, res) => {
    res.send('<h3>This is a bot at route /other</h3>');
  });
});*/

                
                /*app.listen(5000, function () {
                  console.log('Dev app listening on port 5000!');
                });  */             


//----------------------------------------------------
var errorCounter=0;
mongoose.connect('mongodb://localhost/ABTBot');

const Botmsg = mongoose.model('ChatBot', {
 
  idConversation: {
    type: String,
    required: true
  },
  idSender: {
    type: String
  },
  idRecipient: {
    type: String
  },
  inputMessage: {
    type: String
  },
  reponse: {
    type: String,
    required: true
  },
  TimesTampmsg: {
    type: Number
  }
  //conversation status : responded / no
});





/*//Map global promise - get rid of warning
mongoose.Promise = global.Promise;

//Connect to mongoose
mongoose.connect('mongodb://localhost:27017/ABTBot');
var db = mongoose.connection;

//check for connection
db.once('open', function(){
  console.log('BD connected..');
});

 //check for db errors
 db.on('error',function(err){
   console.log(err);
 });*/

var middleware = require('botkit-middleware-watson')({
  username: process.env.CONVERSATION_USERNAME,
  password: process.env.CONVERSATION_PASSWORD,
  workspace_id: process.env.WORKSPACE_ID,
  url: process.env.CONVERSATION_URL || 'https://gateway.watsonplatform.net/conversation/api',
  version_date: '2017-05-26'
});

module.exports = function(app) {
  if (process.env.USE_SLACK) {
    var Slack = require('./bot-slack');
    Slack.controller.middleware.receive.use(middleware.receive);
    Slack.bot.startRTM();
    console.log('Slack bot is live');
  }
  if (process.env.USE_FACEBOOK) {
    var Facebook = require('./bot-facebook');
    Facebook.controller.middleware.receive.use(middleware.receive);
    Facebook.controller.createWebhookEndpoints(app, Facebook.bot);
    console.log('Facebook bot is live');
  }
  if (process.env.USE_TWILIO) {
    var Twilio = require('./bot-twilio');
    Twilio.controller.middleware.receive.use(middleware.receive);
    Twilio.controller.createWebhookEndpoints(app, Twilio.bot);
    console.log('Twilio bot is live');
  }
  
//--------------------------------------------
  //const mongoose = require('mongoose');
  //const bcrypt = require('bcryptjs');

  // appel connex Mongodb
  const config = require('./connexMongo');

/*
  mongoose.connect(config.database, { useMongoClient: true});
  // mongoose.connect(config.connectionString , { useMongoClient: true});
  //On Connection
  mongoose.connection.on('connected', () => {
      console.log('connected to db '+ config.database);
      // console.log('connected to es '+ config.connectionString);
    });
    */
    //On error
    mongoose.connection.on('error', (err) => {
      console.log('Database error: '+err);
    });

    
  

  // Customize your Watson Middleware object's before and after callbacks.
  middleware.before = function(message, conversationPayload, callback) {
    console.log("the message is ------------------------------------");
    console.log(message); 
   // message = "fjkbbbbffj";
    callback(null, conversationPayload);
  
}
middleware.before(' ', 'conversationPayload',function(){});
middleware.after = function(message, conversationResponse, callback) {
    console.log("the response is  is ------------------------------------");
    console.log(conversationResponse); 
    console.log("je suis input ------------------------------------");
    console.log(conversationResponse.input);
    console.log("je suis output ------------------------------------");
    console.log(conversationResponse.output);
    conversationResponse.output.message = "fjkffj";
    console.log(conversationResponse.output.message);
    conversationResponse.message ="test message";
    
  // console.log('after');
    //console.log('hello soumaya '+'  '+ callback);
////////
var t={
  idConversation:conversationResponse.context.conversation_id,
  idSender: message.sender.id,
  idRecipient: message.recipient.id,
  inputMessage: conversationResponse.input.text,
  reponse: conversationResponse.output.text,
  TimesTampmsg: message.timestamp,
  
}
/////////////////// eMailing
///////////////////////////
if((conversationResponse.output.text=="Je n'ai pas compris; pouvez-vous paraphraser !")||(conversationResponse.output.text=="Pouvez-vous reformuler votre déclaration? je ne comprends pas")||(conversationResponse.output.text=="J'ai du mal à vous comprendre.")){
  console.log(errorCounter);
  if(errorCounter==2){sendMail(JSON.stringify(message));
    errorCounter=0;}else{errorCounter++;}
}else{
  errorCounter=0;
}

/////////////////
const ABT = new Botmsg(t);
ABT.save().then(() => console.log('messages saved'));
console.log("finish");

callback(null, conversationResponse);
  }
};


function sendMail(msg){
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'abtchatbot@gmail.com',
    pass: 'abt12345'
  }
});

var mailOptions = {
  
  from: 'abtchatbot@gmail.com',
  to: 'soumaya.bentaleb@esprit.tn',
  subject: 'Sending Email using Node.js',
  //text: 'https://www.facebook.com/ABT-SaMo_Bot-311230259409917/?modal=admin_todo_tour'
  text:msg
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
}
/*
function handleHelloEvent(bot, message) {
  message.type = 'welcome';
  var contextDelta = {};

  if (message.workspaceId) {
      contextDelta.WORKSPACE_ID = message.workspaceId;
  }

  watsonMiddleware.sendToWatsonAsync(bot, message, contextDelta).catch(function (error) {
      message.watsonError = error;
  }).then(function () {
      bot.reply(message, message.watsonData.output.text.join('\n'));
  });
}
controller.on('hello', handleHelloEvent);*/