const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();

// // load idea model
require('../models/User');
const User = mongoose.model('users');


// user login route
router.get('/login', (req, res) => {
  res.render('users/login');
  });
  

  // Login form post process

  router.post('/login', (req, res, next) => {
        passport.authenticate('local', {
          successRedirect:'/ideas',
          failureRedirect: '/users/login',
          failureFlash: true
        })(req,res,next);

  });
  
  // register route
  router.get('/register', (req, res) => {
  res.render('users/register')
  });
  
// register post

router.post('/register', (req, res) => {
  let errors = [];

  if(req.body.password != req.body.password2){
          errors.push({text:'Password do not match'});
  }if (req.body.password < 4) {
      errors.push({text:'Password must be at least 4 characters..'});
      
  }if (errors.length > 0) {
    res.render('users/register',{
      errors: errors,
      password: req.body.password,
      password2: req.body.password2,
      name: req.body.name,
      email: req.body.email
    });
  }else{
    User.findOne({email:req.body.email}).then(user => {
      if (user) {
        req.flash('error_msg','Email already exist..!');
        res.redirect('/users/login');
      } else {
        

        const newUser = new User({
          name:req.body.name,
          email: req.body.email,
          password: req.body.password
        })
        
        bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(newUser.password, salt, function(err, hash) {
            if (err) throw err;
              // Store hash in your password DB.
              newUser.password = hash;
              newUser.save().then(User => {
                req.flash('success_msg','You are now registered and can login');
                res.redirect('/users/login');
              }).catch(err => {
                console.log(err);
                return; 
              });
          });
      });


      }
    });

    

  }
});

// logout process

router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});

module.exports = router;