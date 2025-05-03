$('a').not('[href^="#"]').click(function(e) {
    // Preserve current scroll position for non-anchor links (e.g., external or mailto)
    var pos = document.documentElement.scrollTop;
    $('html,body').animate({scrollTop: pos});
});