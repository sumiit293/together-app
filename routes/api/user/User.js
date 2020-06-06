const router = require("express").Router();
const User = require("./../../../models/UserModel")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const secret = require("./../../../config/MyUrl").secret

router.post("/", async (req, res) => {

    try {
        let { name, password, email, phone, category } = req.body;

        // checking if the user allredy exist
        const user = await User.findOne({ $or: [{ email }, { phone }] });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });

        }


        let newUser = new User({
            name,
            email,
            password,
            phone,
            category
        });

        // hasing the password

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        newUser.password = hash;
        //saving the student to database

        await newUser.save();
        console.log(newUser.id + " id");
        let payload = {
            id: newUser.id
        }

        // creating the token
        jwt.sign(payload, secret, {
            expiresIn: '3h'
        }, (err, token) => {
            if (err) {
                res.status(500).json({ msg: err });
            }
            res.json({ Token: token });
        })

    } catch (err) {
        res.status(500).json({ msg: err });
    }


})
module.exports = router;