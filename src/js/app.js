const express = require('express');
const app = express();
const path = require('path');
const bcrypt = require('bcrypt');
require('./db.js');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const session = require('express-session');

const passport = require('passport');
require('./passport-config')(passport);

app.set('view-engine', 'hbs');
// app.set('views', '/Views');
app.use(express.static(path.resolve(__dirname, '../../public')));
app.use(express.urlencoded({ extended: false }));

//Express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    res.redirect('/index');
});

app.get('/register', (req, res) => {
    res.render('register.hbs');
});


app.post('/register', async (req, res) => {
    let { fname, lname, email, username, password1, password2 } = req.body;
    let errors = [];
    let hashedPass;

    let regex = /^[a-z]+$/i;
    if (!(regex.test(fname))) {
        errors.push({ msg: 'Please enter valid name' })
        fname = '';
    }
    if (!(regex.test(lname))) {
        errors.push({ msg: 'Please enter valid name' })
        lname = '';
    }
    regex = /^[a-z0-9]+$/i;
    if (!(regex.test(username))) {
        errors.push({ msg: 'Please enter valid username' })
        username = '';
    }
    regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!(regex.test(email))) {
        errors.push({ msg: "Please enter valid email address" });
        email = '';
    }
    if (password1.length < 6) {
        errors.push({ msg: "Password should be at least 6 characters" });
    } else if (password1 !== password2) {
        errors.push({ msg: "Passwords do not match" });
    } else {
        try {
            hashedPass = await bcrypt.hash(password1, 10);
        } catch
        {
            errors.push({ msg: "Error hashing password" });
        }
    }

    if (errors.length > 0) {
        console.log(errors);
        res.render('register.hbs', {
            errors,
            fname,
            lname,
            email,
            username
        });
    } else {
        User.find({ $or: [{ email: email }, { username: username }] }, (err, usrs) => {
            let toBreak = false;
            for (let i = 0; i < usrs.length; i++) {
                if (usrs[i].email === email) {
                    errors.push({ msg: "Email address already registered" });
                    email = '';
                    toBreak = true;
                }
                if (usrs[i].username === username) {
                    errors.push({ msg: "Username already in use" });
                    username = '';
                    toBreak = true;
                }
                if (toBreak) {
                    break;
                }
            }
            if (errors.length > 0) {
                console.log(errors);
                res.render('register.hbs', {
                    errors,
                    fname,
                    lname,
                    email,
                    username
                });
            } else {
                new User({
                    fname: fname,
                    lname: lname,
                    email: email,
                    username: username,
                    password: hashedPass
                }).save(function (err) {
                    if (err) {
                        console.log("error saving to database");
                    } else {
                        console.log("Added new user!");
                    }
                    res.redirect('/login');
                })
            }
        })
    }

});
app.get('/login', (req, res) => {
    res.render('login.hbs');
});
app.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
    })(req, res, next);
});
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});
app.get('/index', (req, res) => {
    if (req.user) {
        console.log("logged In");
        res.render('index.hbs', { loggedIn: true });
    } else {
        console.log("logged out");

        res.render('index.hbs', { loggedIn: null });
    }

});
app.get('/dashboard', (req, res) => {
    if (req.user) {
        User.find({ username: req.user.username }, (err, usr) => {
            if (err) {
                console.log(err);
            } else {
                res.render('dashboard.hbs', usr[0]);
            }
        })
    } else {
        res.redirect('/login');
    }
});
app.post('/dashboard', async (req, res) => {
    if (req.user) {
        try {
            const myUser = await User.findOne({ username: req.user.username });
            myUser.receipts.push(JSON.parse(req.body.receipt));
            myUser.save((err) => {
                if (err) {
                    console.log(err);
                }
            });
            res.redirect('/dashboard');

        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    } else {
        console.log("Please Login");
        res.redirect("/login");
    }
});

app.listen(process.env.PORT || 3000);