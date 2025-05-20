document.addEventListener('DOMContentLoaded', () => {
  const teamCarousel = document.getElementById('teamCarousel');
  const teamDotNav = document.getElementById('teamDotNav');
  const MEMBERS_PER_PAGE = 8; // Adjust based on your preference
  
  // Fetch team members
  fetch('./data/people.json')
    .then((response) => response.json())
    .then((people) => {
      // Shuffle the array for random order
      function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
      }
      shuffleArray(people);
      
      // Calculate how many pages we need
      const pageCount = Math.ceil(people.length / MEMBERS_PER_PAGE);
      
      // Create pages
      for (let i = 0; i < pageCount; i++) {
        const startIdx = i * MEMBERS_PER_PAGE;
        const pageMembers = people.slice(startIdx, startIdx + MEMBERS_PER_PAGE);
        
        // Create carousel item
        const carouselItem = document.createElement('div');
        carouselItem.id = `team-page-${i}`;
        carouselItem.className = 'carousel-item px-4 py-6';
        
        // Create grid container with fixed column sizes
        const gridContainer = document.createElement('div');
        gridContainer.className = 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 justify-items-center';
        
        // Add team members to grid
        pageMembers.forEach(member => {
          let hoverImg = member.img_hover ? 
            `<img class="img-hover w-full h-full object-cover absolute inset-0" src="${member.img_hover}" alt="${member.name} portrait">` : "";
            
          const memberCard = document.createElement('div');
          memberCard.className = 'flex flex-col items-center text-center p-4';
          memberCard.innerHTML = `
            <div class="relative w-40 h-40 rounded-full overflow-hidden mb-4 shadow-md hover:shadow-lg transition-shadow duration-300">
              <img class="${hoverImg ? 'img-nohover' : ''} w-full h-full object-cover" src="${member.img}" alt="${member.name} portrait">
              ${hoverImg}
            </div>
            <div class="text-center w-full">
              <div class="font-bold text-lg mb-1 line-clamp-1">${member.name}</div>
              <p class="text-gray-700 text-sm line-clamp-2">${member.job}</p>
            </div>
          `;
          
          gridContainer.appendChild(memberCard);
        });
        
        // If we need to fill empty slots to maintain grid consistency
        const emptySlots = MEMBERS_PER_PAGE - pageMembers.length;
        for (let j = 0; j < emptySlots; j++) {
          const emptyCard = document.createElement('div');
          emptyCard.className = 'flex flex-col items-center text-center p-4 opacity-0';
          emptyCard.innerHTML = `
            <div class="relative w-40 h-40 rounded-full mb-4">
              <div class="w-full h-full"></div>
            </div>
            <div class="text-center w-full">
              <div class="font-bold text-lg mb-1">Empty</div>
              <p class="text-gray-700 text-sm">Empty</p>
            </div>
          `;
          gridContainer.appendChild(emptyCard);
        }
        
        carouselItem.appendChild(gridContainer);
        teamCarousel.appendChild(carouselItem);
        
        // Create navigation dot
        const dot = document.createElement('button');
        dot.className = 'h-2 w-2 rounded-full bg-gray-300 transition-colors';
        dot.onclick = () => carouselItem.scrollIntoView({behavior:'smooth', inline:'center'});
        teamDotNav.appendChild(dot);
      }
      
      // Set up intersection observer for dots
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          const idx = [...teamCarousel.querySelectorAll('.carousel-item')].indexOf(e.target);
          teamDotNav.children[idx].classList.add('bg-blue-600');
          [...teamDotNav.children].forEach((d, j) =>
            j !== idx && d.classList.remove('bg-blue-600'));
        });
      }, {root: teamCarousel, threshold: 0.6});
      
      teamCarousel.querySelectorAll('.carousel-item').forEach(item => io.observe(item));
    })
    .catch(error => console.error('Error loading team members:', error));
});









