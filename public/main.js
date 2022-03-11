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
	
    if(username == "") 
    {
        alert("Empty User name")
    } 
    else if(password == "") 
    {
        alert("Empty password")
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
    var address1 = document.querySelector('#address1').value;
    var address2 = document.querySelector('#address2').value;
    var city = document.querySelector('#lcity').value;
    var state = document.querySelector('#states').value;
    var zip = document.querySelector('#zip').value;

    if(fullname == "")
    {
        alert("Enter full name please")
        return false;
    }

    if(address1 == "")
    {
        alert("Enter primary address please")
        return false;    
    }

    if (city == "")
    {
        alert("Enter a city please")
        return false;
    }

    if(state == "none")
    {
        alert("Please select a state from the drop down menu")
        return false;
    }

    if(zip == "")
    {
        alert("Please enter zipcode")
        return false;
    }

    if(zip.length <5 || zip.length >5)
    {
        alert("Enter valid zipcode")
        return false;
    }

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
        //location.href = "getQuote.html"
        alert("Profile updated sucessfully")
    }

    else
    {
        alert("Please complete profile")
    }
}


//pricing module
async function getSuggestedPrice(location, month, quoteHistory, gallons)
{
    let locFactor    = 0.0;
    let rhFactor     = 0.0;
    let galFactor    = 0.0;
    let rfFactor     = 0.0;
    let margin       = 0.0;
    const compFactor = 0.10;

    // CHECK LOCATION FACTOR
    if(location === 'TX')
    {
        locFactor = 0.02;
    } 
    else 
    {
        locFactor = 0.04;
    }

    // CHECK QUOTE HISTORY
    if(quoteHistory === undefined) 
    {
        rhFactor = 0.01;
    } 
    else 
    {
        rhFactor = 0.0;
    }

    // CHECK GALLON AMOUNT
    if(gallons > 1000) 
    {
        galFactor = 0.02;
    } 
    else 
    {
        galFactor = 0.03;
    }

    // CHECK RATE FLUCTUATION
    if(month === 6 || month === 7 || month === 8) 
    {
        rfFactor = 0.04;
    } else 
    {
        rfFactor = 0.03;
    }

    // MARGIN OF PRICE
    margin = 1.50 * (locFactor - rhFactor + galFactor + compFactor + rfFactor);
    
    // SUGGESTED PRICE
    return (1.50 + margin).toFixed(2);
} 

async function getTotalAmount(suggestedPrice, gallons)
{
    return (suggestedPrice * gallons).toFixed(2);
}