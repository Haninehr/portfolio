// ==================== TYPING ANIMATION ====================
const typingPhrases = [
    "Master's graduate in Computer Science • University of Algiers",
    "Exploring digital assets, blockchain, and financial tech",
    "Startup Project, Beez AI for Beehive Management",
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
const cvViewBtn = document.getElementById("view-cv-btn");
const chatBtn = document.getElementById('chat-btn');

window.addEventListener('scroll', () => {
    const scrolled = window.scrollY > 500;
    backToTop.style.display = scrolled ? 'flex' : 'none';
    if (shareBtn) shareBtn.classList.toggle('shifted', scrolled);
    if (cvViewBtn) cvViewBtn.classList.toggle('shifted', scrolled);
    if (chatBtn) chatBtn.classList.toggle('shifted', scrolled);
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


// ==================== CV VIEWER MODAL ====================
const cvModal = document.getElementById('cv-modal');
const cvModalClose = document.getElementById('cv-modal-close');
const viewCvBtn = document.getElementById('view-cv-btn');

function openCvModal() {
    if (cvModal) {
        cvModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeCvModal() {
    if (cvModal) {
        cvModal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

if (viewCvBtn) {
    viewCvBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openCvModal();
    });
}

if (cvModalClose) {
    cvModalClose.addEventListener('click', closeCvModal);
}

if (cvModal) {
    cvModal.addEventListener('click', (e) => {
        if (e.target === cvModal) closeCvModal();
    });
}

// Close CV modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cvModal && cvModal.style.display === 'flex') {
        closeCvModal();
    }
});

// ==================== PROTECTION ====================
/*document.addEventListener('contextmenu', (event) => event.preventDefault());
document.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'u') {
        event.preventDefault();
    }
});*/

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
// ==================== CHAT WIDGET ====================
const chatWidget = document.getElementById('chat-widget');
const chatClose = document.getElementById('chat-close');
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');
const chatMessages = document.getElementById('chat-messages');
const chatSuggestions = document.getElementById('chat-suggestions');

function openChat() {
    if (!chatWidget) return;
    chatWidget.classList.add('open');
    chatWidget.setAttribute('aria-hidden', 'false');
    // Hide floating buttons while chat is open for cleaner look
    if (chatBtn) chatBtn.style.display = 'none';
    if (cvViewBtn) cvViewBtn.style.display = 'none';
    if (shareBtn) shareBtn.style.display = 'none';
    if (backToTop) backToTop.style.display = 'none';
    setTimeout(() => chatInput && chatInput.focus(), 280);
}

function closeChat() {
    if (!chatWidget) return;
    chatWidget.classList.remove('open');
    chatWidget.setAttribute('aria-hidden', 'true');
    if (chatBtn) chatBtn.style.display = 'flex';
    if (cvViewBtn) cvViewBtn.style.display = 'flex';
    if (shareBtn) shareBtn.style.display = 'flex';
    // Restore back-to-top visibility based on scroll
    if (backToTop) {
        backToTop.style.display = window.scrollY > 500 ? 'flex' : 'none';
    }
}

if (chatBtn) {
    chatBtn.addEventListener('click', openChat);
}

if (chatClose) {
    chatClose.addEventListener('click', closeChat);
}

// Close on Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && chatWidget && chatWidget.classList.contains('open')) {
        closeChat();
    }
});

// Enable/disable send button
if (chatInput && chatSend) {
    chatInput.addEventListener('input', () => {
        chatSend.disabled = chatInput.value.trim().length === 0;
    });

    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey && !chatSend.disabled) {
            e.preventDefault();
            handleSendMessage();
        }
    });
}

if (chatSend) {
    chatSend.addEventListener('click', handleSendMessage);
}

// Suggestion chips
if (chatSuggestions) {
    chatSuggestions.addEventListener('click', (e) => {
        const chip = e.target.closest('.suggestion-chip');
        if (!chip) return;
        const question = chip.dataset.question || chip.textContent;
        chatInput.value = question;
        chatSend.disabled = false;
        handleSendMessage();
    });
}

function getCurrentTime() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ---------- Safe Markdown renderer (no external libs) ----------
// Everything is HTML-escaped FIRST, then a small whitelist of Markdown is turned
// into tags. Links are limited to http(s)/mailto, so model output can never inject
// scripts, images or attributes.
function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function renderInline(s) {
    const codes = [];
    s = s.replace(/`([^`]+)`/g, (m, c) => {
        codes.push(c);
        return `\u0000${codes.length - 1}\u0000`;
    });
    // [text](https://...) and [text](mailto:...)
    s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+)\)/g,
        (m, t, u) => `<a href="${u}" target="_blank" rel="noopener noreferrer">${t}</a>`);
    // bare URLs
    s = s.replace(/(^|[\s(])(https?:\/\/[^\s<)]+[^\s<).,;!?])/g,
        (m, p, u) => `${p}<a href="${u}" target="_blank" rel="noopener noreferrer">${u}</a>`);
    // bare emails
    s = s.replace(/(^|[\s(])([\w.+-]+@[\w-]+\.[\w.-]*\w)/g,
        (m, p, e) => `${p}<a href="mailto:${e}">${e}</a>`);
    s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?!\w)/g, '$1<em>$2</em>');
    s = s.replace(/\u0000(\d+)\u0000/g, (m, i) => `<code>${codes[i]}</code>`);
    return s;
}

function renderMarkdown(text) {
    text = escapeHtml(String(text).replace(/\u0000/g, '').replace(/\r\n/g, '\n'));
    const html = [];

    // split out fenced code blocks
    const parts = text.split(/```[^\n]*\n?/);
    parts.forEach((part, idx) => {
        if (idx % 2 === 1) {
            html.push(`<pre><code>${part.replace(/\n$/, '')}</code></pre>`);
            return;
        }
        let list = null; // 'ul' | 'ol'
        let para = [];
        const flushPara = () => {
            if (para.length) { html.push(`<p>${renderInline(para.join('<br>'))}</p>`); para = []; }
        };
        const closeList = () => { if (list) { html.push(`</${list}>`); list = null; } };

        part.split('\n').forEach((line) => {
            const trimmed = line.trim();
            let m;
            if (!trimmed) { flushPara(); closeList(); return; }
            if ((m = trimmed.match(/^(#{1,4})\s+(.+)$/))) {
                flushPara(); closeList();
                const lvl = Math.min(m[1].length + 2, 6); // h3..h6 inside a small bubble
                html.push(`<h${lvl}>${renderInline(m[2])}</h${lvl}>`);
            } else if ((m = trimmed.match(/^[-*•]\s+(.+)$/))) {
                flushPara();
                if (list !== 'ul') { closeList(); html.push('<ul>'); list = 'ul'; }
                html.push(`<li>${renderInline(m[1])}</li>`);
            } else if ((m = trimmed.match(/^\d+[.)]\s+(.+)$/))) {
                flushPara();
                if (list !== 'ol') { closeList(); html.push('<ol>'); list = 'ol'; }
                html.push(`<li>${renderInline(m[1])}</li>`);
            } else if ((m = trimmed.match(/^&gt;\s?(.+)$/))) {
                flushPara(); closeList();
                html.push(`<blockquote>${renderInline(m[1])}</blockquote>`);
            } else {
                closeList();
                para.push(trimmed);
            }
        });
        flushPara(); closeList();
    });
    return html.join('');
}

function appendMessage(role, text) {
    const msg = document.createElement('div');
    msg.className = `chat-message ${role}`;

    const avatarIcon = role === 'bot' ? 'fa-robot' : 'fa-user';
    msg.innerHTML = `
        <div class="message-avatar"><i class="fas ${avatarIcon}"></i></div>
        <div class="message-bubble">
            <div class="message-content"></div>
            <span class="message-time">${getCurrentTime()}</span>
        </div>
    `;
    const content = msg.querySelector('.message-content');
    if (role === 'bot') {
        content.classList.add('markdown');
        content.innerHTML = renderMarkdown(text);   // escaped + whitelisted
    } else {
        const p = document.createElement('p');
        p.textContent = text;                        // user text is never parsed as HTML
        content.appendChild(p);
    }
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return msg;
}

function showTyping() {
    const typing = document.createElement('div');
    typing.className = 'chat-message bot';
    typing.id = 'typing-indicator';
    typing.innerHTML = `
        <div class="message-avatar"><i class="fas fa-robot"></i></div>
        <div class="message-bubble">
            <div class="typing-indicator">
                <span></span><span></span><span></span>
            </div>
        </div>
    `;
    chatMessages.appendChild(typing);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTyping() {
    const el = document.getElementById('typing-indicator');
    if (el) el.remove();
}

// ==================== REAL AI BACKEND ====================
// 👉 Replace with your Render service URL after deploying the backend.
const CHAT_API_URL = 'https://hanine-portfolio-gateway.onrender.com';

const MAX_HISTORY = 6;       // messages sent back to the server for context
let chatHistory = [];        // [{ role: 'user' | 'assistant', content }]
let isWaitingForReply = false;
let backendWarmed = false;

// Render's free tier sleeps after inactivity; ping /health when the chat opens
// so the server is awake by the time the visitor sends the first question.
function warmUpBackend() {
    if (backendWarmed || CHAT_API_URL.includes('YOUR-SERVICE-NAME')) return;
    backendWarmed = true;
    fetch(`${CHAT_API_URL}/health`).catch(() => { backendWarmed = false; });
}
if (chatBtn) chatBtn.addEventListener('click', warmUpBackend);

async function getBotReply(userMessage) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000); // allow for a cold start

    try {
        const res = await fetch(`${CHAT_API_URL}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMessage, history: chatHistory.slice(-MAX_HISTORY) }),
            signal: controller.signal
        });

        let data = {};
        try { data = await res.json(); } catch (_) { /* non-JSON error page */ }

        if (!res.ok) {
            throw new Error(data.error || `Request failed (${res.status})`);
        }
        if (!data.reply) throw new Error('Empty reply');
        return data.reply;
    } finally {
        clearTimeout(timeout);
    }
}

async function handleSendMessage() {
    const text = chatInput.value.trim();
    if (!text || isWaitingForReply) return;
    isWaitingForReply = true;

    // Hide suggestions after first message
    if (chatSuggestions) {
        chatSuggestions.style.display = 'none';
    }

    // Add user message
    appendMessage('user', text);
    chatInput.value = '';
    chatSend.disabled = true;

    // Show typing indicator
    showTyping();

    try {
        const reply = await getBotReply(text);
        hideTyping();
        appendMessage('bot', reply);
        chatHistory.push({ role: 'user', content: text }, { role: 'assistant', content: reply });
        chatHistory = chatHistory.slice(-MAX_HISTORY);
    } catch (err) {
        hideTyping();
        const msg = err.name === 'AbortError'
            ? "The assistant is taking too long to wake up. Please try again in a few seconds."
            : (err.message && !/failed to fetch|networkerror|load failed/i.test(err.message)
                ? err.message
                : "Sorry, I couldn't reach the assistant. Please try again in a moment.");
        appendMessage('bot', msg);
        console.error(err);
    } finally {
        isWaitingForReply = false;
    }

    chatInput.focus();
}