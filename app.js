// if(process.env.NODE_ENV != 'production'){
//   require('dotnev').config()
// }
const express = require('express')

const app = express()

const cors = require('cors');

const { Pool } = require('pg')

const bcrypt = require('bcrypt')
//const creds = require('./creds.json')
//const flash = require('express-flash')
const session = require('express-session')

// const passport = require('passport')
// const initializePassport = require('./passport-config')
// initializePassport(passport)

const pool = new Pool({
    host: 'jelani.db.elephantsql.com',
    user: 'cpdsuccl',
    password: '6chuY_e8WCEU3GmjQ1JGCP25W9AyvF9m',
    database: 'cpdsuccl'
});


app.use(express.static('public'));

//middleware
app.use(cors());
app.use(express.json());
// app.use(flash())
// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   resave: fasle,
//   saveUninitialized: false
// }))
// app.use(passport.initialize())
// app.use(passport.session())

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

//endpoint to authenticate user credential and send back api to client side JS for future request
app.post('/login', async(req, res)=> {
  try{
    const {userName, password} = req.body;
    var userFound = false
    var passmatch = false

    //query to search user
    const user = await pool.query(`SELECT * FROM public.userdata WHERE username='${userName}';`)
    if(user.rowCount == 0)
    {
      userFound = false;
    }
    else if(user.rowCount == 1)
    {
      console.log(user.rows)
      passfromdb = user.rows[0].pass

    }
    userFound = true
    //userFound = false

    if (userFound == true) 
    {
      // console.log(`SELECT * FROM public.userdata WHERE username='${userName}';`)
      // console.log(user.rowCount)
      // console.log(user.rows[0].pass)
        console.log("user logged in");
    }

    else
    {
      console.log("Input username or password is invalid")
    }
    //unit test
    console.log("connected to DB for unit test from /login endpoint")
    const demo = await pool.query(`select * from public.history;`)
    //console.log(demo.rows)

    res.send(userFound)

  } catch(err){
      console.log(err.message)
  }
})

//endpoint to register user, the idea right not is to use bycrypt to encryt password and send back api to client side JS for future request
app.post('/register', async(req,res) => {
  try{
    const {username, password} = req.body;
    var uniqueUser = false;

    //add query to search for user 
    uniqueUser = true;

    const check = await pool.query(`SELECT * FROM public.userdata WHERE username='${username}';`)
    console.log(`SELECT * FROM userdata WHERE username=${username};`)
    if(check.rowCount != 0)
    {
      uniqueUser = false;
    }

    //uniqueUser = false
    if (uniqueUser == true)
    {
      const hashedpass = await bcrypt.hash(password, 10)
      console.log("Creating new user " + username + " " + password);
      const beg_transaction = await pool.query(`BEGIN TRANSACTION;`)
      console.log(`INSERT INTO public.userdata VALUES('${username}', '${hashedpass}');`)
      const query = await pool.query(`INSERT INTO public.userdata VALUES('${username}', '${hashedpass}');`)
      const end_transaction = await pool.query(`COMMIT TRANSACTION;`)
      console.log("created new user");
      //res.redirect('/profile')
    }

    else
    {
      console.log("Username taken");      
      
    }
    //unit test
    console.log("connected to DB for unit test from /register endpoint")
    const demo = await pool.query(`select * from public.history;`)
    //console.log(demo.rows)

    res.send(uniqueUser);
    res.end();

  } catch(err){
    console.log(err.message);
  }

})

//endpoint to update profile 
app.post('/profile', async(req, res)=>{
  try
  {
    const {username, password, address1, address2, city, state, zip} = req.body;
    var completed = false;

    console.log("hello from profile about to update")
    if (address2 == "")
    {
        //query to update profile in db when address2 is empty
    }

    else
    {
        //query to update profile in db when address2 is not empty
    }

    completed = true
    console.log("Profile updated")
    //unit test
    console.log("connected to DB for unit test from /profile endpoint")
    const demo = await pool.query(`select * from public.history;`)
    //console.log(demo.rows)
    res.send(completed);
    res.end();
  }
  catch(err)
  {
    console.log(err.message);
  }

})

//endpoint to to query quote history and send back to client side javascript
app.post('/history', async(req, res)=>{

  try{
        //unit test
        console.log("connected to DB for unit test from /history endpoint")
        const demo = await pool.query(`select date, gallons, suggested_price, total_price, address1 as address  from public.history as h, public.userProfile as p where p.username=h.username;`)
        //console.log(demo.rows)
        res.send(demo.rows)
        res.end()
  }
  catch(err){
    console.log(err.message);
  }
})



app.listen(5000, () => {
    console.log('server is up and running')
})