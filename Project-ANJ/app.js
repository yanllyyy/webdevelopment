////////////Required Modules///////////////

const express= require("express");
const bodyParser = require("body-parser");
const path = require("path");
const ejs = require("ejs");
const mongoose = require('mongoose');
const bcrpyt = require("bcrypt");



const saltRounds = 10;
const app = express();


////////////////Static Files//////////////
app.use('*/css',express.static('public/css'));
app.use('*/images',express.static('public/images'));
app.set('view engine', "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.urlencoded({extended: true}));


///////Database Connection////////////

mongoose.connect("mongodb://localhost:27017/ANJdb", {useNewUrlParser: true});
const ANJSchema = {
    username :String,
    email: String,
    password: String
  };
  
  const Anj = mongoose.model("Anj", ANJSchema);


/////////////Get Methods///////////////////

app.get("/", function(req,res){
    res.render("home")
})
app.get("/account", function(req,res){
    res.render("account")
})

app.get("/products", function(req,res){
    res.render("products")
})
app.get("/product-details", function(req,res){
    res.render("product-details")
})
app.get("/cart", function(req,res){
    res.render("cart")
})
app.get("/about", function(req,res){
    res.render("about")
})
app.get("/contact", function(req,res){
    res.render("contact")
})
app.get("/productsa", function(req,res){
    res.render("productsa")
})
app.get("/productsdetiles", function(req,res){
    res.render("productsdetiles")
})

app.get("/login",function(req,res){
    res.render("account")
})
app.get("/register",function(req,res){
    res.render("account")
})


/////////////////// Post Requests//////////////////////

app.post("/register",function(req,res){
    
    bcrpyt.hash(req.body.password,saltRounds,function(err,hash){

        const newUser = new Anj ({
            email : req.body.email,
            username:req.body.username,
            password : hash
        });
        newUser.save(function(err){
            if(!err)
            {
                res.render("cart")
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
    const password = req.body.password ;
    Anj.findOne({username:username},function(err,foundUser)
    {

        if(err){
            res.render(err)
        }
        else{
                if(foundUser)
                {
                    bcrpyt.compare(password,foundUser.password,function(err,results){
                        if (results == true){
                            
                            res.render("cart");
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


////////////////////Console message///////////////

app.listen(8080,function(){
    console.log("Listening to Port 8080 |||| http://localhost:8080/")
})

