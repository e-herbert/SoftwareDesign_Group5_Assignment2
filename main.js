$(function () {
    $(window).on('scroll', function () {
        if ( $(window).scrollTop() > 10 ) {
            $('.navbar').addClass('active');
        } else {
            $('.navbar').removeClass('active');
        }
    });
});

(function($){"use strict";})(jQuery);

async function getQuote()
{
    // var quote_data = document.querySelector('#quote');
    // quote_data.innerHTML="<b>Suggested Price: $###<br/>  Total Amount Due: $###<br/>"

    alert("Suggested Price: $3.55\nTotal Amount Due: $350.00")
        
    
    //quote_data.innerHTML += "<b>Ticket Number: " + booking[i].ticket_no + "  |  </b>Booking Reference: " + booking[i].book_ref + "  |  Passenger ID: " + booking[i].passenger_id + "<br/>";
    
}