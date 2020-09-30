require("dotenv").config(); //for importing secret variables

var path = require("path") //provides utilities for working with directories
var mongoose = require("mongoose"); //for database
var express = require("express");
var exphbs = require('express-handlebars'); //template engine for rendering html and css
var methodOverride = require('method-override') //used for changing the method 

var bodyParser = require("body-parser"); // for parsing body to get info in json format
var passport = require("passport"); // for log in and log out 
var cookieParser = require("cookie-parser"); // for parsing cookies
var cors = require("cors"); // for running the app in any evironment
var sessions = require('express-session'); // for saving sessions of users
var MongoStore = require('connect-mongo')(sessions) //...

const pass = require('./pspt/passport')

pass(passport) // invoking passport


//connecting DB (mongo atlas)
const connectDatabase = async() => {
    try {
        const connectvar = await mongoose.connect(process.env.DATABASE, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        })
        console.log(`Db connected : ${connectvar.connection.host}`);
    } catch (err) {
        console.log(err)
        process.exit(1)
    }
}

connectDatabase()


var app = express();

//middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use(express.urlencoded({ extended: false }))


app.use(methodOverride(function(req, res) {
        if (req.body && typeof req.body === 'object' && '_method' in req.body) {
            // look in urlencoded POST bodies and delete it
            var method = req.body._method
            delete req.body._method
            return method
        }
    }))
    // helpers

const { formatDate, stripTags, truncate, editIcon } = require('./helper/hbs') //different functions to helpout in frontend

//handlebars
// using handlebars and declaring helpers and structure
app.engine(
    '.hbs',

    exphbs({
        helpers: {
            formatDate,
            stripTags,
            truncate,
            editIcon,
        },
        defaultLayout: 'main',
        extname: '.hbs'
    })
);

app.set('view engine', '.hbs');

//session..
//saves session of user in the DB
app.use(sessions({
    secret: 'hell-o',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}))

// passport
app.use(passport.initialize())
app.use(passport.session())

//static folders

app.use(express.static(path.join(__dirname, 'public')))
    //routes
    /*var authRoutes = require("./routes/auth");
    var userRoutes = require("./routes/user");
    var categoryRoutes = require("./routes/category");*/

//routes

var loginRoutes = require("./routes/login");
var dashboardRoutes = require("./routes/dashboard");
var authRoutes = require("./routes/auth");
const { session } = require("passport");
var expAdd = require('./routes/experience');
var aboutRoutes = require('./routes/about');


// method override

// setting global

app.use((req, res, next) => {
    res.locals.user = req.user || null
    next()
})

// my routes
app.use('/', loginRoutes)
app.use('/auth', authRoutes)
app.use('/', dashboardRoutes)
app.use('/experiences', expAdd)
app.use('/about', aboutRoutes)


//PORT
const port = process.env.PORT || 3000;

//starting server
app.listen(port, () => {
    console.log(`app is running at ${port}`);
});