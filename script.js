document.addEventListener('DOMContentLoaded', () => {

  /* =========================
      LIGHTBOX (zoom d'image)
  ========================= */
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-label', 'Image agrandie');
  lightbox.innerHTML = `
    <button type="button" class="lightbox-btn lightbox-close" aria-label="Fermer">&#10005;</button>
    <button type="button" class="lightbox-btn lightbox-prev" aria-label="Image précédente">&#10094;</button>
    <img class="lightbox-img" alt="">
    <button type="button" class="lightbox-btn lightbox-next" aria-label="Image suivante">&#10095;</button>
    <p class="lightbox-caption"></p>`;
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const lightboxPrev = lightbox.querySelector('.lightbox-prev');
  const lightboxNext = lightbox.querySelector('.lightbox-next');
  const lightboxClose = lightbox.querySelector('.lightbox-close');

  let lightboxSlider = null; // { slides, show, getCurrent }
  let lastFocused = null;

  function renderLightbox() {
    const slide = lightboxSlider.slides[lightboxSlider.getCurrent()];
    // `src` = version pleine résolution (le srcset ne sert qu'à alléger l'affichage normal)
    lightboxImg.src = slide.getAttribute('src');
    lightboxImg.alt = slide.alt;
    lightboxCaption.textContent = slide.alt;
  }

  function openLightbox(slider) {
    lightboxSlider = slider;
    lastFocused = document.activeElement;
    const several = slider.slides.length > 1;
    lightboxPrev.hidden = !several;
    lightboxNext.hidden = !several;
    renderLightbox();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightboxImg.removeAttribute('src');
    document.body.style.overflow = '';
    lightboxSlider = null;
    if (lastFocused) lastFocused.focus();
  }

  function stepLightbox(delta) {
    if (!lightboxSlider || lightboxSlider.slides.length < 2) return;
    lightboxSlider.show(lightboxSlider.getCurrent() + delta);
    renderLightbox();
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', () => stepLightbox(-1));
  lightboxNext.addEventListener('click', () => stepLightbox(1));
  lightbox.addEventListener('click', event => {
    // clic sur le fond ou sur l'image : fermeture (les boutons gèrent leurs propres clics)
    if (event.target === lightbox || event.target === lightboxImg) closeLightbox();
  });

  document.addEventListener('keydown', event => {
    if (!lightbox.classList.contains('open')) return;
    if (event.key === 'Escape') closeLightbox();
    else if (event.key === 'ArrowLeft') stepLightbox(-1);
    else if (event.key === 'ArrowRight') stepLightbox(1);
  });

  /* =========================
      SLIDERS
  ========================= */
  document.querySelectorAll('.project-slider').forEach(slider => {
    const slides = Array.from(slider.querySelectorAll('.slide'));
    if (!slides.length) return;

    let current = Math.max(0, slides.findIndex(slide => slide.classList.contains('active')));
    let dots = [];

    function show(index) {
      current = (index + slides.length) % slides.length;

      slides.forEach((slide, i) => {
        const active = i === current;
        slide.classList.toggle('active', active);
        slide.setAttribute('aria-hidden', String(!active));
        if (active) {
          slide.setAttribute('tabindex', '0');
          slide.setAttribute('role', 'button');
          slide.setAttribute('aria-label', `Agrandir : ${slide.alt}`);
        } else {
          slide.removeAttribute('tabindex');
          slide.removeAttribute('role');
          slide.removeAttribute('aria-label');
        }
      });

      dots.forEach((dot, i) => {
        const active = i === current;
        dot.classList.toggle('active', active);
        dot.setAttribute('aria-pressed', String(active));
      });
    }

    // Flèches et points uniquement s'il y a plusieurs images
    if (slides.length > 1) {
      const prevBtn = document.createElement('button');
      prevBtn.type = 'button';
      prevBtn.className = 'slider-btn prev';
      prevBtn.setAttribute('aria-label', 'Image précédente');
      prevBtn.innerHTML = '&#10094;';

      const nextBtn = document.createElement('button');
      nextBtn.type = 'button';
      nextBtn.className = 'slider-btn next';
      nextBtn.setAttribute('aria-label', 'Image suivante');
      nextBtn.innerHTML = '&#10095;';

      const dotsWrap = document.createElement('div');
      dotsWrap.className = 'slider-dots';
      dots = slides.map((_, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'dot';
        dot.setAttribute('aria-label', `Afficher l'image ${i + 1}`);
        dot.addEventListener('click', () => show(i));
        dotsWrap.appendChild(dot);
        return dot;
      });

      prevBtn.addEventListener('click', () => show(current - 1));
      nextBtn.addEventListener('click', () => show(current + 1));
      slider.append(prevBtn, nextBtn, dotsWrap);
    }

    // Clic (ou Entrée) sur l'image affichée : zoom
    const api = { slides, show, getCurrent: () => current };
    slider.addEventListener('click', event => {
      if (event.target.closest('.slide.active')) openLightbox(api);
    });
    slider.addEventListener('keydown', event => {
      if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('.slide.active')) {
        event.preventDefault();
        openLightbox(api);
      }
    });

    show(current);
  });

  /* =========================
      NAVIGATION ENTRE PROJETS
  ========================= */
  const sidebarItems = document.querySelectorAll('#projects .sidebar-item[data-target]');
  const projectPanes = document.querySelectorAll('.project-pane');
  const activeTabName = document.getElementById('active-tab-name');

  sidebarItems.forEach(item => {
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
        activeTabName.textContent = item.dataset.title || item.textContent.trim();
      }
    });
  });
});
