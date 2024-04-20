const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const User = require("./models/user");
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const sendOTP = require('./views/sendOTP.js');
const jwt = require('jsonwebtoken');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));

// set ejs as view engine
app.set("view engine", "ejs");
app.use('views', express.static(path.join(__dirname, '/views')));

main().catch(err => { console.log(err) });

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/monter');
}

// First register
app.get("/", (req, res) => {
    res.render("register.ejs");
});

// otp validation
app.post("/registered", async(req, res) => {
    let { email, password } = req.body;
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
        console.log("Email in use");
        res.send("User already exist with that email address");
    } else {
        const newUser = new User({ email: email, password: password });

        // hashing of password
        const saltRounds = 7;
        const hashedpass = await bcrypt.hash(newUser.password, saltRounds);
        newUser.password = hashedpass;

        // otp generation
        const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });
        newUser.otp = otp;
        await newUser.save();
        await sendOTP(email, otp);
        console.log(newUser);
        res.render("otp.ejs", { email });
    }
});

// otp verifying 
app.post("/verify-otp", async(req, res) => {
    const { email, otp } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
        console.log("User not found");
        res.send("User not found");
        return;
    }

    if (user.otp !== otp) {
        console.log("Invalid OTP");
        res.send("Invalid OTP");
        return;
    }

    // Mark user as verified
    user.verified = true;
    await user.save();

    console.log("User verified");
    // res.send("User verified successfully");
    res.render("details.ejs", { email });
});

// further details 
app.post("/home", async(req, res) => {
    const { email, age, location, details } = req.body;
    const user = await User.findOne({ email: email });
    user.age = age;
    user.location = location;
    user.details = details;
    await user.save();
    res.render("home.ejs");
});

app.get("/login", (req, res) => {
    res.render("logIn.ejs");
});
app.post("/login", async(req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).send("User not found");
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(401).send("Invalid Password");
        }

        const token = jwt.sign({ email: user.email }, 'your_secret_key', { expiresIn: '1h' });
        // res.json({ token });
        console.log(token);
        res.render("home.ejs");
    } catch {
        res.send("wrong details");
    }

});

app.listen(8080, () => {
    console.log("Listening to port 8080");
});