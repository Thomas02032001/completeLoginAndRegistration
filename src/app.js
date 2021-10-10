
require('dotenv').config(); // used to hidde the secret key in token genration and it need to be on top. 
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8000;
const hbs = require('hbs');
const bcrypt = require('bcryptjs');


// connect to conn.js
require('./db/conn');
const Register = require("./models/registers")

// public static path
const staticPath = path.join(__dirname, "../public"); // index.html is home page by the name we given "index" so it will show it on local host main page so it follow top to bottum approach
const dinamicPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");


app.set('views', dinamicPath); // for dynamic
hbs.registerPartials(partialsPath); // saying that we are using partials
app.use(express.static(staticPath)); // for static
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // we are not using post man so to get the data from the url

console.log(process.env.SECRET);


app.get("/", (req, res) => {
    //res.send("welcome HOME page");
    res.render('index.hbs');
});

app.get("/register", (req, res) => {
    res.render("register.hbs");
});

app.get("/login", (req, res) => {
    res.render("login.hbs");
});

app.post("/register", async (req, res) => {
    try {
        const password = req.body.password;
        const conformpassword = req.body.conformpassword;
        if (password === conformpassword) {
            const registerEmployee = new Register({
                fullname: req.body.fullname,
                username: req.body.username,
                email: req.body.email,
                phone: req.body.phone,
                password: req.body.password,
                conformpassword: req.body.conformpassword,
                gender: req.body.gender
            });

            // converting the password to hash to secure the password.
            // so we are calling the pre function to the hash the password.

            const token = await registerEmployee.generateAuthToken();

            const registered = await registerEmployee.save();
            res.status(200).render("index.hbs");



        } else {
            res.send("password is not matching");
        }
    } catch (e) {
        res.status(400).send(e);
    }
});

app.post("/login", async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        //res.send(`${username} == ${password}`);

        const userDataByUsername = await Register.findOne({ username: username });
        //res.send(userDataByUsername);
        const isMatch = await bcrypt.compare(password, userDataByUsername.password); // if it match it will return true.
        /*if (userDataByUsername.password === password) {
            res.status(201).render("index.hbs");
        } else {
            res.send("password are not matching");
        }*/


        // when we are using hashing methor for password encription
        /*if (isMatch) {
            res.status(201).render("index.hbs");
        } else {
            res.send("password are not matching");
        }*/

        const token = await userDataByUsername.generateAuthToken();

        if (isMatch) {
            res.status(201).render("index.hbs");
        } else {
            res.send("password are not matching");
        }

    } catch (e) {
        res.status(400).send("invalid username");
    }

});






/*
//              BCRYPT ALGO FOR PASSWORD HASHING FOR SECURITY
const bcrypt = require('bcryptjs');
const securePassword = async (password) => {
    const passwordHash = await bcrypt.hash(password, 10); // we can write upto 12 becaues bcrypt as at most 12 rounds it will takes 150days to hack the password
    console.log(passwordHash);
    const passwordHashCompare = await bcrypt.compare(password, passwordHash); // ww are checking the password is correct or not.
    console.log(passwordHashCompare);
}

securePassword('thomas@2001');
*/

/*



const jwt = require('jsonwebtoken');

const createToken = async () => {
    // benifits of it is not to use login again and again.
    const token = await jwt.sign({ __id: "616176db66c579fa70c8f615" }, "mynameisthomsaredynakkala"); // secret key atlest 32 charecters greater the length most better.
    // token = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfX2lkIjoiNjE2MTc2ZGI2NmM1NzlmYTcwYzhmNjE1IiwiaWF0IjoxNjMzNzkyMjA4fQ.l50OG06PwbFwVsn2Q532UzyQBKhzS9a3MTT4sDiUHh4
    //         header. payload. data
    //        CONTAINS ALGORITHUM . BODY DATA. data 
    // token will not be at server so we need to verfiy its true u can share the page
    console.log(token);

    const userVer = jwt.verify(token, "mynameisthomsaredynakkala");
    // userVer = { __id: '616176db66c579fa70c8f615', iat: 1633792495 } if it is true then we will get this
    console.log(userVer);
    /*
    // here the page will automatically logout after 10 seconds whcih we observe in back website 
    const token = await jwt.sign({ __id: "616176db66c579fa70c8f615" }, "mynameisthomsaredynakkala", {
        expiresIn: "10 seconds"
    });
    */
/*
}

createToken();
*/


app.listen(port, () => {
    console.log(`Listening to the port ${port}`);
});


