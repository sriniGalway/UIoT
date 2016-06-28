
aa = aa || {};

aa.sideSidr = null;

$(function () {
      // smooth scroll on About Page internal navigation
      $('#back-to-top, .in-page-nav a, #sidr a').on('click', function(e){
        var target = $(this).attr('href');

        $('html, body').animate({
            scrollTop: $(target).offset().top
        }, 1000);

        if(aa.sideSidr !== null && ($('#sidr:visible'))){
            // console.log('hit');
            aa.sideSidr.sidr('close');
        }
      });

    

    
    
    
});

$(document).ready(function(){

    if($('#internal-nav-btn').length > 0){

        aa.sideSidr = $('#internal-nav-btn').sidr({
            name: 'sidr',
        });

        $('#close-sidr').on('click', function(){
             $.sidr('close', 'sidr');
        });

    
        var sticky = new Waypoint.Sticky({
          element: $('#internal-nav-btn')
        });
    }

    // GA Event: Report download
    $(document).ready(function(){
        $('a.report-download').on('click', function(){
            ga('send', 'event', 'button', 'report-download', $(this).data('title'));            
        });
    });
});