document.addEventListener('DOMContentLoaded', function() {
  const carouselWrapper = document.querySelector('.team-carousel-wrapper');
  const prevBtn = document.querySelector('.carousel-nav-btn.prev');
  const nextBtn = document.querySelector('.carousel-nav-btn.next');
  let teamMembers = [];
  let currentSlide = 0;
  const membersPerSlide = 12; // 6 columns × 2 rows

  // Board members data
  const boardMembers = {
    'Sonja Groß': { role: 'Chairman', class: 'chairman' },
    'Leon Kiesgen': { role: 'Deputy Chairman', class: 'deputy' },
    'Julia Veloso de Oliveira': { role: 'Secretary', class: 'secretary' },
    'Vincent Bürgin': { role: 'Treasurer', class: 'treasurer' },
    'Johannes Frey': { role: 'Advisor', class: 'advisor' }
  };

  // Fetch team data
  fetch('/data/people.json')
    .then(response => response.json())
    .then(data => {
      teamMembers = data;
      renderCarousel();
      updateCarousel();
    })
    .catch(error => console.error('Error loading team:', error));

  function renderCarousel() {
    carouselWrapper.innerHTML = '';
    const totalSlides = Math.ceil(teamMembers.length / membersPerSlide);
    
    for (let i = 0; i < totalSlides; i++) {
      const slide = document.createElement('div');
      slide.className = 'team-carousel-slide';
      
      const slideMembers = teamMembers.slice(i * membersPerSlide, (i + 1) * membersPerSlide);
      
      slideMembers.forEach(member => {
        const card = document.createElement('div');
        card.className = 'team-carousel-card';
        
        // Add board member classes
        if (boardMembers[member.name]) {
          card.classList.add('board-member', boardMembers[member.name].class);
        }
        
        // Image container
        const imgContainer = document.createElement('div');
        imgContainer.className = 'team-carousel-image-container';
        
        // Main image
        const img = document.createElement('img');
        img.className = 'team-carousel-image';
        img.src = member.img;
        img.alt = member.name;
        imgContainer.appendChild(img);
        
        // Hover image
        if (member.img_hover) {
          const hoverImg = document.createElement('img');
          hoverImg.className = 'team-carousel-image hover';
          hoverImg.src = member.img_hover;
          hoverImg.alt = `${member.name} (fun)`;
          imgContainer.appendChild(hoverImg);
          
          imgContainer.addEventListener('mouseenter', () => {
            img.style.opacity = '0';
            hoverImg.style.opacity = '1';
          });
          
          imgContainer.addEventListener('mouseleave', () => {
            img.style.opacity = '1';
            hoverImg.style.opacity = '0';
          });
        }
        
        // Name container with both name and role
        const nameContainer = document.createElement('div');
        nameContainer.className = 'team-carousel-name-container';
        
        const name = document.createElement('div');
        name.className = 'team-name team-carousel-name';
        name.textContent = member.name;
        
        nameContainer.appendChild(name);
        
        // Add role text if board member
        if (boardMembers[member.name]) {
          const role = document.createElement('div');
          role.className = 'team-role team-carousel-name';
          role.textContent = boardMembers[member.name].role;
          nameContainer.appendChild(role);
        }
        
        // Job title
        const job = document.createElement('p');
        job.className = 'team-carousel-job';
        job.textContent = member.job;
        
        card.appendChild(imgContainer);
        card.appendChild(nameContainer);
        card.appendChild(job);
        
        slide.appendChild(card);
      });
      
      carouselWrapper.appendChild(slide);
    }
  }

  function updateCarousel() {
    const slideWidth = document.querySelector('.team-carousel-slide').offsetWidth;
    carouselWrapper.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
    
    // Show/hide nav buttons based on position
    const totalSlides = Math.ceil(teamMembers.length / membersPerSlide);
    prevBtn.style.display = currentSlide === 0 ? 'none' : 'flex';
    nextBtn.style.display = currentSlide >= totalSlides - 1 ? 'none' : 'flex';
  }

  prevBtn.addEventListener('click', () => {
    currentSlide = Math.max(0, currentSlide - 1);
    updateCarousel();
  });

  nextBtn.addEventListener('click', () => {
    const totalSlides = Math.ceil(teamMembers.length / membersPerSlide);
    currentSlide = Math.min(totalSlides - 1, currentSlide + 1);
    updateCarousel();
  });

  window.addEventListener('resize', updateCarousel);
});