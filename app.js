const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});
//TODO

const articleSchema ={
    title:"String",
    content:"String"
};
 
const Article = mongoose.model("Article", articleSchema);

// request targeting all articles

app.route("/articles")

.get(async function(req, res) {
    try {
        const foundArticles = await Article.find({});
        res.send(foundArticles);
    } catch (err) {
        console.error(err);
    }
})

.post(async function(req, res) {
  try {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });

    await newArticle.save();
    res.send("Successfully added a new article!");
  } catch (err) {
    res.send(err);
  }
})

.delete(async function(req, res){
    try {
        await Article.deleteMany();
        res.send("Successfully deleted.");
    } catch(err) {
        res.send(err);
    }
}); 

// request targeting specific article


app.route("/articles/:articleTitle")

.get(async function(req, res){
  try {
    const foundArticle = await Article.findOne({title: req.params.articleTitle});
    if (foundArticle) {
      res.send(foundArticle);
    } else {
      res.send("No articles matching that title was found.");
    }
  } catch (err) {
    res.send(err);
  }
})

.put(async function(req, res){
  try {
    await Article.updateOne(
      {title: req.params.articleTitle},
      {title: req.body.title, content: req.body.content},
      {overwrite: true}
    );
    res.send("Successfully updated the selected article.");
  } catch (err) {
    res.send(err);
  }
})

.patch(async function(req, res){
  try {
    await Article.updateOne(
      {title: req.params.articleTitle},
      {$set: req.body}
    );
    res.send("Successfully updated article.");
  } catch (err) {
    res.send(err);
  }
})

.delete(async function(req, res){
  try {
    await Article.deleteOne(
      {title: req.params.articleTitle}
    );
    res.send("Successfully deleted the corresponding article.");
  } catch (err) {
    res.send(err);
  }
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});