var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

//------------ create database-----------------
/*MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  db.close();
});*/

//-------------------- create collection ---------------
MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("ABTBot");
    dbo.createCollection("ChatBot", function(err, res) {
      if (err) throw err;
      console.log("Collection created!");
      db.close();
    });
  });
//--------------------------Insert --------------------------
MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("ABTBot");
    var myobj = { idSender: "1554435334682091", idRecipient: "311230259409917", message: "Bonjour" ,  type: "message_received"};
    dbo.collection("ChatBot").insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
    });
  });