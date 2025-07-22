require('dotenv').config({path:"./.env"})
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const path = require('path')
const bcrypt = require('bcryptjs')
const express = require('express')
const { getUsers, signUpUser, getUserByUsername } = require('./models/db')
const { nextTick } = require('process')
const session = require('express-session')
const pool = require('./models/pool')
const app = express()
const PORT = process.env.PORT || 8080

const viewsPath = path.join(__dirname, "views")
const publicPath = path.join(__dirname, "public")
app.set("view engine", "ejs")
app.set("views", viewsPath)

app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.static(publicPath))
app.use(express.urlencoded({ extended: true })); 


passport.use(new LocalStrategy(
    async function(username, password, done){

        try {
            const user = await getUserByUsername(username)
            if(!user) return done(null, false, {message:"Incorrect Username"})
            const passwordMatch = await bcrypt.compare(password, user.password)
            if(!passwordMatch) return done(null, false, {message:"Incorrect Password"})
            return done(null, user)
        } catch (error) {
            return done(error)
        }

    }
))

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    const user = rows[0];

    done(null, user);
  } catch(err) {
    done(err);
  }
});

app.get("/", (req, res) => {
    res.render("index", { user: req.user })
})

app.get("/signup", (req, res) => {
    res.render("signup")
})

app.post("/signup", async (req, res, next) => {
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        await signUpUser(req.body.firstname, req.body.lastname, req.body.username, hashedPassword)
        res.redirect("/")
    }catch(e){
        console.log(e)
        next(e)
    }
})

app.post('/login', passport.authenticate('local', {
  failureRedirect: '/',
  successRedirect: '/'
}));


app.get("/join", (req, res) => {
    console.log(req.user)
    res.render("join")
})

app.post("/join", (req, res) => {
    const a = req.user.username 
    if(req.body.code == 'admin'){
        pool.query("UPDATE users SET isadmin = TRUE WHERE username = $1", [a])
    }else if(req.body.code == 'member'){
        pool.query("UPDATE users SET ismember = TRUE WHERE username = $1", [a])
    }
    res.redirect("/")
})

app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});


app.use((req, res, next) => {
    res.render("error")
})

app.listen(PORT, ()=> {
    console.log("Server has been started")
})