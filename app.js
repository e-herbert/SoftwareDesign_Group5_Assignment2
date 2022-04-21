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
app.post('/login', checkNotAuthenticated, async(req, res)=> {
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
		//console.log("/login> loggedin = " + req.session.loggedin);
        console.log("/login> user logged in: " + req.session.username);
		//console.log("/login> req = " + req)
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
app.post('/register', checkNotAuthenticated , async(req,res) => {
  try{
    const {username, password} = req.body;
    var uniqueUser = true;

    //add query to search for user in DB

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
      req.session.loggedin = true;
			req.session.username = username;
      console.log("user logged in: " + req.session.username);

      //res.redirect('/profile')
    }

    else
    {
      console.log("Username taken");      
      
    }
    //unit test
    console.log("connected to DB for unit test from /register endpoint")
    res.send(uniqueUser);
    res.end();

  } catch(err){
    console.log(err.message);
  }

})

//endpoint to update profile 
app.post('/profile', checkAuthenticated, async(req, res)=>{
  try
  {
    const {fullname, address1, address2, city, state, zip} = req.body;
    var completed = false;
    user = req.session.username;
    console.log(user)

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
        await pool.query(`UPDATE public.userprofile SET fullname = '${fullname}', address1 = '${address1}', address2 = null, city = '${city}', state = '${state}', zipcode = '${zip}' WHERE username = '${user}';`)
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
    res.end();
  }
  catch(err)
  {
    console.log(err.message);
  }

})

//endpoint to to query quote history and send back to client side javascript
app.post('/history', checkAuthenticated, async(req, res)=>{

  try{
        //unit test
        console.log("connected to DB for unit test from /history endpoint")
        console.log(`SELECT date, gallons, suggested_price, total_price, address as Address FROM public.history as h WHERE h.username = '${req.session.username}';`)
        const demo = await pool.query(`SELECT date, gallons, suggested_price, total_price, address as Address FROM public.history as h WHERE h.username = '${req.session.username}';`)
        
        console.log(demo.rows)
        res.send(demo.rows)
        res.end()
  }
  catch(err){
    console.log(err.message);
  }
})

// endpoint to retrieve info needed to calculate suggested price
app.post('/quoteInfo', checkAuthenticated, async(req, res) => {
	console.log("/quoteInfo> Retrieving quote info for user '" + req.session.username + "'")
	try{
		user = req.session.username;
		histQ = await pool.query(`SELECT * FROM public.history WHERE username='${user}';`);
    let histCount = histQ.rowCount;
    // console.log(histCount);
    if (histCount == 0)
    {
      hasHist=false;
    }
    else{
      hasHist=true;
    }
    // console.log(`SELECT * FROM public.history WHERE username='${user}';`)
		state = await pool.query(`SELECT state FROM public.userprofile WHERE username='${user}';`);
		state = state.rows[0]['state'];
		
		console.log("/quoteInfo> Has history: " + hasHist);
		console.log("/quoteInfo> State: " + state);
		
		res.send([hasHist, state]);
		res.end();
	}
	catch(err){
		console.log("/quoteInfo> " + err)
	}
})

// endpoint to add quotes to quote history table
app.post('/submitQuote', checkAuthenticated, async(req, res)=>{
	console.log("/submitQuote> successfully called")
	try{
		if (!req.session.loggedin)
		{
		  console.log('user not logged in');
		  //res.send(false);
		  res.send(false);
      res.end();
		}

		else
		{
		  const {date, gallons, suggestedPrice, totalAmount} = req.body;
		  console.log('Quote placed for date: ' + date + ' for ' + gallons + ' gallons. Suggested price: $' + suggestedPrice + '. Total amount: $' + totalAmount);
      const address = await pool.query(`SELECT concat(address1,' ',address2, ', ', city, ', ', state, ', ', zipcode) FROM public.userprofile WHERE username='${req.session.username}';`);
      const address1 = address.rows[0].concat
      console.log(address1)
      await pool.query(`BEGIN TRANSACTION;`);
      console.log(`INSERT INTO public.history VALUES( '${req.session.username}','${date}', '${gallons}', '${suggestedPrice}', '${totalAmount}', '${address1}');`);
      const submitquery = await pool.query(`INSERT INTO public.history VALUES( '${req.session.username}','${date}', '${gallons}', '${suggestedPrice}', '${totalAmount}', '${address1}');`)      
      await pool.query(`COMMIT TRANSACTION;`);
		  res.send(true);
      res.end();
		}
    
	} catch(err){
		console.log(err.message)
	}
})

app.post('/address', checkAuthenticated, async(req, res)=>{
  try{
    const address = await pool.query(`SELECT concat(address1,' ' ,address2, ', ', city, ', ', state, ', ', zipcode) FROM public.userprofile WHERE username='${req.session.username}';`);
    const address1 = address.rows[0].concat
    console.log("addres: " + address1)
    res.send([address1]);
    res.end();
  }
  catch(err){
    console.log(err.message)
  }
})

app.post('/username', checkAuthenticated, async(req, res)=>{
	try{
		res.send([req.session.username]);
		res.end();
	}
	catch(err){
		console.log(err.message)
	}
})

app.post('/getProfile', checkAuthenticated, async(req, res)=>{
	try{
		console.log('/getProfile> Querying profile info for user ' + req.session.username)
		profile = await pool.query(`SELECT * FROM public.userprofile WHERE username='${req.session.username}';`);
		profile = profile.rows[0]
		console.log('/getProfile> fullname: ' + profile['fullname'] + ', address1: ' + profile['address1'] + ', address2: ' + profile['address2'] + ', city: ' + profile['city'] + ', state: ' + profile['state'] + ', zipcode: ' + profile['zipcode'])
		
		res.send([profile['fullname'], profile['address1'], profile['address2'], profile['city'], profile['state'], profile['zipcode']]);
		res.end();
	}
	catch(err){
		console.log(err.message)
	}
})

app.post('/signout', checkAuthenticated,(req, res) => {
  if (req.session.loggedin) {
    req.session.destroy(err => {
      if (err) {
        res.send(false)
      } else {
        console.log("user signed out")
        console.log(req.session)
        res.send(true)
      }
    });
  } else {
    res.send(false)
    res.end()
  }
})

//endpoint to check if user updated profile right after registration or not if they haven't then we force them to update their profile
app.post('/checkNsignOut', checkAuthenticated,async(req, res) => {
  try{
    let check = await pool.query(`SELECT * FROM public.userprofile WHERE username='${req.session.username}';`)
    if (check.rowCount == 0)
    {
      res.send(false)
      res.end()
    }
    else
    {
      res.send(true)
      res.end()
    }
  }
  catch(err){
    console.log(err.message)
  }
})

app.post('/checklogin', function(req, res)  {//=> {
	//console.log("/checklogin> username = " + req.session.username)
	//console.log("/checklogin> loggedin = " + req.session.loggedin)
	res.send(req.session.loggedin == true)
})




function checkAuthenticated(req, res, next) {
  console.log("checkAuthenticated> req.session.loggedin = " + req.session.loggedin)
  if(req.session.loggedin) {
    return next();
  } else {
    res.redirect('/index.html');
  }
}

function checkNotAuthenticated(req, res, next) {
  console.log("checkNotAuthenticated> req.session.loggedin = " + req.session.loggedin)
  if(req.session.loggedin) {
    res.redirect('/profile.html');
  } else {
    return next();
  }
}

app.listen(5000, () => {
    console.log('server is up and running')
})