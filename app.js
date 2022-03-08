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

app.post('/login', async(req, res) => {
  try{
    const {username, password} = req.body;
    var userFound = false

    //query to search user

    userFound = true

    if (userFound == true) 
    {
        console.log("success");
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

app.listen(5000, () => {
    console.log('server is up and running')
})