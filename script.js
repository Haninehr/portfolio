// ==================== TYPING ANIMATION ====================
const typingPhrases = [
    'Master 2 Computer Science • University of Algiers',
    'Full-Stack Developer',
    'Final Year Project, Beez AI for Beehive Management',
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingEl = document.getElementById('typing-text');

function typeEffect() {
    const current = typingPhrases[phraseIndex];

    if (isDeleting) {
        typingEl.textContent = current.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingEl.textContent = current.substring(0, charIndex + 1);
        charIndex++;
    }

    let speed = isDeleting ? 30 : 60;

    if (!isDeleting && charIndex === current.length) {
        speed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % typingPhrases.length;
        speed = 400;
    }

    setTimeout(typeEffect, speed);
}

typeEffect();

// ==================== TOAST NOTIFICATION SYSTEM ====================
function showToast(message, type = 'info') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';

    const icons = {
        info: 'fa-circle-info',
        warning: 'fa-triangle-exclamation',
        error: 'fa-circle-exclamation',
        success: 'fa-circle-check'
    };

    toast.innerHTML = `
        <i class="fas ${icons[type]} toast-icon"></i>
        <span class="toast-message">${message}</span>
        <button class="toast-close" aria-label="Close">&times;</button>
      `;

    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);

    const timeout = setTimeout(() => hideToast(toast), 4000);

    toast.querySelector('.toast-close').addEventListener('click', () => {
        clearTimeout(timeout);
        hideToast(toast);
    });
}

function hideToast(toast) {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
}

// ==================== LINK INTERCEPTION ====================
function isPlaceholderLink(href) {
    return !href || href === '#' || href.endsWith('#') ||
        href.toLowerCase().includes('coming soon') ||
        href === window.location.href.split('#')[0] + '#';
}

function handleLinkClick(e, href, element) {
    const isComingSoon = element.closest('[data-status="coming-soon"]') ||
        element.textContent.toLowerCase().includes('coming soon') ||
        element.closest('.project-card')?.querySelector('p')?.textContent.toLowerCase().includes('coming soon');

    if (isPlaceholderLink(href) || isComingSoon) {
        e.preventDefault();
        showToast('🚧 This feature is coming soon! Check back later.', 'warning');
        return false;
    }

    if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto:')) {
        fetch(href, { method: 'HEAD' })
            .then(response => {
                if (!response.ok) {
                    showToast('📄 File not found. Please check back later!', 'error');
                }
            })
            .catch(() => {
                if (href.toLowerCase().endsWith('.pdf') || href.toLowerCase().endsWith('.zip')) {
                    console.warn(`Could not verify file: ${href}`);
                }
            });
    }

    return true;
}

document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;

    const href = link.getAttribute('href');

    if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return;
    }

    if (href.startsWith('#')) {
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                navLinks.classList.remove('active');
            } else {
                showToast('⚠️ Section not found on this page.', 'info');
            }
        }
        return;
    }

    handleLinkClick(e, href, link);
});

// Modal link handlers
document.addEventListener('DOMContentLoaded', () => {
    const modalDemoLink = document.getElementById('modal-demo-link');
    const modalGithubLink = document.getElementById('modal-github-link');

    if (modalDemoLink) {
        modalDemoLink.addEventListener('click', (e) => {
            const href = modalDemoLink.getAttribute('href');
            if (isPlaceholderLink(href)) {
                e.preventDefault();
                showToast('🔗 Live demo coming soon! The project is still in development.', 'warning');
            }
        });
    }

    if (modalGithubLink) {
        modalGithubLink.addEventListener('click', (e) => {
            const href = modalGithubLink.getAttribute('href');
            if (href === '#' || href.endsWith('/')) {
                e.preventDefault();
                showToast('💻 Source code will be available soon!', 'warning');
            }
        });
    }
});

// ==================== NAVIGATION ====================
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
const navbar = document.getElementById('navbar');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.textContent = '☰';
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Active nav link highlight
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        const link = document.querySelector(`.nav-links a[href="#${id}"]`);
        if (link) {
            link.classList.toggle('active', scrollY >= top && scrollY < top + height);
        }
    });
});

// ==================== ANIMATIONS ====================
const fadeElements = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            // Animate ALL progress bars in the category with staggered delay
            const progressBars = entry.target.querySelectorAll('.progress[data-width]');
            progressBars.forEach((bar, index) => {
                setTimeout(() => {
                    bar.style.width = bar.dataset.width + '%';
                }, 150 + (index * 60));
            });

            // Animate stat numbers (if any)
            const statNumbers = entry.target.querySelectorAll('.stat-number[data-count]');
            statNumbers.forEach(stat => {
                animateCounter(stat, parseInt(stat.dataset.count));
            });
        }
    });
}, { threshold: 0.15 });
fadeElements.forEach(el => observer.observe(el));

function animateCounter(el, target) {
    let current = 0;
    const step = Math.ceil(target / 30);
    const interval = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(interval);
        }
        el.textContent = current + '+';
    }, 40);
}

// ==================== BACK TO TOP & SHARE BUTTON ====================
const backToTop = document.getElementById('back-to-top');
const shareBtn = document.getElementById('share-btn');

window.addEventListener('scroll', () => {
    const scrolled = window.scrollY > 500;
    backToTop.style.display = scrolled ? 'flex' : 'none';
    if (shareBtn) shareBtn.classList.toggle('shifted', scrolled);
});

backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ==================== THEME TOGGLE ====================
const themeToggle = document.getElementById('theme-toggle');

// Check saved preference
if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
    themeToggle.innerHTML = '<i class="fas fa-sun" style="color:#f59e0b;"></i>';
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    themeToggle.innerHTML = isLight
        ? '<i class="fas fa-sun" style="color:#f59e0b;"></i>'
        : '<i class="fas fa-moon" style="color:white;"></i>';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
});

// ==================== PROJECT MODAL ====================
const modal = document.getElementById('project-modal');
const modalTitle = document.getElementById('modal-title');
const modalFullDesc = document.getElementById('modal-full-desc');
const modalImg = document.getElementById('modal-img');
const modalTechContainer = document.getElementById('modal-tech');
const modalDemoLink = document.getElementById('modal-demo-link');
const modalGithubLink = document.getElementById('modal-github-link');
const modalClose = document.getElementById('modal-close');

function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
        const title = card.getAttribute('data-title');
        const description = card.getAttribute('data-description');
        const fullDesc = card.getAttribute('data-full-desc');
        const techString = card.getAttribute('data-tech');
        const demo = card.getAttribute('data-demo');
        const github = card.getAttribute('data-github');

        modalTitle.textContent = title;
        modalFullDesc.innerHTML = `<strong>Short description:</strong> ${description}<br><br>${fullDesc}`;
        modalImg.textContent = 'Project Screenshot (larger view)';

        modalTechContainer.innerHTML = '';
        if (techString) {
            techString.split(',').forEach(tech => {
                const span = document.createElement('span');
                span.textContent = tech.trim();
                modalTechContainer.appendChild(span);
            });
        }

        modalDemoLink.href = demo || '#';
        modalGithubLink.href = github || '#';

        if (isPlaceholderLink(demo)) {
            modalDemoLink.style.pointerEvents = 'none';
            modalDemoLink.style.opacity = '0.5';
            modalDemoLink.title = 'Demo coming soon';
        } else {
            modalDemoLink.style.pointerEvents = 'auto';
            modalDemoLink.style.opacity = '1';
            modalDemoLink.title = '';
        }

        if (isPlaceholderLink(github) || github?.includes('yourusername')) {
            modalGithubLink.style.pointerEvents = 'none';
            modalGithubLink.style.opacity = '0.5';
            modalGithubLink.title = 'GitHub repo coming soon';
        } else {
            modalGithubLink.style.pointerEvents = 'auto';
            modalGithubLink.style.opacity = '1';
            modalGithubLink.title = '';
        }

        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
});

// ==================== QR CODE SHARE MODAL ====================
const qrModal = document.getElementById('qr-modal');
const qrModalClose = document.getElementById('qr-modal-close');
const qrUrlText = document.getElementById('qr-url');
const downloadQrBtn = document.getElementById('download-qr');
const qrImage = document.getElementById('qr-image');

function openQrModal() {
    qrUrlText.textContent = window.location.href;
    qrModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeQrModal() {
    qrModal.style.display = 'none';
    document.body.style.overflow = '';
}

if (shareBtn) {
    shareBtn.addEventListener('click', openQrModal);
}

if (qrModalClose) {
    qrModalClose.addEventListener('click', closeQrModal);
}

if (qrModal) {
    qrModal.addEventListener('click', (e) => {
        if (e.target === qrModal) closeQrModal();
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && qrModal && qrModal.style.display === 'flex') {
        closeQrModal();
    }
});

if (downloadQrBtn) {
    downloadQrBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.href = './assets/qr-code.png';
        link.download = 'rouibah-hanine-portfolio-qr.png';
        link.click();
        showToast('✅ QR code downloaded!', 'success');
    });
}

// ==================== PROTECTION ====================
document.addEventListener('contextmenu', (event) => event.preventDefault());
document.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'u') {
        event.preventDefault();
    }
});

// ==================== LAST UPDATED DATE ====================
document.addEventListener('DOMContentLoaded', () => {
    const dateEl = document.getElementById('last-updated-date');
    if (!dateEl) return;

    const lastMod = new Date(document.lastModified);
    
    dateEl.textContent = lastMod.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
});