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


//endpoint to authenticate user credential and send back api to client side JS for future request
app.post('/login', async(req, res)=> {
  try{
    const {userName, password} = req.body;
    var userFound = false
    var passmatch = false
    const hashedpass = await bcrypt.hash(password, 10)
    //query to search user
    const user = await pool.query(`SELECT * FROM public.userdata WHERE username='${userName}';`)
    // if(user.rowCount == 0)
    // {
    //   userFound = false;
    // }
    if(user.rowCount == 1)
    {
      userFound = true;
      console.log(user.rows)
      passfromdb = user.rows[0].pass
      console.log(passfromdb)
      console.log(password)
      
      if( await bcrypt.compare(password, passfromdb))
      {
        console.log("true")
        passmatch = true
      }
      else{
        console.log(`pass: `+await bcrypt.compare(password, passfromdb))
      }
      
    }
    //userFound = true
    //userFound = false
    console.log("User found: " + userFound);
    console.log("password match: " + passmatch);
    if (userFound && passmatch) 
    {
  
        req.session.loggedin = true;
				req.session.username = userName;
      // console.log(`SELECT * FROM public.userdata WHERE username='${userName}';`)
      // console.log(user.rowCount)
      // console.log(user.rows[0].pass)
        console.log("user logged in: " + req.session.username);
    }

    else
    {
      console.log("Input username or password is invalid")
    }
    //unit test
    console.log("connected to DB for unit test from /login endpoint")
    const demo = await pool.query(`select * from public.history;`)
    //console.log(demo.rows)

    res.send(userFound && passmatch)
    res.end()

  } catch(err){
      console.log(err.message)
  }
})

//endpoint to register user, the idea right now is to use bycrypt to encryt password and send back api to client side JS for future request
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
    const {fullname, address1, address2, city, state, zip} = req.body;
    var completed = false;
    user = req.session.username;
    console.log(user)

    if(req.session.loggedin)
    {
      const q1 = await pool.query(`select * from public.userprofile where username='${req.session.username}';`)
      console.log(`select * from public.userprofile where username='${req.session.username}';`)

      if(q1.rowCount == 1) //update
      {
        //`INSERT INTO passenger VALUES(nextval('order_passenger_id'),'${firstName}', '${lastName}', '${email}', '${phoneNum}', '${password}') RETURNING passenger_id;`
        //`select amount from  flight_details as fd where fd.flight_id=${flightId1} and fd.fare_conditions like '${class_}';`
        //INSERT INTO userProfile VALUES('admin', 'mr.bean', '5400 University of Houston', null, 'Houston', 'TX', '77001')
        //`UPDATE public.profile VALUES('${req.session.username}', '${fullname}', ${address1}', null, '${city}', '${state}', '${zip}');`

        console.log("hello from profile about to update")
        if (address2 == "")
        {
          await pool.query(`UPDATE public.userprofile SET fullname = '${fullname}', address1 = '${address1}', city = '${city}', state = '${state}', zipcode = '${zip}' WHERE username = '${user}';`)
          console.log(`UPDATE public.userprofile SET fullname = '${fullname}', address1 = '${address1}', city = '${city}', state = '${state}', zipcode = '${zip}' WHERE username = '${user}';`)
        } 

        else
        {
          await pool.query(`UPDATE public.userprofile SET fullname = '${fullname}', address1 = '${address1}', address2 = '${address2}', city = '${city}', state = '${state}', zipcode = '${zip}' WHERE username = '${user}';`)
          console.log(`UPDATE public.userprofile SET fullname = '${fullname}', address1 = '${address1}', address2 = '${address2}', city = '${city}', state = '${state}', zipcode = '${zip}' WHERE username = '${user}';`)
        }
      }

      else{
        console.log("hello from profile about to insert")
        if (address2 == "")
        {
          await pool.query(`INSERT INTO public.userprofile VALUES('${req.session.username}', '${fullname}','${address1}', null, '${city}', '${state}', '${zip}');`)
          console.log(`INSERT INTO public.userprofile VALUES('${req.session.username}', '${fullname}', ${address1}', null, '${city}', '${state}', '${zip}');`)
        } 

        else
        {
          await pool.query(`INSERT INTO public.userprofile VALUES('${req.session.username}', '${fullname}', '${address1}', '${address2}', '${city}', '${state}', '${zip}');`)
          console.log(`INSERT INTO public.userprofile VALUES('${req.session.username}', '${fullname}', ${address1}', '${address2}', '${city}', '${state}', '${zip}');`)
        }
      }

      completed = true
      console.log("Profile updated")
      //unit test
      console.log("connected to DB for unit test from /profile endpoint")
      //const demo = await pool.query(`select * from public.history;`)
      //console.log(demo.rows)
      res.send(completed);
    }
    else{
      res.send(false); //user not logged in
    }
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
        console.log(`select date, gallons, suggested_price, total_price, address1 as address  from public.history as h, public.userProfile as p where p.username = '${req.session.username}' AND h.username = '${req.session.username}';`)
        const demo = await pool.query(`select date, gallons, suggested_price, total_price, address1 as address from public.history as h, public.userProfile as p where p.username = '${req.session.username}' AND h.username = '${req.session.username}';`)
        
        console.log(demo.rows)
        res.send(demo.rows)
        res.end()
  }
  catch(err){
    console.log(err.message);
  }
})

app.post('/getQuote', async(req, res)=>{
  try{
    if (!req.session.loggedin)
    {
      console.log('user not logged in');
      //res.send(false);
      res.send(false);
    }

    else
    {
      const {date, gallons, suggestedPrice, totalAmount} = req.body;
      console.log('Quote placed for date: ' + date + ' for ' + gallons + ' gallons. Suggested price: $' + suggestedPrice + '. Total amount: $' + totalAmount);
      res.send(true);
    }
    
  } catch(err){
    console.log(err.message)
  }
})



app.listen(5000, () => {
    console.log('server is up and running')
})