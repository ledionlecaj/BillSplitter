const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = mongoose.model('User');

module.exports = function (passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'username' }, (username, password, done) => {
            User.findOne({ username: username })
                .then(usr => {
                    if (!usr) {
                        return done(null, false, { msg: "Username not registered" });
                    } else {
                        bcrypt.compare(password, usr.password, (err, isMatch) => {
                            if (err) {
                                console.log(err);
                            }
                            if (isMatch) {
                                return done(null, usr);
                            } else {
                                return done(null, false, { msg: "Incorrect password" });
                            }
                        })
                    }
                })
                .catch(err => console.log(err));
        })
    );


    passport.serializeUser((usr, done) => {
        done(null, usr.id);
    });
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, usr) => {
            done(err, usr);
        })
    });

}