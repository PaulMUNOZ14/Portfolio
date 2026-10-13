document.addEventListener('DOMContentLoaded', () => {
  
  const sidebarItems = document.querySelectorAll('#projects .sidebar-item[data-target]');
  const projectPanes = document.querySelectorAll('.project-pane');
  const activeTabName = document.getElementById('active-tab-name');

   // Charge une image uniquement lorsqu'elle est nécessaire.
  function loadImage(img) {
    if (!img || img.dataset.loaded === 'true') return;

    const source = img.dataset.src;
    if (!source) return;

    img.src = source;
    img.dataset.loaded = 'true';
    img.decoding = 'async';
  }

  document.querySelectorAll('.project-slider').forEach(slider => {
    const slides = Array.from(slider.querySelectorAll('.slide'));
    const dots = Array.from(slider.querySelectorAll('.dot'));
    const prevBtn = slider.querySelector('.prev');
    const nextBtn = slider.querySelector('.next');

    if (!slides.length) return;

    let current = slides.findIndex(slide =>
      slide.classList.contains('active')
    );

    if (current < 0) current = 0;

    function show(index) {
      current = (index + slides.length) % slides.length;

      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === current);
      });

      dots.forEach((dot, i) => {
        const active = i === current;
        dot.classList.toggle('active', active);
        dot.setAttribute('aria-pressed', String(active));
      });

      if (slider.closest('.project-pane')?.classList.contains('active')) {
        loadImage(slides[current]);
      }
    }

    nextBtn?.addEventListener('click', () => show(current + 1));
    prevBtn?.addEventListener('click', () => show(current - 1));

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => show(index));
    });

    show(current);
  });

  sidebarItems.forEach(item => {
    item.setAttribute(
      'aria-selected',
      String(item.classList.contains('active'))
    );

    item.addEventListener('click', () => {
      const targetPane = document.getElementById(item.dataset.target);
      if (!targetPane) return;

      sidebarItems.forEach(el => {
        const active = el === item;
        el.classList.toggle('active', active);
        el.setAttribute('aria-selected', String(active));
      });

      projectPanes.forEach(pane => {
        pane.classList.toggle('active', pane === targetPane);
      });

      if (activeTabName) {
        activeTabName.textContent = item.textContent
          .replace(/[🎮🎨📝]/gu, '')
          .trim();
      }

      const activeSlide = targetPane.querySelector('.slide.active');
      loadImage(activeSlide);
    });
  });

  const projectsSection = document.getElementById('projects');

  if (projectsSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;

      const activePane = projectsSection.querySelector('.project-pane.active');
      loadImage(activePane?.querySelector('.slide.active'));
      observer.disconnect();
    }, { rootMargin: '300px' });

    observer.observe(projectsSection);
  } else {
    const activePane = document.querySelector(
      '#projects .project-pane.active'
    );
    loadImage(activePane?.querySelector('.slide.active'));
  }
});
