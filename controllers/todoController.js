var express = require("express");
var mongoose = require("mongoose");

// Connect to the database
mongoose.connect(
  "mongodb+srv://test:test@test.slkch.mongodb.net/test?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

// Create a schema - this is like a blueprint
var todoSchema = new mongoose.Schema({
  item: String,
});

var Todo = mongoose.model("Todo", todoSchema);

// var data = [
//   { item: "get milk" },
//   { item: "go walk" },
//   { item: "kick some coding ass" },
// ];
var urlencodedParser = express.urlencoded({ extended: false });
module.exports = function (app) {
  app.get("/todo", function (req, res) {
    // get data from mongodb and pass it to the view
    Todo.find({}, function (err, data) {
      if (err) throw err;
      res.render("todo", { todos: data });
    });
  });
  app.post("/todo", urlencodedParser, function (req, res) {
    //get data from the view and add it to the mongodb
    var newTodo = Todo(req.body).save(function (err, data) {
      if (err) throw err;
      res.json(data);
    });
  });

  app.delete("/todo/:item", function (req, res) {
    // delete requestet item from mongodb
    Todo.find({
      item: Array.from(req.params.item).splice(1).join("").replace(/-/g, " "),
    }).remove(function (err, data) {
      if (err) throw err;
      res.json(data);
    });
    //old way to remove item without mongodb database
    // data = data.filter(function (todo) {
    //   return "-" + todo.item.replace(/ /g, "-") !== req.params.item;
    // });
    // res.json(data);
  });
};
