const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const User = require("./models/user");
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// set ejs as view engine
app.set("view engine", "ejs");
app.use('views', express.static(path.join(__dirname, '/views')));

main().catch(err => { console.log(err) });

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/monter');
}

app.get("/", (req, res) => {
    res.render("logIn.ejs");
});

app.get("/loggedin", async(req, res) => {
    let { email, password } = req.query;
    console.log(email + " " + password);
    let user = await User.findOne({ email });
    if (!user) {
        return res.status(404).send("User not found");
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return res.status(401).send("Invalid Password");
    }
    res.send("You are successfully logged in");
});

app.get("/register", (req, res) => {
    res.render("register.ejs");
});
app.post("/registered", async(req, res) => {
    let { email, age, password, location, details } = req.body;
    const existingUser = User.findOne({ email: email });
    if (existingUser) {
        console.log("Email in use");
        res.send("User already exist with that email address");
    } else {
        const newUser = new User({ email: email, password: password, age: age, location: location, details: details });

        // hashing of password
        const saltRounds = 7;
        const hashedpass = bcrypt(newUser.password, saltRounds);
        newUser.password = hashedpass;

        await newUser.save();
        console.log(newUser);
        res.render("show.ejs", { newUser });
    }

});
app.listen(8080, () => {
    console.log("Listening to port 8080");
});