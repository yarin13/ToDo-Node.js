if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Task = require('./models/task');
const tasksRoutes = require('./routes/tasks');
const usersRoutes = require('./routes/users');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo').default;

const db_url = process.env.DB_URL;
mongoose.connect(db_url, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
    .then(()=>{
        console.log("MONGO CONNECTION OPEN!!")
    })
    .catch(err =>{
        console.log("MONGO CONNECTION ERROR...")
        console.log(err);
    });

app.engine('ejs', ejsMate);
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

const secret = process.env.SECRET || 'secret!';
//app.use(session({secret}));
const store = MongoStore.create({
    mongoUrl: db_url,
    secret,
    touchAfter: 24 * 60 * 60
});
const sessionConfig = {
    store,
    secret,
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        expires: Date.now() + 1000 *60 * 60 * 24 * 7,
        maxAge: 1000 *60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));



app.use((req,res,next)=>{
    res.locals.currentUser = req.session.user_id;
    next();
})


app.use('/',tasksRoutes);
app.use('/user',usersRoutes);


app.all('*',(req,res,next)=>{
    next(new ExpressError('Page Not Found',404));
});

app.use((err,req,res,next)=>{
    const {status = 500} = err;
    if(!err.message) err.message = 'Something went wrong';
    return res.status(status).render('error', { err });
});

const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`Listening on port ${port}...`);
});