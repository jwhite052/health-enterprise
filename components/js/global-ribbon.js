$(document).ready(function() {
  var is_mobile;

  /* Detects mobile browser */
  if( navigator.userAgent.match(/Mobi/i)
    || navigator.userAgent.match(/Android/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/Silk/i)
    || navigator.userAgent.match(/Kindle/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Opera Mini/i)
    || navigator.userAgent.match(/Opera Mobi/i) ) {
      is_mobile = true;
      console.log("Device: mobile");
  }
  else {
    is_mobile = false;
    console.log("Device: desktop");
  }

  /* Sets link href */
  $("#global-navigation .navbar-phone-1 > a, #global-navigation .navbar-phone-2 > a").click(function(e) {
    if (is_mobile) {
      var link_href = $(this).attr("data-tel-mobile");
      link_href = link_href.replace(/\s+/g, ''); /* remove white space */
      if (link_href.substr(0,4) != "tel:") {
        link_href = "tel:" + link_href;
        $(this).attr("href", link_href).attr("target","_blank"); /* new window for phone dialer */
      }
    }
  });
});

  (function($){
$(document).ready(function(){
  $('ul.dropdown-menu [data-toggle=dropdown]').on('click', function(event) {
    event.preventDefault();
    event.stopPropagation();
    $(this).parent().siblings().removeClass('open');
    $(this).parent().toggleClass('open');
  });
});
})(jQuery);
