const page = document.documentElement;
const navToggle = document.querySelector('.nav-toggle');
const heroNav = document.querySelector('.hero-nav');
const newsGrid = document.getElementById('news-grid');
const newsLoader = document.getElementById('news-loader');
const revealItems = document.querySelectorAll('[data-reveal]');
const revealSections = document.querySelectorAll('.reveal');
const currentYear = document.getElementById('current-year');

const fallbackNews = {
  stories: [
    {
      title: "Paul Keim’s Oxford Sabbatical",
      summary: "Paul Keim shares details on spending the 2022-2023 academic year in Oxford, England, where he is studying infectious diseases.",
      image: "https://in.nau.edu/wp-content/uploads/sites/216/1629333475-196dd510fe27dc5aa27dfbbbe3b49749f7c5b4657677c768733cdc3251372dc1-d_640-600x338.jpg",
      link: "#"
    },
    {
      title: "Nate Stone Leptospira Research",
      summary: "Leptospira bacteria are maintained in reservoir animals (such as livestock and rodents) and shed into the environment through urine.",
      image: "https://in.nau.edu/wp-content/uploads/sites/216/ezgif.com-webp-to-jpg-600x338.jpg",
      link: "#"
    },
    {
      title: "Walker Lab 2022 Highlights",
      summary: "2022 was one of those years where it all came together. The Walker Lab submitted 14 papers for peer review, six of which are now published.",
      image: "https://in.nau.edu/wp-content/uploads/sites/216/1617775647-073f9f6cce6ae8e16deaa6b2a7a7540bc60a42170450d908d7c1202211857371-d_640-600x338.jpg",
      link: "#"
    }
  ]
};

function toggleNavigation() {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!expanded));
  heroNav.classList.toggle('open');
}

function updateYear() {
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }
}

function revealOnScroll() {
  if (!('IntersectionObserver' in window)) {
    revealItems.forEach(item => item.classList.add('revealed'));
    revealSections.forEach(item => item.classList.add('active'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target.hasAttribute('data-reveal')) {
          entry.target.classList.add('revealed');
        } else if (entry.target.classList.contains('reveal')) {
          entry.target.classList.add('active');
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  revealItems.forEach(item => observer.observe(item));
  revealSections.forEach(item => observer.observe(item));
}

function createStoryCard(story) {
  const card = document.createElement('article');
  card.className = 'news-card';
  card.innerHTML = `
    <img src="${story.image}" alt="${story.title}">
    <div class="news-card-content">
      <h3>${story.title}</h3>
      <p>${story.summary}</p>
      <div class="news-card-footer">
        <a href="${story.link}" target="_blank" rel="noreferrer">Read more</a>
      </div>
    </div>
  `;
  return card;
}

async function loadNewsData() {
  if (!newsGrid || !newsLoader) return;
  try {
    const response = await fetch('PMI.html', { cache: 'no-store' });
    const text = await response.text();
    const jsonMatch = text.match(/<script id="news-data" type="application\/json">([\s\S]*?)<\/script>/);
    let data = fallbackNews;
    if (jsonMatch && jsonMatch[1]) {
      data = JSON.parse(jsonMatch[1]);
    }

    newsGrid.innerHTML = '';
    data.stories.forEach(story => newsGrid.appendChild(createStoryCard(story)));
  } catch (error) {
    newsGrid.innerHTML = '';
    fallbackNews.stories.forEach(story => newsGrid.appendChild(createStoryCard(story)));
  } finally {
    newsLoader.style.display = 'none';
  }
}

function initHeroMotion() {
  const heroPanel = document.querySelector('.hero-panel');
  if (!heroPanel) return;

  heroPanel.addEventListener('pointermove', (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 12;
    const y = (event.clientY / window.innerHeight - 0.5) * 12;
    heroPanel.style.setProperty('--tilt-x', `${y}deg`);
    heroPanel.style.setProperty('--tilt-y', `${x}deg`);
  });

  heroPanel.addEventListener('pointerleave', () => {
    heroPanel.style.setProperty('--tilt-x', '0deg');
    heroPanel.style.setProperty('--tilt-y', '0deg');
  });
}

function initScrollEffects() {
  document.querySelectorAll('.news-card, .facility-card, .contact-card, .collaboration-copy').forEach((card, index) => {
    card.style.transitionDelay = `${index * 50}ms`;
  });

  const interactiveCards = document.querySelectorAll('.interactive-card');
  interactiveCards.forEach(card => {
    card.addEventListener('mousemove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--pointer-x', `${x}%`);
      card.style.setProperty('--pointer-y', `${y}%`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.removeProperty('--pointer-x');
      card.style.removeProperty('--pointer-y');
    });
  });
}

function init() {
  updateYear();
  loadNewsData();
  revealOnScroll();
  initHeroMotion();
  initScrollEffects();
  if (navToggle) navToggle.addEventListener('click', toggleNavigation);
}

window.addEventListener('DOMContentLoaded', init);
