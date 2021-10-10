const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const employeeSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    conformpassword: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

// generating tokens.
// generateAuthToken() we get from 
employeeSchema.methods.generateAuthToken = async function () {
    try {
        const token = jwt.sign({ _id: this._id.toString() }, process.env.SECRET); // here the secret key is calling from .env
        this.tokens = this.tokens.concat({ token: token }); // ??????????
        console.log(token);
        await this.save(); // ????????????????/
        return token;
    } catch (err) {
        res.send("the error part" + err);
        console.log("the error part" + err);
    }
}


// bcrypt is one of the algorithum
// it will exegute first before saving the data in mongodb
// fat arrow funciton not work here
// at first we are giving the function name where it will exegute after this.
employeeSchema.pre("save", async function (next) {
    // isModified is used only when the new uesr registered or the user modified password only.
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
        this.conformpassword = await bcrypt.hash(this.password, 10);
    }
    next(); // it will call "save" funciton.
});



const Register = new mongoose.model("Register", employeeSchema);

module.exports = Register;
