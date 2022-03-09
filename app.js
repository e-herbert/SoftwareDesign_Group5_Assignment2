const express = require('express')

const app = express()

const cors = require('cors');

const { Pool } = require('pg')
//const creds = require('./creds.json')

const pool = new Pool({
    host: 'jelani.db.elephantsql.com',
    user: 'cpdsuccl',
    password: '6chuY_e8WCEU3GmjQ1JGCP25W9AyvF9m',
    database: 'cpdsuccl'
});

// var fs = require('fs');
// var queries = fs.createWriteStream('queries.sql', {flags: 'a'});
// var transaction = fs.createWriteStream('transaction.sql', {flags: 'a'});

app.use(express.static('public'));

//middleware
app.use(cors());
app.use(express.json());

app.post('/login', function(req, res) {
  try{
    const {username, password} = req.body;
    var userFound = false

    //query to search user

    userFound = true
    //userFound = false

    if (userFound == true) 
    {
        console.log("user logged in");
    }

    else
    {
      console.log("Input username or password is invalid")
    }

    res.send(userFound)

  } catch(err){
      console.log(err.message)
  }
})

app.post('/register', async(req,res) => {
  try{
    const {username, password} = req.body;
    var uniqueUser = false;

    //add query to search for user 
    uniqueUser = true;
    //uniqueUser = false
    if (uniqueUser == true)
    {
      console.log("created new user");
      //res.redirect('/profile')
    }

    else
    {
      console.log("Username taken");
      
      
    }

    res.send(uniqueUser);
    res.end();

  } catch(err){
    console.log(err.message);
  }

})

app.post('/profile', function(req, res){
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
  res.send(completed);
  res.end();

})

app.listen(5000, () => {
    console.log('server is up and running')
})