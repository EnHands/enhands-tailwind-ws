document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.getElementById('carousel');
    const pages    = carousel.querySelectorAll('.carousel-item');
    const nav      = document.getElementById('dotNav');
  
    pages.forEach((page, i) => {
      const dot = document.createElement('button');
      dot.className =
        'h-2 w-2 rounded-full bg-gray-300 transition-colors';
      dot.onclick = () =>
        page.scrollIntoView({behavior:'smooth', inline:'center'});
      nav.appendChild(dot);
    });
  
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const idx = [...pages].indexOf(e.target);
        nav.children[idx].classList.add('bg-blue-600');
        [...nav.children].forEach((d, j) =>
          j !== idx && d.classList.remove('bg-blue-600'));
      });
    }, {root: carousel, threshold: 0.6});
  
    pages.forEach(p => io.observe(p));
  });