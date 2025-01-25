

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/blogDB");
const blogSchema = new mongoose.Schema({
  title:String,
  content:String
});
const Post = mongoose.model("Post",blogSchema);
const posts=[]

const homeStartingContent = "Introduce yourself and your colleagues in a special post that fosters familiarity and a sense of community. Additionally, you can also use this content in your killer ‘About Us’ page. This is a wonderful opportunity to share how you got involved in your work, what passions drive you and what is the expertise you bring to the table.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



app.get("/", function(req, res) {  
  Post.find({}, function(err, posts){

    res.render("home", {
 
      startingContent: homeStartingContent,
 
      posts: posts
 
      });
 
  })
  
  
});
app.get("/about", function(req, res) {  
  res.render("about",{aboutContent:aboutContent});
});
app.get("/contact", function(req, res) {  
  res.render("contact",{contactContent:contactContent});
});   
app.get("/compose", function(req, res) {  
  res.render("compose");
});   
app.get("/posts/:postId", function(req, res){

  const requestedPostId = req.params.postId;
  
    Post.findOne({_id: requestedPostId}, function(err, post){
      res.render("post", {
        title: post.title,
        content: post.content
      });
    });
  
  });
app.post("/compose", function(req,res){
  
   posttitle= req.body.textTitle;
   postcontent = req.body.textPost;

  const post = new Post({
    title: posttitle,
    content:postcontent
  });
  
  post.save(function(err){

    if (!err){
 
      res.redirect("/");
 
    }
 
  });

});






app.listen(3000, function() {
  console.log("Server started on port 3000");
});
