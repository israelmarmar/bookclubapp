var express = require('express');
var app = express();
var port = process.env.PORT || 3000;  
var request = require("request");
var bodyParser = require('body-parser');
var User = require('./user.js');
var cookieParser = require('cookie-parser');
var session=require('express-session');

app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true })); 

var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}};

app.use(express.static(__dirname + '/'));
app.use(cookieParser());
app.use(session({
  cookieName: 'session',
  secret: 'random_string_goes_here',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

app.get('/', function (req, res) {
	res.cookie("user",req.session.user);
    res.sendFile("/main.html",{root: __dirname});
});

app.get('/logout', function (req, res) {
	req.session.destroy();
	res.clearCookie('user');
    res.redirect("/");
});


app.get('/:any', function (req, res) {
    res.sendFile("/main.html",{root: __dirname});
});

app.listen(port, function () {
 console.log("ligado");
});

app.post('/register', function (req, res) {

var new_user = new User({
    email: req.body.email,
    name: req.body.name
  });

  new_user.password = new_user.generateHash(req.body.password);
  new_user.save(function(err, data){
    if(err) console.log(error);
    else console.log ('Success:' , data);

  console.log("registrado");
  req.session.user=data.name;
  res.redirect("/");

  })
});

app.post('/signin', function(req, res) {
  User.findOne({username: req.body.username}, function(err, user) {

    if (!user.validPassword(req.body.password)) {
       res.redirect("/login");
    } else {
	req.session.user=user.name;
      res.redirect("/");
    }
  });
});
