var oracledb = require('oracledb');
var dbConfig = require('./bdconfig.js');

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
      `SELECT *
       FROM TRANSACTIONS`,

      // The callback function handles the SQL execution results
      function(err, result) {
        if (err) {
          console.error(err.message);
          doRelease(connection);
          return;
        }
     // console.log(result.metaData);
      //  console.log(result.rows[4][4]);     
  //-----------------------------------------
      function transac (tab)
        {
           // var sysDate = (Date.now()).toString();
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
            //console.log(sysDate);
            //console.log(new Date(sysDate.split('/')[2],(parseFloat(sysDate.split('/')[1])-1),(parseFloat(sysDate.split('/')[0])+1)).getTime());
            for (var i = 0; i < tab.rows.length; i++)
                {
                    var sysDates=new Date(sysDate.split('/')[2],(parseFloat(sysDate.split('/')[1])-1),(parseFloat(sysDate.split('/')[0])+1)).getTime();
                   // console.log(sysDates);
                   //statut inactif
                    if(tab.rows[i][5]!=null)
                        {
                            var rowFives=new Date(tab.rows[i][5].split('/')[2],(parseFloat(tab.rows[i][5].split('/')[1])-1),(parseFloat(tab.rows[i][5].split('/')[0])+1)).getTime();
                            //console.log(rowFives);

                        }
                    else
                        {
                            var rowFives=0;
                        }
                        if(tab.rows[i][6]!=null)
                        {
                            var rowSixs=new Date(tab.rows[i][6].split('/')[2],(parseFloat(tab.rows[i][6].split('/')[1])-1),(parseFloat(tab.rows[i][6].split('/')[0])+1)).getTime();
                            //console.log(rowFives);

                        }
                    else
                        {
                            var rowSixs=0;
                        }
                        if(tab.rows[i][7]!=null)
                        {
                            var rowSevens=new Date(tab.rows[i][7].split('/')[2],(parseFloat(tab.rows[i][7].split('/')[1])-1),(parseFloat(tab.rows[i][7].split('/')[0])+1)).getTime();
                            //console.log(rowFives);

                        }
                    else
                        {
                            var rowSevens=0;
                        }
                    //console.log(tab.rows[i][4] +' '+ tab.rows[i][5]+' '+ tab.rows[i][6]+' '+ tab.rows[i][7]+' '+ tab.rows[i][8]);
                    //console.log (sysDate);
                    if (sysDate == tab.rows[i][4])
                    { console.log('Bonjour Mr/Mme, Je suis votre chargé en ligne de service après vente, je suis là pour vous accompagner');}

                    else if (tab.rows[i][5] == sysDate)
                    { console.log('Bonjour Mr/Mme, votre carte est disponible chez votre agence.');}
                  
//console.log(( sysDates -  rowFives )/( 2*24*3600*1000) )

                    else if (( sysDates -  rowFives == 2*24*3600*1000) && (tab.rows[i][6] == null))
                    { console.log('Bonjour Mr/Mme, Je vous rappel que votre carte est disponible chez votre agence. Merci de la récupérer.');}
                    
                    else if (tab.rows[i][6] == sysDate)
                    { console.log('Bonjour Mr/Mme, je vous remercie pour la récupération de votre carte.');}

                   else if( (tab.rows[i][7] == null) && (sysDates - rowSixs == 10*24*3600*1000 ))
                    { console.log("Bonjour Mr/Mme, On a remarqué que vous n'avez pas utilisé votre carte. Avez vous des problèmes !" );}
                    
                   else if ((tab.rows[i][8] == null) && (sysDates - rowSevens == 10*24*3600*1000 ))
                    { console.log(tab.rows[i][0]+'Bonjour Mr/Mme, On a remarqué que vous avez pas utilisé votre carte juste une fois. Avez vous rencontré' 
                    +'des problèmes !' );}

                }
        }
        transac(result);
  //-----------------------------------------
   /*sequelize.query('CREATE TRIGGER TrigTransaction AFTER INSERT OR UPDATE OR DELETE ON TRANSACTIONS' +
  ' FOR EACH ROW' +
  ' BEGIN' +
  'EXECUTE Function transac();' +
  'END;')*/
        //console.log ('Bonjour Mr/Mme !!');
        
        doRelease(connection);
      });
  
  });

// Note: connections should always be released when not needed
function doRelease(connection) {
  connection.close(
    function(err) {
      if (err) {
        console.error(err.message);
      }
    });
}
