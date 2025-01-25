require('dotenv').config(); 
const express= require("express");
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose");
const session = require('express-session')
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(express.static("public"));


app.use(session({
    secret:"our little secret.",
    resave:false,
    saveUninitialized:false
   }));
   
app.use(passport.initialize());

app.use(passport.session());
   
//////////////DAtabase Connection/////////////////////



mongoose.connect ("mongodb://localhost:27017/wikiDB");
const tindogSchema = new  mongoose.Schema({
    email:String,
    password : String
});

tindogSchema.plugin(passportLocalMongoose);
const Tindog = new mongoose.model("Tindog", tindogSchema);
passport.use(Tindog.createStrategy());

passport.serializeUser(Tindog.serializeUser());
passport.deserializeUser(Tindog.deserializeUser());



////////////////get requests//////////////////////////////
app.get("/",function(req, res){
    res.render("home");
});
app.get("/tindog",function(req, res){
    res.render("tindog");
})

app.get("/login",function(req,res){
    res.render("login");
  });

  
app.get("/register",function(req,res){
    res.render("register");
});
 
app.get("/home",function(req,res){
    if(req.isAuthenticated()){
      res.render("home");
    }else{
      res.redirect("/login");
    }
  });
  app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
  })

  ////////////////Post Request///////////////////

  app.post("/register",function(req,res)
  {
    Tindog.register({username:req.body.username}, req.body.password, function(err, tindog)
     {
      if (err) 
        { 
            console.log(err);
             res.redirect("/register");
        }
       else
        {
            passport.authenticate("local")(req,res,function(){
                res.redirect("/tindog");
            });
          
        }
    });
    
  });
  
  
  
  app.post("/login",function(req,res)
  {
    const tindog =  new Tindog({
      username:req.body.username,
      password: req.body.password
    });
    
    req.login(tindog,function(err){
      if(err){
        console.log(err);
        res.redirect("/register");
        
      }
      else
      {
        passport.authenticate("local")(req,res,function(){
          res.redirect("/tindog");
      });
      }
    })
  });
  
app.listen(3000,function(req,res){
    console.log("listening to Port 3000!!")
});
