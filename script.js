'use strict';

///////////////////////////////////////
// Modal window

///////////////////////////////////////
// Elements
const header = document.querySelector('.header');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const nav = document.querySelector('.nav');
const logo = document.querySelector('.nav__logo');
const navLink = document.querySelectorAll('.nav__link');
const operations = document.querySelector('.operations');

const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScroll = document.querySelector('.btn--scroll-to');
const btnSliderLeft = document.querySelector('.slider__btn--left');
const btnSliderRight = document.querySelector('.slider__btn--right');

const section = document.querySelector('.section');
const allSecions = document.querySelectorAll('.section');
const allImg = document.querySelectorAll('img[data-src]');
const slides = document.querySelectorAll('.slide');
const dotContainer = document.querySelector('.dots');

///////////////////////////////////////
// Function
// Open Model
const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

// Close Modal
const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

// Open Model on Every open model button
for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

// Close model when press close model button or overlay 
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

// Close model when press Escape key
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden'))
    closeModal();
});

// Scroll down when press on learn more button 
btnScroll.addEventListener('click', function() {
  section.scrollIntoView({behavior: 'smooth'});
});

// Scroll buttons
nav.addEventListener('click', function(e) {
  if(e.target.classList.contains('nav__link')) {
    e.preventDefault();

    const id = e.target.getAttribute('href');

    document.querySelector(id).scrollIntoView({behavior: 'smooth'});
  }
});

// Operation buttons 
operations.addEventListener('click', function(e) {
  const clicked = e.target.closest('.operations__tab');
  if(clicked) {
    const num = clicked.getAttribute('data-tab');
    
    for(let i = 1; i <= 3; i++) {
      // Add active button and content  
      if(num == i) {
        document.querySelector(`.operations__tab--${i}`).classList.add('operations__tab--active');

        document.querySelector(`.operations__content--${i}`).classList.add('operations__content--active');
      }
      // Remove active button and content 
      else {
        document.querySelector(`.operations__tab--${i}`).classList.remove('operations__tab--active');

        document.querySelector(`.operations__content--${i}`).classList.remove('operations__content--active');
      }
    }
  }
});

// Menu fade animation
let fade = function(e, opacity) {
  if(e.target.classList.contains('nav__link')) {
    logo.style.opacity = opacity;
    
    navLink.forEach(function (link) {
      if(e.target != link)
        link.style.opacity = opacity;
    });
  }
}

nav.addEventListener('mouseover', function(e) {
  fade(e, 0.3);
});

nav.addEventListener('mouseout', function(e) {
  fade(e, 1);
});

/*
// Sticky class (bad for performance) 

const sectionCorde = section.getBoundingClientRect();

window.addEventListener('scroll', function() {
  if(window.scrollY > sectionCorde.top)
    nav.classList.add('sticky');
  else
    nav.classList.remove('sticky');
});
*/

// Sticky class (better for performance)
const navHieght = nav.getBoundingClientRect().height;

const stickyNav = function(enteries) {
  if(!enteries[0].isIntersecting)
    nav.classList.add('sticky');
  else
    nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHieght}px`,
}); 

headerObserver.observe(header);

// Reveal sections 

const revealSecion = function(enteries, observer) {
  if(!enteries[0].isIntersecting) return;

  enteries[0].target.classList.remove('section--hidden');
  observer.unobserve(enteries[0].target);
};

const sectionObserver = new IntersectionObserver(revealSecion, {
  root: null,
  threshold: 0.20,
});


allSecions.forEach(function (sec) {
  sectionObserver.observe(sec);
  sec.classList.add('section--hidden');
});

// Lazy image

const loadImg = function(entery, observer) {
  if(!entery[0].isIntersecting) return;

  entery[0].target.src = entery[0].target.dataset.src;

  entery[0].target.addEventListener('load', function() {
    entery[0].target.classList.remove('lazy-img');
  });

  observer.unobserve(entery[0].target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

allImg.forEach(img => imgObserver.observe(img));

// Slider

let [curSlide, allSlides] = [0, slides.length];

const createDots = function() {
  slides.forEach(function(_, i) {
    dotContainer.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide="${i}"></button>`);
  });
};

createDots();

const activeDot = function(dot) {
  const allDots = document.querySelectorAll('.dots__dot');

  allDots.forEach(d => d.classList.remove('dots__dot--active'));

  document.querySelector(`.dots__dot[data-slide="${dot}"]`).classList.add('dots__dot--active');
}

activeDot(curSlide);

const goTOSlide = function(slide) {
  slides.forEach(function(s, i) {
      s.style.transform = `translateX(${100 * (i - slide)}%)`;
  });
};

goTOSlide(curSlide);

const nextSlide = function() {
  curSlide = (curSlide + 1) % allSlides;

  goTOSlide(curSlide);
  activeDot(curSlide);
}

const prevSlide = function() {
  curSlide = (curSlide - 1 + allSlides) % allSlides;

  goTOSlide(curSlide);
  activeDot(curSlide);
}

btnSliderRight.addEventListener('click', nextSlide);
btnSliderLeft.addEventListener('click', prevSlide);

dotContainer.addEventListener('click', function(e) {
  if(e.target.classList.contains('dots__dot'))
    curSlide = e.target.dataset.slide;
  goTOSlide(curSlide);
  activeDot(curSlide);
});

document.addEventListener('keydown', function(e) {
  if(e.key === 'ArrowRight')
    nextSlide();
  if(e.key === 'ArrowLeft')
    prevSlide(); 
});

window.addEventListener('beforeunload', function(e) {
  e.preventDefault();
  e.returnValue = '';
})