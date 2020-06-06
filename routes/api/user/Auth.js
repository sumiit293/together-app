const router = require("express").Router();
const User = require("./../../../models/UserModel")
const Jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const secret = require("./../../../config/MyUrl").secret
const auth = require("./../../../config/Middleware")


// @route    GET api/auth
// @desc     Get authorized user 
// @access   Private
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.id).select('-password');
        await res.json({ user: user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Server error' });
    }
});
// @route    POST api/auth
// @desc     Get  user authorized
// @access   Public
router.post("/", async (req, res) => {

    try {
        // checking if the user allredy exist or not 
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            res.status(400).json({ msg: "This Email is not registered" });
            return;
        }
        // comparing the password for match
        const isMatch = await bcrypt.compare(req.body.password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid Credentials" })
        }

        const payload = {
            id: user.id
        }
        // generating the token

        const token = await Jwt.sign(payload, secret, {
            expiresIn: '3h'
        })

        if (!token) {
            res.status(400).json({ msg: "Something went wrong" });
        }
        return res.json({ Token: token });
    } catch (error) {
        console.log(error);
        res.json({ msg: "Internal server error" });
    }
})
module.exports = router;