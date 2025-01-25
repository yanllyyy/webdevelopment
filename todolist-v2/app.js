
const _ = require("lodash");
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const app = express();






app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/todolistDB");
const itemsSchema = new mongoose.Schema({
  name: String
});
const Item = mongoose.model("Item",itemsSchema);



const item1 = new Item({
  name:"Welcome to Your TodoList"
});
const item2 = new Item({
  name:"Hit + button to add new Item"
});

const item3 = new Item({
  name:"<---Hit this to delete an item"
});
const defaultItems =[item1,item2,item3];

const listSchema = {
  name:String,
  items:[itemsSchema]
};
const List = mongoose.model("List",listSchema);

app.get("/", function(req, res) {


  Item.find({},function(err,founditems){
    if(founditems.length===0){
      Item.insertMany(defaultItems,function(err){
        if (err)
          console.log(err)
          else
          console.log("Successfully added Items!!")
       });
       res.redirect("/")
    }
else{
  res.render("list", {listTitle: "Today", newListItems: founditems});
}
      })    
});
app.get("/:customListName",function(req,res){
const customListName= _.capitalize(req.params.customListName);

List.findOne({name:customListName},function(err,results){
  if(!results){
  //create new list
  const list = new List({
    name:customListName,
    items:defaultItems
  });
  list.save();
  res.redirect("/"+customListName);
}
  else{
    //show the list
    res.render("list", {listTitle: results.name, newListItems: results.items});
  }
})
})
app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name:itemName
  });
  if (listName==="Today"){
    item.save();
    res.redirect("/");
  }
 else{
   List.findOne({name:listName},function(err,foundList){
    foundList.items.push(item);
    foundList.save();
    res.redirect("/"+ listName);
   })
 }

});
app.post("/delete",function(req,res){
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;
  if(listName==="Today"){
    Item.findByIdAndRemove(checkedItemId,function (err){
      
      if(err)
      console.log(err)
      else
      console.log("Item Deleted Successfulllyy!!");
      res.redirect("/");
    })
  }
  else{
    List.findOneAndUpdate(
      {name:listName  },
      {$pull:{items:{_id:checkedItemId}}},
      function(err,foundlist){
      if(!err){
        res.redirect("/"+listName);
      }
      }
      )
  }
 
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
