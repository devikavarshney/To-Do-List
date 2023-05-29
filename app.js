const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const res = require("express/lib/response");
const date = require(__dirname+"/date.js");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
// const items = ["Buy food", "Cook food"];
// const workItems =[];

mongoose.connect("mongodb://localhost:27017/todolistDB");
const itemsSchema = {
  name:String
}

const Item = mongoose.model("Item",itemsSchema);

const item1 = new Item({
  name:"Go for shopping"
});
const item2 = new Item({
  name:"Clean the home"
});
const item3 = new Item({
  name:"Complete today's learning"
});

const defaultItems = [item1,item2,item3];

// Item.insertMany(defaultItems);

app.get("/", function (req, res) {
  
  Item.find({}, function(err, foundItems){
    if(foundItems.length===0){
      Item.insertMany(defaultItems);
    }
    res.render("list",{listTitle:date.getDate(), newListItems:foundItems});
  })
  
});

app.post("/", function(req,res){
    
    const item = req.body.newItem;
    
    // if(req.body.list==="Work"){
    // workItems.push(item);
    // res.redirect("/work");
    // }
    // else{
    // items.push(item);
    // res.redirect("/");
    // }
});

app.get("/work", function(req,res){
    res.render("list",{listTitle:"Work List", newListItems:workItems});
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
