
/**
 * Copyright 2016 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var Botkit = require('botkit');
const Config = require('./bdconfig.js');

var oracledb = require('oracledb');

var controller = Botkit.facebookbot({
  log: true,
  stats_optout: true,
  debug: Config.debug,
  require_delivery: true,
  validate_requests: true,
  app_secret: process.env.FB_APP_SECRET,
  access_token: process.env.FB_ACCESS_TOKEN,
  verify_token: process.env.FB_VERIFY_TOKEN
});

var bot = controller.spawn();
///////////////////////


controller.api.nlp.enable();


/**
 *greeting permet d’indiquer le message de bienvenue que les personnes recevront sur l’écran d’accueil de votre bot.
 * Set greeting text for the bot.
 * @param {string} greeting - greeting text
 */
function setGreeting(greeting) {
  controller.api.messenger_profile.greeting(greeting);
}
/**
 * Get the messenger user's facebook profile
  @param {string} fbMessengerId 
  @return {promise} 
 */
function getFacebookProfile(fbMessengerId) {
  return controller.api.user_profile(fbMessengerId);
  //console.log("dddddddddddddddddddddddddddddddddddddddddddd"+ ' '+ getFacebookProfile(fbMessengerId));

}


/**
 * Set the payload for the get started button.
 * @param {string} getStartedPayload - payload string
 * button is clicked
 */
function setGetStarted(getStartedPayload) {
  controller.api.messenger_profile.get_started(getStartedPayload);
}



/**
* Start an express webserver for the bot.
* @param {object} bot1 - A bot object created by botkit
* @param {function} cb - A callback function to define routes
* @example
*/
//////////////////////////////////////////////////////////////////////////////////::: db
//var mcounter=0;
//var authentic=false;
function dbreqKey(msgtext){
var req=  `SELECT NOM_PRENOM,DATE_DEM,STATUT_INACTIF,ACTIVE FROM TRANSACTIONS where KEY =`+"'"+msgtext.text+"'";
//var req1=  `SELECT  MAIL  FROM TRANSACTIONS where KEY =`+"'"+msgtext.text+"'";

console.log(req);
//console.log(req1); 
oracledb.getConnection(
  {
    user          : Config.user,
    password      : Config.password,
    connectString : Config.connectString
  },
 
  function(err, connection) {
    if (err) {
      console.error(err.message);
      return;
    }
    connection.execute(
      // The statement to execute
      req,

      // The callback function handles the SQL execution results
      function(err, result) {
        if (err) {
          console.error(err.message+'*');
          doRelease(connection);
          return;
        }else{
          ///////////////////// req OK ---------------->>
          console.log('result')
          console.log(result)

          if(result.rows.length==0)
          {mcounter=0;
            console.log('Key error');
            bot.reply(msgtext, 'merci de bien vouloir vérifier votre code reçu dans votre boite email !!!');
            
          }
          else
          {
            authentic=true;
            
            ///////::::::::::::::::::::: compaire dates
            ///////:::::::::::::::: date system
           
            if(result.rows[0][1]!=null)
            {
                var rowOne=dateConvms(result.rows[0][1]);

            }else
            {
                var rowOne=0;
            }
            if(result.rows[0][2]!=null)
            {
                var rowTwo=dateConvms(result.rows[0][2]);

            }else
            {
                var rowTwo=0;
            }
            if(result.rows[0][3]!=null)
            {
                var rowThree=dateConvms(result.rows[0][3]);

            }else
            {
                var rowThree=0;
            }
            
            ///////::::::::::::::::
            var str='';
            if (result.rows[0][2] == dateSystem())
            { str='Bonjour Mr/Mme, votre carte est disponible chez votre agence.';}
          
//console.log(( sysDates -  rowFives )/( 2*24*3600*1000) )

            else if ((  dateConvms(dateSystem()) -  rowTwo == 2*24*3600*1000) && (result.rows[0][3] == null))
            { str='Bonjour Mr/Mme  '+result.rows[0][0]+',  Je vous rappel que votre carte est disponible chez votre agence. Merci de la récupérer.';}
            
            else if (result.rows[0][3] == dateSystem())
            { str='Bonjour Mr/Mme'+result.rows[0][0]+', je vous remercie pour la récupération de votre carte.';}
            ///condition true  srt='Bonjour Mr/Mme, Je vous rappel que votre carte est disponible chez votre agence. Merci de la récupérer.';
            /////:::::::::::::::
            bot.reply(msgtext, 'Votre code est valide, '+'\n Vous avez le Bienvenu '+result.rows[0][0]+', et merci de me contacter, si vous avez des problèmes.');
            
            bot.reply(msgtext,str);
            console.log('Key success');          }
          //console.log(result.rows[0][0]==);
          
          
          doRelease(connection,);
        }
      });
    }); }
////::::::::::::::::::::::::::::
function doRelease(connection) {
  connection.close(
    function(err) {
      if (err) {
        console.error(err.message);
      }
    });
}
//--------------------------------------date system--------------------------------
function dateSystem(){
var today = new Date();
//console.log(today );
var dd = today.getDate();
var mm = today.getMonth()+1; 
var yyyy = today.getFullYear();
if(dd<10){
    dd='0'+dd;
} 
if(mm<10){
    mm='0'+mm;
} 
var sysDate = dd+'/'+mm+'/'+yyyy;
return(sysDate);
}  
//--------------------- conversion date en milliseconde----------------------------
function dateConvms(sysDate){
  return(new Date(sysDate.split('/')[2],(parseFloat(sysDate.split('/')[1])-1),(parseFloat(sysDate.split('/')[0])+1)).getTime());
}            
//-------------------------------------------------------------------------------------------------------------

//////////////////////////////////////////////////////////////////////////////////////::://:
function start(bot1, cb) {
  controller.setupWebserver(Config.PORT, (err, webserver) => {
    if (Config.sentryDSN) {
      webserver.use(Logger.sentry.requestHandler());
    }
    cb(err, webserver);
    controller.createWebhookEndpoints(webserver, bot, () => {
      Logger.log('info', 'Your borq bot is online');
    });
    if (Config.sentryDSN) {
      webserver.use(Logger.sentry.errorHandler());
    }
  });
  controller.startTicking();
}
var mcounter=0;
var authentic=false;
controller.hears('test', 'message_received', function(bot, message) {

  var attachment = {
      'type':'template',
      'payload':{
          'template_type':'generic',
          'elements':[
              {
                  'title':'Chocolate Cookie',
                  'image_url':'http://cookies.com/cookie.png',
                  'subtitle':'A delicious chocolate cookie',
                  'buttons':[
                      {
                      'type':'postback',
                      'title':'Eat Cookie',
                      'payload':'chocolate'
                      }
                  ]
              },
          ]
      }
  };

  bot.reply(message, {
      attachment: attachment,
  });

});

controller.on('facebook_postback', function(bot, message) {

  if (message.payload == 'chocolate') {
      bot.reply(message, 'You ate the chocolate cookie!')
  }

});
/*controller.hears('(.*)', 'message_received', function(bot, message) {
  console.log('hears');
  console.log(message);

  if (message.watsonError) {
    console.log(message.watsonError);
    bot.reply(message, message.watsonError.description || message.watsonError.error)
  } else if (message.watsonData && 'output' in message.watsonData) {
    mcounter++;
    console.log('mcounter '+ mcounter);
    if(mcounter==1){
      console.log('counter watson');
      dbreqKey(message);
      //console.log(message.text);
    }
    console.log('authentic');
    console.log(authentic);
   if(authentic){ bot.reply(message, message.watsonData.output.text.join('\n'));}
   // console.log ("jjjjjjjjjjjjjjjjjjjj");
    } else {
    console.log('Error: received message in unknown format. (Is your connection with Watson Conversation up and running?)');
    bot.reply(message, "I'm sorry, but for technical reasons I can't respond to your message");
    
  }
console.log("gggg");

});*/

module.exports = {
  setGetStarted,
  getFacebookProfile,
  setGreeting,
  start,
};


module.exports.controller = controller;
module.exports.bot = bot;
