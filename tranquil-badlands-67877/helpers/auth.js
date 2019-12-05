module.exports = {
  ensureAuthenticated: function(req,res,next){
        if (req.isAuthenticated()) {
          return next()
        }
        req.flash('error_msg', 'You are not Authorized.');
        res.redirect('/users/login');
  }
}