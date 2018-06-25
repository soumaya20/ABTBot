var mongoose = require('mongoose');

//Map global promise - get rid of warning
mongoose.Promise = global.Promise;

//Connect to mongoose
mongoose.connect('mongodb://localhost:27017/ABTBot');
var database = mongoose.connection;

//check for connection
database.once('open', function(){
  console.log('BD connected..');
});

 //check for db errors
 database.on('error',function(err){
   console.log(err);
 });