const sliders = document.querySelectorAll(".project-slider");

sliders.forEach(slider => {

  const slides = slider.querySelectorAll(".slide");
  const dots = slider.querySelectorAll(".dot");

  const prevBtn = slider.querySelector(".prev");
  const nextBtn = slider.querySelector(".next");

  let current = 0;

  function showSlide(index) {

    slides.forEach(slide => {
      slide.classList.remove("active");
    });

    dots.forEach(dot => {
      dot.classList.remove("active");
    });

    slides[index].classList.add("active");
    dots[index].classList.add("active");

    current = index;
  }

  nextBtn.addEventListener("click", () => {

    let index = (current + 1) % slides.length;

    showSlide(index);

  });

  prevBtn.addEventListener("click", () => {

    let index = (current - 1 + slides.length) % slides.length;

    showSlide(index);

  });

  dots.forEach((dot, index) => {

    dot.addEventListener("click", () => {

      showSlide(index);

    });

  });

});

/* =========================
   THEME TOGGLE
========================= */

const themeToggle = document.getElementById("theme-toggle");

/* Chargement thème sauvegardé */

if (localStorage.getItem("theme") === "light") {

  document.body.classList.add("light-theme");
  themeToggle.textContent = "🌙";

}

/* Toggle */

themeToggle.addEventListener("click", () => {

  document.body.classList.toggle("light-theme");

  const isLight = document.body.classList.contains("light-theme");

  if (isLight) {

    localStorage.setItem("theme", "light");
    themeToggle.textContent = "🌙";

  } else {

    localStorage.setItem("theme", "dark");
    themeToggle.textContent = "☀️";

  }

});