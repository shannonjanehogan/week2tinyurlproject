const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
const bodyParser = require("body-parser");
const methodOverride = require('method-override')
const generateRandomShortURL = require('./generate_random_shortURL.js');
const MongoClient = require("mongodb").MongoClient;
const MONGODB_URI = "mongodb://127.0.0.1:27017/url_shortener";

let dbInstance;

MongoClient.connect(MONGODB_URI, (err, db) => {
  if (err) {
    throw err;
  } else {
    console.log("Connected to the db successfully!!!");
    dbInstance = db;
  }
});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded());
app.use(methodOverride('_method'));


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


app.post("/urls", (req, res) => {
  const generator = generateRandomShortURL(6);
  let longURL = req.body.longURL;
  dbInstance.collection("urls").insertOne({shortURL: generator, longURL: longURL}, (err, result) => {
    res.redirect("/urls");
  });
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
    let templateVars = result;
    res.render("urls_show", templateVars);
  });
});


app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});


app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});