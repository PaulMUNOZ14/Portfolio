document.addEventListener('DOMContentLoaded', () => {
  
  // --- 1. Logique du Toggle des projets (Style Editeur de texte) ---
  const sidebarItems = document.querySelectorAll('#projects .sidebar-item');
  const projectPanes = document.querySelectorAll('.project-pane');
  const activeTabName = document.getElementById('active-tab-name');

  sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
      // Retirer la classe 'active' de la sidebar
      sidebarItems.forEach(el => el.classList.remove('active'));
      item.classList.add('active');
      
      // Mettre à jour le nom dans l'onglet
      const fileName = item.textContent.replace(/[🎮🌐🎨]/g, '').trim(); 
      activeTabName.textContent = fileName;

      // Masquer tous les projets
      projectPanes.forEach(pane => pane.classList.remove('active'));

      // Afficher le projet correspondant
      const targetId = item.getAttribute('data-target');
      document.getElementById(targetId).classList.add('active');
    });
  });

  // --- 2. Logique du Slider des images ---
  document.querySelectorAll('.project-slider').forEach(slider => {
    const slides = slider.querySelectorAll('.slide');
    const dots   = slider.querySelectorAll('.dot');
    const prevBtn = slider.querySelector('.prev');
    const nextBtn = slider.querySelector('.next');
    let current = 0;

    function show(idx) {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = (idx + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
    }

    if (nextBtn && prevBtn) {
      nextBtn.addEventListener('click', () => show(current + 1));
      prevBtn.addEventListener('click', () => show(current - 1));
    }
    
    dots.forEach((d, i) => d.addEventListener('click', () => show(i)));
  });

});