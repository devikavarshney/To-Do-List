const express = require("express");
const bodyParser = require("body-parser");
const res = require("express/lib/response");
const date = require(__dirname+"/date.js");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
let items = ["Buy food", "Cook food"];
let workItems =[];

app.get("/", function (req, res) {
  res.render("list",{listTitle:date.getDate(), newListItems:items});
});

app.post("/", function(req,res){
    
    let item = req.body.newItem;
    if(req.body.list==="Work"){
    workItems.push(item);
    res.redirect("/work");
    }
    else{
    items.push(item);
    res.redirect("/");
    }
});

app.get("/work", function(req,res){
    res.render("list",{listTitle:"Work List", newListItems:workItems});
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
