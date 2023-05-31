const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const res = require("express/lib/response");
const date = require(__dirname + "/date.js");
const _ = require("lodash");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
// const items = ["Buy food", "Cook food"];
// const workItems =[];

mongoose.connect("mongodb+srv://devika:Devika06%23@todolist.q7psyfr.mongodb.net/todolistDB?retryWrites=true&w=majority",{ useUnifiedTopology: true });
const itemsSchema = {
  name: String
}
mongoose.connection
 .once('open', () => console.log('Good to go!'))
 .on('error', (error) => {
 console.warn('Warning', error);
 });

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
    res.render("list", { listTitle: "Today", newListItems: foundItems });
  })

});

app.post("/", function (req, res) {

  const itemName = req.body.newItem;
  const listName = req.body.list;
  const item = new Item({
    name: itemName
  });



  // if(req.body.list==="Work"){
  // workItems.push(item);
  // res.redirect("/work");
  // }
  // else{
  // items.push(item);
  // const dt = new Date(date.getDate())
  if (listName === "Today") {
    item.save();
    res.redirect("/");
  }
  else {
    List.findOne({ name: listName }, function (err, foundList) {
      foundList.items.push(item);
      foundList.save();
    })
    res.redirect("/" + listName);
  }

  // }
});

app.get("/:customListName", function (req, res) {
  const customListName = _.capitalize(req.params.customListName);
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
        res.render("list", { listTitle: foundList.name, newListItems: foundList.items });
      }
    }
  })
});

app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemId, function (err) {
      if (err) {
        console.log(err);
      }
      else {
        console.log("Successfully deleted!");
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } }, function (err, foundList) {
      if (!err) {
        res.redirect("/" + listName);
      }
    })
  }
});

app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.listen(process.env.PORT || port, function () {
  console.log(`Server started on port ${port}`);
});
