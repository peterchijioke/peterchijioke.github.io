const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth');

// // load idea model
require('../models/Idea');
const Idea = mongoose.model('ideas');


// add ideas form
router.get('/add',ensureAuthenticated, (req, res) => {
  res.render('ideas/add');
  });

  // Edit ideas form
  router.get('/edit/:id',ensureAuthenticated, (req, res) => {
          Idea.findOne({
            _id: req.params.id
          }).then(idea => {
            if (idea.user!=req.user.id) {
              req.flash('error_msg', 'You are not authorized');
              res.redirect('/ideas');
            }
             res.render('ideas/edit',{
               idea: idea
             })
          })
  });

  // edit form processing
  router.put('/:id',ensureAuthenticated, (req, res) => {
        Idea.findOne({
          _id: req.params.id
        }).then(idea => {
          // new data
          idea.title = req.body.title;
          idea.details = req.body.details;
          idea.save().then(idea => {
            req.flash('success_msg','Video idea updated');
            res.redirect('/ideas');
          })
        })
  });

  // delete idea

  router.delete('/:id', ensureAuthenticated,(req, res) => {
            Idea.remove({_id: req.params.id}).then(() => {
              req.flash('success_msg','Video idea removed..!');
              res.redirect('/ideas');
            });
  });   

  // ideas index page
  router.get('/', ensureAuthenticated,(req, res) => {

    Idea.find({})
    .sort({date:'desc'})
    .then(ideas => {
        res.render('ideas/index',{
          ideas: ideas
        });
        
    });
  });

  // process form
      router.post('/',ensureAuthenticated, (req, res) => {
      let errors = [];
      if(!req.body.title){
            errors.push({text:'please add a title'});
      }if(!req.body.details){
        errors.push({text:'please add some details'});
      }if(errors.length > 0){
            res.render('add',{
              errors: errors,
              title: req.body.title,
              details: req.body.details
            });
      }else{
        const newUser = {
          title: req.body.title,
          details: req.body.details,
          user:req.user.id
        }
            new Idea(newUser).save().then(idea => {
              req.flash('success_msg','Video idea added');
              res.redirect('/ideas')
            });
      }
      });

module.exports = router;