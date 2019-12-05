const express = require('express');
const mongoose = require('mongoose');
const exphbs  = require('express-handlebars');
const path = require('path');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');


const app = express();

// load route

const ideas = require('./routes/ideas');
const users = require('./routes/users');
require('./config/passport')(passport);

// DB config

const db = require('./config/database')

// map global promise get rid of warning
mongoose.Promise = global.Promise;
// connect mongoose
mongoose.connect(db.mongoURI,{
  useMongoClient:true
})
.then(function() {
    console.log("mongodb connected");
}).catch(function(error){
  console.log(error);
});


// middleware.............................................................

// handlebars middleware
app.engine('handlebars', exphbs({ defaultLayout:'main'}));
app.set('view engine', 'handlebars');



// body parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// public folder

app.use(express.static(path.join(__dirname,'public')));

// method override middleware
app.use(methodOverride('_method'));

// express middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));

// passport session middleware
app.use(passport.initialize());
app.use(passport.session());


// flash middleware
  app.use(flash());

app.use(function(req,res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// /end middleware


app.get('/', (req, res) => {
  const title = 'WELCOME';
  const peter = 'peter';

  res.render('index', {
    title:title,
    name:peter
  });
});

app.get('/about', (req, res) => {
res.render('about');
});




// use routes

app.use('/ideas',ideas);
app.use('/users',users);

// connection
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
}); 