const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const res = require("express/lib/response");
const date = require(__dirname + "/date.js");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
// const items = ["Buy food", "Cook food"];
// const workItems =[];

mongoose.connect("mongodb://localhost:27017/todolistDB");
const itemsSchema = {
  name: String
}

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Go for shopping"
});
const item2 = new Item({
  name: "Clean the home"
});
const item3 = new Item({
  name: "Complete today's learning"
});

const defaultItems = [item1, item2, item3];
const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

// Item.insertMany(defaultItems);

app.get("/", function (req, res) {

  Item.find({}, function (err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems);
    }
    res.render("list", { listTitle: date.getDate(), newListItems: foundItems });
  })

});

app.post("/", function (req, res) {

  const itemName = req.body.newItem;
  const item = new Item({
    name: itemName
  });

  item.save();

  // if(req.body.list==="Work"){
  // workItems.push(item);
  // res.redirect("/work");
  // }
  // else{
  // items.push(item);
  res.redirect("/");
  // }
});

app.get("/:customListName", function (req, res) {
  const customListName = req.params.customListName;
  List.findOne({ name: customListName }, function (err, foundList) {
    if (!err) {
      if (!foundList) {
        const list = new List({
          name: customListName,
          items: defaultItems
        });
        list.save();
        res.redirect("/" + customListName);
      }
      else {
        res.render("list", { listTitle: foundList.name.charAt(0).toUpperCase() + foundList.name.slice(1) + " List - " + date.getDate(), newListItems: foundList.items });
      }
    }
  })
});

app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;
  Item.findByIdAndDelete(checkedItemId, function (err) {
    if (err) {
      console.log(err);
    }
    else {
      console.log("Successfully deleted!");
    }
    res.redirect("/");
  })
});

app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
