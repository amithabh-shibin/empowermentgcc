document.documentElement.classList.add('js');

const menu = document.querySelector('.menu');
const nav = document.getElementById('site-nav');

function setMenu(open) {
  nav.classList.toggle('open', open);
  menu.setAttribute('aria-expanded', String(open));
}

menu.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.classList.contains('open')) {
    setMenu(false);
    menu.focus();
  }
});

const slideshow = document.querySelector('.slideshow');
if (slideshow) {
  const slides = [...slideshow.querySelectorAll('.slide')];
  const dots = [...slideshow.querySelectorAll('.dots button')];
  const pause = slideshow.querySelector('.pause');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0;
  let playing = !reducedMotion.matches;
  let timer;

  function showSlide(index) {
    slides[current].hidden = true;
    dots[current].setAttribute('aria-pressed', 'false');
    current = index;
    slides[current].hidden = false;
    dots[current].setAttribute('aria-pressed', 'true');
  }

  function schedule() {
    clearInterval(timer);
    pause.textContent = playing ? 'Pause slideshow' : 'Play slideshow';
    if (playing && !document.hidden && !slideshow.matches(':focus-within') && !slideshow.matches(':hover')) {
      timer = setInterval(() => showSlide((current + 1) % slides.length), 6200);
    }
  }

  dots.forEach((dot, index) => dot.addEventListener('click', () => {
    showSlide(index);
    schedule();
  }));
  pause.addEventListener('click', () => {
    playing = !playing;
    schedule();
  });
  ['mouseenter', 'mouseleave', 'focusin'].forEach(event => slideshow.addEventListener(event, schedule));
  slideshow.addEventListener('focusout', () => setTimeout(schedule, 0));
  document.addEventListener('visibilitychange', schedule);
  reducedMotion.addEventListener('change', event => {
    playing = !event.matches;
    schedule();
  });
  schedule();
}

const lightbox = document.querySelector('.lightbox');
if (lightbox && typeof lightbox.showModal === 'function') {
  const image = lightbox.querySelector('img');
  const close = lightbox.querySelector('button');
  document.querySelectorAll('[data-gallery]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      image.src = link.href;
      image.alt = link.querySelector('img').alt;
      lightbox.showModal();
    });
  });
  close.addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('click', event => {
    if (event.target === lightbox) lightbox.close();
  });
}

const enquiry = document.querySelector('#enquiry');
if (enquiry) {
  const service = new URLSearchParams(location.search).get('service');
  const choices = enquiry.elements.service;
  if ([...choices.options].some(option => option.value === service)) choices.value = service;
  enquiry.addEventListener('submit', event => {
    event.preventDefault();
    const details = new FormData(enquiry);
    const message = [
      'Hello Empowerment General Contracting, I would like to request a quote.',
      '',
      'Name: ' + details.get('name').trim(),
      'Service: ' + details.get('service'),
      'Site location: ' + details.get('location').trim(),
      'Project details: ' + details.get('message').trim()
    ].join('\n');
    location.href = 'https://wa.me/971544043072?text=' + encodeURIComponent(message);
  });
}
