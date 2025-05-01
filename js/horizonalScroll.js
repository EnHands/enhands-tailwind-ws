const scrollDiv = document.querySelector(".scrollable-div")
const mask1 = document.querySelector(".mask1")
const mask2 = document.querySelector(".mask2")
const model = document.querySelector(".model")
const arrow = document.querySelector(".arrow")
const scrollContainer = document.getElementById("scroll-container")


// Function to update scroll position and container width
function updateScrollInfo() {
    var progress = scrollDiv.scrollLeft/((scrollDiv.scrollWidth - scrollContainer.offsetWidth))
    mask1.setAttribute("width",progress*344)
    mask2.setAttribute("width",progress*344)
    
}

// Initial update
updateScrollInfo();

// Add an event listener to track scroll changes
scrollDiv.addEventListener("scroll", updateScrollInfo);



