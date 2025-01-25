require('dotenv').config(); 
const express= require("express");
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose"); 
const bcrpyt = require("bcrypt");

const saltRounds = 10;

const app = express();

   
//////////////DAtabase Connection/////////////////////


mongoose.connect ("mongodb://localhost:27017/userDB");
const tindogSchema = new  mongoose.Schema({
    email:String,
    password : String
});


const Tindog = mongoose.model("Tindog", tindogSchema);



app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(express.static("public"));




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
 

  app.get("/logout",function(req,res){
   
    res.redirect("/");
  })

  ////////////////Post Request///////////////////

  app.post("/register",function(req,res){
    
    bcrpyt.hash(req.body.password,saltRounds,function(err,hash){

        const newUser = new Tindog({
            email : req.body.username,
            password : hash
        });
        newUser.save(function(err){
            if(!err)
            {
                res.render("tindog")
            }
            else
            {
                console.log(err)
            }
        });
  });   
})  ;



app.post("/login",function(req,res)
{
    const username = req.body.username;
    const userpassword = req.body.password ;
    Tindog.findOne({email:username},function(err,foundUser)
    {

        if(err){
            res.render(err)
        }
        else{
                if(foundUser)
                {
                    bcrpyt.compare(userpassword,foundUser.password,function(err,results){
                        if (results == true){
                            
                            res.render("tindog");
                        }
                        else{
                            res.render("login");
                        }
                        })
                    
                }
                else{
                  res.render("register");
                }
              
        }
        
    })
});


  
app.listen(3000,function(req,res){
    console.log("listening to Port 3000!!")
});
