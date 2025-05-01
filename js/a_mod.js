$('a').click(function(e) {
    var aid = $(this).attr("href");
    var pos = document.documentElement.scrollTop;
    $('html,body').animate({scrollTop: pos});});