const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use('view engine','ejs');

app.get("/", function(req,res){
    var today = new Date();
    if(today.getDay()===6 || today.getDay()===0){
        res.send("<h2>Yay! It's weekend!</h2>");
    }
    else{
        res.sendFile(__dirname+"/index.html");
    }
});

app.listen(3000,function(){
    console.log("Server started on port 3000");
});