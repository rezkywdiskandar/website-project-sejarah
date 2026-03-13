/* ============================================
   NUSANTARA ARCHIVE — Main JavaScript
   Core functionality: navbar, scroll animations,
   parallax, counter animation, audio toggle
   ============================================ */

// ========= NAVBAR SCROLL BEHAVIOR =========
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  
  // Only apply scroll behavior on home page (where navbar isn't always solid)
  const isHome = window.location.pathname === '/' || window.location.pathname.endsWith('index.html');
  
  if (isHome) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 80) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }
}

// ========= MOBILE NAV TOGGLE =========
function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;
  
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    links.classList.toggle('open');
  });
  
  // Close mobile nav when clicking a link
  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      links.classList.remove('open');
    });
  });
  
  // Close on click outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar')) {
      toggle.classList.remove('active');
      links.classList.remove('open');
    }
  });
}

// ========= SCROLL REVEAL ANIMATIONS =========
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (reveals.length === 0) return;
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger animation
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 100);
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  reveals.forEach(el => revealObserver.observe(el));
}

// ========= PARALLAX EFFECT =========
function initParallax() {
  const ship = document.getElementById('parallaxShip');
  if (!ship) return;
  
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const rate = scrollY * 0.3;
    ship.style.transform = `translateY(${rate}px)`;
  });
}

// ========= COUNTER ANIMATION =========
function initCounters() {
  const counters = document.querySelectorAll('[data-target]');
  if (counters.length === 0) return;
  
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.target);
        animateCounter(entry.target, target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(element, target) {
  let current = 0;
  const increment = target / 60; // 60 frames
  const duration = 2000;
  const stepTime = duration / 60;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    element.textContent = Math.floor(current);
  }, stepTime);
}

// ========= BAR CHART ANIMATION =========
function initBarChart() {
  const chart = document.getElementById('barChart');
  if (!chart) return;
  
  const chartObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bars = chart.querySelectorAll('.bar-fill');
        bars.forEach((bar, index) => {
          setTimeout(() => {
            bar.style.width = bar.dataset.width + '%';
          }, index * 200);
        });
        chartObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  
  chartObserver.observe(chart);
}

// ========= TYPEWRITER EFFECT =========
function initTypewriter() {
  const elements = document.querySelectorAll('.typewriter');
  if (elements.length === 0) return;
  
  const typeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const text = entry.target.dataset.quote || entry.target.textContent;
        entry.target.textContent = '';
        
        let i = 0;
        const typeInterval = setInterval(() => {
          if (i < text.length) {
            const span = document.createElement('span');
            span.className = 'char';
            span.textContent = text[i];
            span.style.animationDelay = `${i * 0.03}s`;
            entry.target.appendChild(span);
            i++;
          } else {
            clearInterval(typeInterval);
          }
        }, 30);
        
        typeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  elements.forEach(el => typeObserver.observe(el));
}

// ========= AUDIO TOGGLE =========
function initAudioToggle() {
  const audioBtn = document.getElementById('audioToggle');
  if (!audioBtn) return;
  
  let isPlaying = false;
  let audioContext = null;
  let oscillator = null;
  let gainNode = null;
  
  audioBtn.addEventListener('click', () => {
    if (!isPlaying) {
      // Create a simple ambient ocean sound using Web Audio API
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Create noise for ocean-like sound
      const bufferSize = 2 * audioContext.sampleRate;
      const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      
      const whiteNoise = audioContext.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;
      
      // Filter to make it sound like ocean
      const filter = audioContext.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 400;
      
      gainNode = audioContext.createGain();
      gainNode.gain.value = 0.06;
      
      // LFO for wave-like modulation
      const lfo = audioContext.createOscillator();
      const lfoGain = audioContext.createGain();
      lfo.frequency.value = 0.15;
      lfoGain.gain.value = 0.03;
      
      lfo.connect(lfoGain);
      lfoGain.connect(gainNode.gain);
      
      whiteNoise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      whiteNoise.start();
      lfo.start();
      
      oscillator = whiteNoise;
      audioBtn.textContent = '🔊';
      audioBtn.classList.add('playing');
      isPlaying = true;
    } else {
      if (oscillator) oscillator.stop();
      if (audioContext) audioContext.close();
      audioBtn.textContent = '🔈';
      audioBtn.classList.remove('playing');
      isPlaying = false;
    }
  });
}

// ========= SMOOTH PAGE TRANSITIONS =========
function initPageTransitions() {
  // Add subtle fade effect when navigating
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('/') && !href.startsWith('#')) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.3s ease';
        setTimeout(() => {
          window.location.href = href;
        }, 300);
      });
    }
  });
  
  // Fade in on page load
  document.body.style.opacity = '0';
  requestAnimationFrame(() => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
  });
}

// ========= ACTIVE NAV HIGHLIGHT =========
function initActiveNav() {
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (currentPath === href || 
        (currentPath.endsWith('/') && href === '/') ||
        currentPath.endsWith(href)) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// ========= INIT ALL =========
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileNav();
  initScrollReveal();
  initParallax();
  initCounters();
  initBarChart();
  initTypewriter();
  initAudioToggle();
  initPageTransitions();
  initActiveNav();
});
