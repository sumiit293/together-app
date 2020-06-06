const express = require("express");
const app = express();
const db = require("./config/MyUrl").url;
const mongoose = require("mongoose");
const Port = process.env.PORT || 5000;


//connecting to database

mongoose.connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => console.log("Conntected to database...")).catch((err) => console.log(err));


// configuring the middle ware for parsing the form value
app.use(express.json({ extended: false }));

//test route
app.get("/", (req, res) => {
    res.send("Working routes...");
})
//getting user from User 
const _user = require("./routes/api/user/User")
app.use("/api/user", _user);
//getting auth file
const auth = require("./routes/api/user/Auth")
app.use("/api/auth", auth)

app.listen(Port, () => console.log("listining on port number 5000"));



