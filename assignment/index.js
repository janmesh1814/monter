const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");

// set ejs as view engine
app.set("view engine", "ejs");
app.use('views', express.static(path.join(__dirname, '/views')));

main().catch(err => { console.log(err) });

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/chatter');
}

app.get("/", (req, res) => {
    res.render("logIn.ejs");
});

app.get("/register", (req, res) => {
    res.render("register.ejs");
});

app.listen(8080, () => {
    console.log("Listening to port 8080");
});