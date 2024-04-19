const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {

    },

    location: {

    },

    age: {

    },

    work: {

    }
});

userSchema.methods.comparePassword = async function(pass) {
    try {
        return await bcrypt.compare(pass, this.password);
    } catch (e) {
        console.log(e);
    }
}
const User = mongoose.model("User", userSchema);
module.exports = User;