"use strict";
var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080; // default port 8080
const bodyParser = require("body-parser");
//var connect        = require('connect')
var methodOverride = require('method-override')
var generateRandomShortURL = require('./app.js');
const MongoClient = require("mongodb").MongoClient;
const MONGODB_URI = "mongodb://127.0.0.1:27017/url_shortener";

// var urlDatabase = {
//   "b2xVn2": "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com"
// };

let dbInstance;

MongoClient.connect(MONGODB_URI, (err, db) => {
  if (err) {
    throw err;
  } else {
    console.log("Connected to the db successfully!!!");
    dbInstance = db;
  }
});



  // function getLongURL(db, shortURL, cb) {
  //   let query = { "shortURL": shortURL };
  //     db.collection("urls").findOne(query, (err, result) => {
  //       if (err) {
  //         return cb(err);
  //       }
  //     return cb(null, result.longURL);
  //     db.close();
  //   });
  // }


app.set("view engine", "ejs");

app.use(bodyParser.urlencoded());

app.use(methodOverride('_method'))


app.put("/urls/:id", (req, res) => {
  dbInstance.collection("urls").findOneAndUpdate({shortURL: req.params.id}, {$set: {longURL: req.body.longURL}}, (err, result) => {
  res.redirect("/urls");
  });
});


app.delete("/urls/:id", (req, res) => {
  let shortURL = req.params.id;
  dbInstance.collection("urls").deleteOne({shortURL: shortURL}, (err, result) => {
  res.redirect("/urls");
  });
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

//////
app.post("/urls", (req, res) => {
  dbInstance.collection("urls").insertOne({shortURL: generateRandomShortURL(6), longURL: req.body.longURL}, (err, result) => {
    console.log(result);
    res.send("Refresh to see your TinyURL");
  });
  // urlDatabase[generateRandomShortURL(6)] = req.body.longURL
  // res.send("Refresh to see your TinyURL");
});

app.get("/", (req, res) => {
  res.end("Hello!");
});


app.get("/urls", (req, res) => {
  dbInstance.collection("urls").find().toArray((err, results) => {
    let urlCollection = {urls: results};
    res.render("urls_index", urlCollection);
  });
});


app.get("/urls/:id", (req, res) => {
  let shortURL = req.params.id;
  dbInstance.collection("urls").findOne({shortURL: shortURL}, (err, result) => {
    console.log(result);
  let templateVars = result;
  res.render("urls_show", templateVars);
  });
});

  // let templateVars = {
  //   shortURL: req.params.id,
  //   urls: urlDatabase }
  // res.render("urls_show", templateVars);
// });

////
// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});