// verifying the cookies are present are not.
// check the user is authoticated or not.
const jwt = require('jsonwebtoken');

const Register = require('../models/registers');

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, process.env.SECRET);
        console.log(`verification = ${verifyUser}`);
        const user = await Register.findOne({ _id: verifyUser._id });
        console.log(user);

        // getting token and user data
        req.token = token; // ??????
        req.user = user; // ??????

        next();

    } catch (err) {
        res.status(401).send(err);
    }
}

module.exports = auth;