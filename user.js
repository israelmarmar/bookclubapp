var mongodb= require("mongoose");
var urldb =process.env.MONGOLAB_URI2;
mongodb.connect(urldb);   
var Schema = mongodb.Schema;
var bcrypt = require('bcrypt-nodejs');

var db = mongodb.connection;
 
db.on('error', function(err){
    console.log('connection error', err);
});
 
db.once('open', function(){
    console.log('Connection to DB successful');
});



var userSchema = Schema({
  email: String,
  name: String,
  password: String
});


// hash the password
userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};
var User = mongodb.model('users', userSchema);
module.exports = User;

