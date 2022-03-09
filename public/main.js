// $(function () {
//     $(window).on('scroll', function () {
//         if ( $(window).scrollTop() > 10 ) {
//             $('.navbar').addClass('active');
//         } else {
//             $('.navbar').removeClass('active');
//         }
//     });
// });

// (function($){"use strict";})(jQuery);

async function getQuote()
{
    // var quote_data = document.querySelector('#quote');
    // quote_data.innerHTML="<b>Suggested Price: $###<br/>  Total Amount Due: $###<br/>"

    var gallons = document.querySelector("#gallons").value;
    var date = document.querySelector("#end_date").value;

    if(gallons.length <= 0)
    {
        alert("Please enter gallons")
        return false;
    }

    if(date.length <= 0)
    {
        alert("Please enter Date")
        return false;
    }

    alert("Suggested Price: $3.55\nTotal Amount Due: $350.00")
    

    //create pricing module
    
    //quote_data.innerHTML += "<b>Ticket Number: " + booking[i].ticket_no + "  |  </b>Booking Reference: " + booking[i].book_ref + "  |  Passenger ID: " + booking[i].passenger_id + "<br/>";
    
}
/*
async function login()
{
    var userName = document.querySelector("#user").value;
    var password = document.querySelector('#pass').value;
    var val = true;

    if(userName == "")
    {
        alert("Empty username")
        val = false;
    }

    if(password == "" && val)
    {
        alert("Empty password")
        val = false;
    }
    //redirecting to getquote page
    //window.location("www.google.com");
    console.log("True");

    if(val == true)
    {
        redirect();
    }

    //location.href = "getQuote.html";
    
    console.log("success");
    //proceed to validate login details with the DB

    const body = { userName : userName, password : password }; 
    // connect to heroku, remove localhost:port
    const response = await fetch("http://localhost:5000/login", 
    {        
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    } ); 
}*/

async function login()
{
    var userName = document.querySelector("#user").value;
    var passwd = document.querySelector('#pass').value;

    if(userName == "") 
    {
        alert("Empty username");
    } 
    else if(passwd == "") 
    {
        alert("Empty password");
    }
    else
    {
        //validating login details with the DB
        const body = { userName : userName, password : passwd }; 
        // connect to heroku, remove localhost:port
        const response = await fetch("http://localhost:5000/login", 
        {        
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        } ); 

        const creds = await response.json();

        if (creds == true)
        {
            location.href = "getQuote.html"
        }

        else
        {
            alert("Invalid username or password. Please try again.")
        }
    }
    console.log(creds);
}

async function register()
{
    var username = document.querySelector("#user").value;
    var password = document.querySelector('#pass').value;
    var val = true;
    if(username == "") 
    {
        alert("Empty User name")
        val = false;
    } 
    
    else if(password == "" && val) 
    {
        alert("Empty password")
        val = false;
    } 

    else
    {
        //create a new user in the db
        const body = { username : username, password : password }; 
        // connect to heroku, remove localhost:port
        const response = await fetch("http://localhost:5000/register", 
        {        
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        } ); 

        const uniqueUser = response.json();

        if (uniqueUser)
        {
            location.href = "profile.html"
        }

        else
        {
            alert("Username is already in use. Please choose another username")
        }
    }
}

async function profile()
{
    var fullname = document.querySelector('#name').value;
    var address1 = document.queryselector('#address1').value;
    var address2 = document.queryselector('#address2').value;
    var city = document.querySelector('#lcity').value;
    var state = document.querySelector('#states').value;
    var zip = document.querySelector('#zipcode').value;

    //proceed to make changes to the DB if not alerted.

    const body = { fullname : fullname, address1 : address1, address2 : address2, city : city, state : state, zip : zip }; 
    // connect to heroku, remove localhost:port

    //check why this part isn't working
    const response = await fetch("http://localhost:5000/profile", 
    {        
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    } ); 

    const completed = response.json();

    if (completed)
    {
        location.href = "getQuote.html"
        alert("Why am I still here?")
    }

    else
    {
        alert("Please complete profile")
    }
}