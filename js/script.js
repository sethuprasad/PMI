const smoothLinks = document.querySelectorAll('a[href^="#"]');

function handleSmoothScroll(event) {
    const targetId = event.currentTarget.getAttribute('href');
    if (targetId.startsWith('#') && targetId.length > 1) {
        const target = document.querySelector(targetId);
        if (target) {
            event.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

smoothLinks.forEach(link => {
    link.addEventListener('click', handleSmoothScroll);
});

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.18,
    rootMargin: '0px 0px -80px 0px'
});

document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

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

const overviewVisual = document.querySelector('.overview-visual__hero');
if (overviewVisual) {
    overviewVisual.addEventListener('mousemove', (event) => {
        const rect = overviewVisual.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 12;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * 12;
        overviewVisual.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });

    overviewVisual.addEventListener('mouseleave', () => {
        overviewVisual.style.transform = 'translate3d(0, 0, 0)';
    });
}

const heroMedia = document.querySelector('.hero-frame');
if (heroMedia) {
    heroMedia.addEventListener('mousemove', (event) => {
        const rect = heroMedia.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 8;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * 8;
        heroMedia.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });

    heroMedia.addEventListener('mouseleave', () => {
        heroMedia.style.transform = 'translate3d(0, 0, 0)';
    });
}


