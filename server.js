var express = require('express');
var app = express();
var port = process.env.PORT || 3000;  
var request = require("request");
var bodyParser = require('body-parser');
var User = require('./user.js');
var cookieParser = require('cookie-parser');
var session=require('express-session');

var mongodb= require("mongoose");
var urldb =process.env.MONGOLAB_URI2;


var db = mongodb.connection;

db.on('error', function(err){
  console.log('connection error', err);
});

db.once('open', function(){
  console.log('Connection to DB successful');
});



function clone(obj) {
  var copy={};
  console.log(obj._doc)
  Object.keys(obj._doc).forEach(function (key) {
    copy[key]=obj[key];
  }   );
  console.log(copy);
  return copy;
}
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
	res.cookie("user",JSON.stringify(req.session.user));
  res.sendFile("/main.html",{root: __dirname});
});

app.get('/logout', function (req, res) {
	req.session.destroy();
	res.clearCookie('user');
  res.redirect("/");
});


app.get('/:any', function (req, res) {
  res.cookie("user",JSON.stringify(req.session.user));
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

  User.findOne({email: req.body.email}, function(err, user) {

    if(!user){
      new_user.password = new_user.generateHash(req.body.password);
      new_user.save(function(err, data){
        if(err) console.log(error);
        else console.log ('Success:' , data);

        console.log("registrado");
        var usr=clone(data);
        delete usr["password"];
        req.session.user=usr;
        req.session.user=usr;
        res.json({type: "redirect", msg: "/"});

      })
    }else{
     res.json({type: "denied", msg: "User is already exist"}); 
   }

 });
});

app.post('/signin', function(req, res) {
	
  User.findOne({email: req.body.email}, function(err, user) {

    if (!user || !user.validPassword(req.body.password)) {
     res.json({type: "denied", msg: "User or password is invalid"});
   } else {
    var usr=clone(user);
    delete usr["password"];
    req.session.user=usr;

    res.json({type: "redirect", msg: "/"});
  }
});
});

app.post('/update', function(req, res) {
  var resp=res;

  if(req.session.user){
    console.log({country: req.body.country, town: req.body.town});
    User.updateOne({email: req.session.user.email}, {country: req.body.country, town: req.body.town}, function(err, res) {
      if (err) throw err;
      console.log("1 document updated: ",res);

      User.findOne({email: req.session.user.email}, function(err, user) {

        if(user){
          var usr=clone(user);
          delete usr["password"];
          req.session.user=usr;
          resp.json({type: "ok", msg:"Profile updated successfully"});
          return;
        }
      });
    });
  }else{
    res.json({type: "denied", msg:"permission denied"});
  }
});

app.post('/changepass', function(req, res) {
  var resp=res;



  if(req.session.user){
   User.findOne({email: req.session.user.email}, function(err, user) {

    if (user.validPassword(req.body.oldpassword)) {
     User.updateOne({email: user.email}, {password: user.generateHash(req.body.newpassword)}, function(err, res) {
      if (err) throw err;

      console.log ('Success:' , res);
      resp.json({type:"ok", msg:"Password updated successfully"});

    });
   }else
   resp.json({type:"denied", msg:"Old password is invalid"});
 });
 }else{
  res.json({type:"denied", msg:"permission denied"});
}
});

app.get("/gets/searchbook",function(req,res){

  options = { method: 'GET',
  "rejectUnauthorized": false, 
  url: "https://www.googleapis.com/books/v1/volumes?q="+req.query.q+"&country=BR",
  proxy: process.env.HTTP_PROXY};

  request(options, function (error, response, body) {
    if (error) throw new Error(error);

    var jsonobj=JSON.parse(body);

    res.json(jsonobj.items);

  });



});

app.get("/gets/addbook",function(req,res){
  options = { method: 'GET',
  "rejectUnauthorized": false, 
  url: "https://www.googleapis.com/books/v1/volumes?q="+req.query.book+"&country=BR",
  proxy: process.env.HTTP_PROXY};

  var resp=res;
  request(options, function (error, response, body) {
    if (error) throw new Error(error);

    if(req.session.user){
      var jsonobj=JSON.parse(body);
      console.log(jsonobj)

      var jsonobj=jsonobj.items[0].volumeInfo;

      db.collection("books").insertOne({title: jsonobj.title, img: jsonobj.imageLinks.thumbnail, user:req.session.user.email}, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        resp.json({type:"img", msg: {title: jsonobj.title,  img: jsonobj.imageLinks.thumbnail, user:req.session.user.email}});
      });


    }else{
      resp.json({type:"denied", msg:"permission denied"});
    }

  });

});

app.get("/gets/userbooks",function(req,res){
  var resp=res;
  console.log(req.query.user);
  db.collection("books").find((req.query.user!=="undefined")?{user:req.query.user}:{}).sort({_id:-1}).toArray(function(err, res) {
    if (err) throw err;
    console.log(res);
    resp.send(res);
  });

});

app.get("/gets/reqbooks1",function(req,res){
  var resp=res;
  console.log(req.session.user.email);
  if(req.session.user){
    db.collection("books").find({trade:req.session.user.email}).sort({_id:-1}).toArray(function(err, res) {
      if (err) throw err;
      console.log(res);
      resp.send(res);
    });
  }else{
    res.json({type:"denied", msg:"permission denied"});	
  }


});

app.get("/gets/reqbooks2",function(req,res){
  var resp=res;
  console.log(req.session.user.email);
  if(req.session.user){
    db.collection("books").find({user:req.session.user.email, trade: { '$exists': 1, '$ne': {}, "$ne":""}}).sort({_id:-1}).toArray(function(err, res) {
      if (err) throw err;
      console.log(res);
      resp.send(res);
    });
  }else{
    res.json({type:"denied", msg:"permission denied"});	
  }


});

app.get("/gets/remove",function(req,res){
  var resp=res;
  if(req.session.user){
    db.collection("books").deleteOne({user: req.query.user, title:req.query.title}, function(err, obj) {
      if (err) throw err;
      db.collection("books").find({user:req.session.user}).sort({_id:-1}).toArray(function(err, res) {
        if (err) throw err;
        console.log(res);
        resp.send({msg:"ok"});
      });
    });
  }else{
    res.json({type:"denied", msg:"permission denied"});
  }

});

app.get("/gets/request",function(req,res){
  var resp=res;

  if(req.session.user){
    db.collection("books").findOne({user: req.query.user, title: req.query.title}, function(err, book) {
      book.trade=req.session.user.email;
      db.collection("books").updateOne({title: req.query.title}, book, function(err, res) {
        if (err) throw err;

        console.log("updated");
        resp.json({type:"ok", msg:"ok"});

      });
    });
  }
});

app.get("/gets/checkreq",function(req,res){
  var resp=res;
  if(req.session.user){

    db.collection("books").findOne({user: req.session.user.email, title: req.query.title}, function(err, book) {
      book.tradeap=req.query.ap=="approved"?"true":"false";
      db.collection("books").updateOne({user: req.session.user.email, title: req.query.title}, book, function(err, res) {
        if (err) throw err;

        console.log("updated");
        resp.json({type:"ok", msg:"ok"});

      });
    });
  }

});

app.get("/photos",function(req,res){

});


