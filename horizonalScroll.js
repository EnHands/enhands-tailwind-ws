
const scrollDiv = document.querySelector(".scrollable-div")
const mask1 = document.querySelector(".mask1")
const mask2 = document.querySelector(".mask2")
const model = document.querySelector(".model")
const arrow = document.querySelector(".arrow")
const scrollContainer = document.getElementById("scroll-container")
//const containerWidthSpan = document.getElementById("container-width");






// Function to update scroll position and container width
function updateScrollInfo() {
    console.log(" scrollWidth" ,scrollDiv.scrollWidth)
    console.log(" Div Width" ,scrollContainer.offsetWidth)
    console.log(" Left" ,scrollDiv.scrollLeft)
    var progress = scrollDiv.scrollLeft/((scrollDiv.scrollWidth - scrollContainer.offsetWidth))
    console.log(progress*344)
    mask1.setAttribute("width",progress*344)
    mask2.setAttribute("width",progress*344)
    
}

// Initial update
updateScrollInfo();

// Add an event listener to track scroll changes
scrollDiv.addEventListener("scroll", updateScrollInfo);


/* 
function scrollHorzintal(ev) {
    console.log("ScrollTop",scrollDiv.getBoundingClientRect().top)
    const containerTop= scrollDiv.getBoundingClientRect().top
    
    // Calculate the horizontal scroll value based on wheel delta
    const newScrollLeft = scrollDiv.scrollLeft + ev.deltaY + ev.deltaX;
        
    // Ensure the newScrollLeft value stays within the scrollable content's bounds
    const maxScrollLeft = scrollDiv.scrollWidth - scrollDiv.clientWidth;

    
    if (((ev.deltaY < 0) && scrollDiv.scrollLeft <= 1) || ((ev.deltaY > 0) && scrollDiv.scrollLeft >= (maxScrollLeft-1)) || (containerTop < 0 && (ev.deltaY < 0)) || ((containerTop > 0 && (ev.deltaY > 0)))) {
        // scroll normal 
        console.log("Normal Scroll")
    }else{
        console.log("Horizonal Scroll")
        ev.preventDefault();  // stop scrolling in another direction

        scrollDiv.scrollLeft = scrollDiv.scrollLeft +  (ev.deltaY);

        
        scrollDiv.scrollLeft = Math.max(0, Math.min(maxScrollLeft, newScrollLeft));
        console.log("MAX_LEFT",maxScrollLeft)
    }


    console.log(ev.deltaY,ev.deltaX)
    console.log(scrollDiv.scrollLeft)
  }






scrollDiv.addEventListener('wheel',scrollHorzintal)
// handle up/down scrollwheel on the scroller, as most folks don't have horizontal scroll

*/ 



