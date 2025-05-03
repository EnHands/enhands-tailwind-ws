document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.partners-track');
    
    // Fetch partners data
    fetch('./data/supporter.json')
      .then(response => response.json())
      .then(partners => {
        // Duplicate partners for seamless looping
        const duplicatedPartners = [...partners, ...partners];
        
        // Create partner logos
        duplicatedPartners.forEach(partner => {
          const logoLink = document.createElement('a');
          logoLink.href = partner.url;
          logoLink.target = "_blank";
          logoLink.rel = "noopener noreferrer";
          logoLink.className = 'partner-logo';
          logoLink.dataset.tier = partner.tier;
          logoLink.title = partner.name;
          
          const logoImg = document.createElement('img');
          logoImg.src = partner.img;
          logoImg.alt = `${partner.name} logo`;
          logoImg.loading = "lazy";
          
          logoLink.appendChild(logoImg);
          track.appendChild(logoLink);
        });
        
        // Adjust animation duration based on number of partners
        const duration = partners.length * 2;
        track.style.animationDuration = `${duration}s`;
        
        // Handle hover pause
        track.addEventListener('mouseenter', () => {
          track.style.animationPlayState = 'paused';
        });
        
        track.addEventListener('mouseleave', () => {
          track.style.animationPlayState = 'running';
        });
      })
      .catch(error => {
        console.error('Error loading partners:', error);
        track.innerHTML = '<p class="text-center">Our partners will be displayed here soon.</p>';
      });
  });