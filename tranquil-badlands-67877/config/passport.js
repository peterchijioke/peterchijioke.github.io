const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// const passport = require('passport');


// // load idea model

const User = mongoose.model('users');

module.exports = function(passport){
    passport.use(new LocalStrategy({usernameField:'email'},(email,password, done) => {
      // match user
     User.findOne({email:email}).then(user => {
       if (!user) {
         return done(null, false, {message: 'No user found..'});
       } 

      //  match password

      bcrypt.compare(password, user.password, function(err, isMatch){
        if (err) {throw err;}
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, {message: 'Password Incorrect..'});
        }
      })
     })
      
    }));


// serialize password

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


}