require('dotenv').config({path:"./.env"})
const passport = require('passport')
const path = require('path')
const express = require('express')
const { getUsers } = require('./models/db')
const app = express()
const PORT = process.env.PORT || 8080

app.set("view engine", "ejs")
const viewsPath = path.join(__dirname, "views")
const publicPath = path.join(__dirname, "public")
app.use(express.static(publicPath))
app.set("views", viewsPath)
app.use(express.urlencoded({ extended: true }));

// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     User.findOne({ username: username }, function (err, user) {
//       if (err) { return done(err); }
//       if (!user) { return done(null, false); }
//       if (!user.verifyPassword(password)) { return done(null, false); }
//       return done(null, user);
//     });
//   }
// ));

app.get("/", (req, res) => {
    res.render("index")
})

app.get("/signup", (req, res) => {
    res.render("signup")
})

app.get("/join", (req, res) => {
    res.render("join")
})

app.use((req, res, next) => {
    res.render("error")
})

app.listen(PORT, ()=> {
    console.log("Server has been started")
})