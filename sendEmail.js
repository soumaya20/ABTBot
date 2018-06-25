var nodemailer = require('nodemailer');

/////////////////////////////////////////////
var oracledb = require('oracledb');
var dbConfig = require('./bdconfig.js');
setInterval(function(){
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
var req=`SELECT MAIL,KEY, NOM_PRENOM FROM TRANSACTIONS where DATE_DEM=`+"'"+sysDate+"'";
console.log(req)
// Get a non-pooled connection
oracledb.getConnection(
  {
    user          : dbConfig.user,
    password      : dbConfig.password,
    connectString : dbConfig.connectString
  },
 
  function(err, connection) {
    if (err) {
      console.error(err.message);
      return;
    }
      
    //---------------------------------------------------------
    connection.execute(
      // The statement to execute
     
      req,

      // The callback function handles the SQL execution results
      function(err, result) {
        if (err) {
          console.error(err.message);
          doRelease(connection);
          return;
        }else{
          ///////////////////// req OK ---------------->>
          console.log(result);
          result.rows.forEach(function(element,index) {
            console.log(element[0],element[1],element[2]);
            /////////:::::::::::::::: generate key
            ////////::::::::::::update key where mail= element[0]
            //sendMailTo(element[0],'key');
            sendMailTo(element[0],element[1],element[2]);
          });
          doRelease(connection,);
        }

     // console.log(result.metaData);
      //  console.log(result.rows[4][4]);     
  //-----------------------------------------
      
  //-----------------------------------------

        
        
      });
    }); 
////::::::::::::::::::::::::::::
function doRelease(connection) {
  connection.close(
    function(err) {
      if (err) {
        console.error(err.message);
      }
    });
}


/////////////////////////////////////////////

function sendMailTo(add,ky,nom){
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'abtchatbot@gmail.com',
      pass: 'abt12345'
    }
  });
var mailOptions = {
  
  from: 'abtchatbot@gmail.com',
  to: add,
  subject: 'Attijari Bot : Votre chargé en ligne',
  html: '<div><b>Bonjour Mr/Mme '+nom+', je suis votre chargé en ligne après-vente.\n </b></div>'+
  '<div>&nbsp;</div>'+
  '<div><b>Je vous remercie de cliquer sur le bouton ci-dessous pour accéderà notre page facebook. \n</b></div>'+
  '<div>&nbsp;</div>'+
  '<div><b>Votre Cle est:'+ky +'\n</b>'+
  '<div>&nbsp;</div>'+
  '</div><div> <a href="https://web.facebook.com/Attijari-Samo_bot-206946606780395/" >'+
  '<style>.button:{background-color: #00008B}</style>'+
  '<button class="button"><h3> Cliquer ici </h3> </button></a></div>' 

  //html: '<div>Votre Cle est:'+ky +'</div><div class="myBox" > <a href="https://www.facebook.com/////ABT-SaMo_Bot-311230259409917/?modal=admin_todo_tour" ><button style="background-color:lightblue"><h3> Link </h3> </button></a></div>' 
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
}
},05*1000); ////60:sec *1000 mellis