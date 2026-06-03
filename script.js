// Portfolio class handles page setup and UI effects
class Portfolio {
    constructor() {
        this.init();
    }
    init() {
        this.setupLoading();          // Handles the initial loading spinner
        this.setupSocialLinks();      // Makes social buttons open links
        this.setupScrollAnimations(); // Animates sections on scroll
        this.setupProjectCards();     // Adds hover effect to project cards
        this.setupFooterYear();       // Set up automated dynamic footer updates
        this.setupEmailCopy();        // Setup clean click-to-copy email mechanics
    }
    setupLoading() {
        window.addEventListener('load', () => {
            const loading = document.getElementById('loading');
            setTimeout(() => {
                loading.classList.add('hidden');
                setTimeout(() => loading.remove(), 500);
            }, 1000);
        });
    }
    setupSocialLinks() {
        const socialBtns = document.querySelectorAll('.social-btn[data-link]');
        socialBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                window.open(btn.dataset.link, '_blank', 'noopener,noreferrer');
            });
        });
    }
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });
    }
    setupProjectCards() {
        // Built-in transitions handling smoothly inside styles stylesheet directly,
        // but keeping loop hook definitions clean if adjustments are ever added here.
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
    setupFooterYear() {
        const yearSpan = document.getElementById('current-year');
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        }
    }
    setupEmailCopy() {
        const copyBtn = document.getElementById('copy-email-btn');
        const emailText = document.getElementById('email-text');
        
        if (copyBtn && emailText) {
            copyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(emailText.textContent.trim())
                    .then(() => {
                        const originalIcon = copyBtn.innerHTML;
                        copyBtn.innerHTML = '<i class="fa-solid fa-check" style="color: #23a55a;"></i>';
                        copyBtn.style.pointerEvents = 'none';
                        setTimeout(() => {
                            copyBtn.innerHTML = originalIcon;
                            copyBtn.style.pointerEvents = 'auto';
                        }, 2000);
                    })
                    .catch(err => {
                        console.error('Failed to copy email: ', err);
                    });
            });
        }
    }
}

// Initialize Portfolio class on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    new Portfolio();
    updateDiscordCard();
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Fetch and update Discord card with live data
async function updateDiscordCard() {
    const card = document.querySelector('.status-card');
    if (!card) return;
    card.classList.add('loading');

    try {
        const userId = "1056634135961153576";
        const res = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
        if (!res.ok) throw new Error("Network response was not ok");
        
        const data = await res.json();
        if (!data.success) throw new Error("API returned unsuccessful response");

        const user = data.data.discord_user;
        const status = data.data.discord_status;
        
        const avatarUrl = user.avatar
            ? `https://cdn.discordapp.com/avatars/${userId}/${user.avatar}.png?size=512`
            : "https://raw.githubusercontent.com/1200nabil/portfolio/refs/heads/main/favicon/web-app-manifest-512x512.png";
            
        const displayName = user.global_name || user.username;
        const customStatus = data.data.activities.find(a => a.type === 4)?.state || "";

        document.querySelector('.status-info h3').textContent = displayName;
        document.querySelector('.status-avatar').src = avatarUrl;
        
        const heroAvatar = document.querySelector('.avatar');
        if (heroAvatar) heroAvatar.src = avatarUrl;
        
        document.querySelector('.status-info p').textContent =
            customStatus || (status.charAt(0).toUpperCase() + status.slice(1));

        const icon = document.querySelector('.discord-icon');
        let color = "#686868"; // Default (offline)
        if (status === "online") color = "#23a55a";
        else if (status === "idle") color = "#faa61a";
        else if (status === "dnd") color = "#ed4245";
        
        if (icon) icon.style.color = color;

        let dot = document.querySelector('.discord-status-dot');
        if (!dot) {
            dot = document.createElement('span');
            dot.className = 'discord-status-dot';
            document.querySelector('.status-avatar-wrapper').appendChild(dot);
        }
        dot.style.background = color;

    } catch (error) {
        console.error("Discord card fetch error:", error);
        document.querySelector('.status-info h3').textContent = "Unavailable";
        document.querySelector('.status-info p').textContent = "Could not load Discord status.";
    } finally {
        card.classList.remove('loading');
    }
}
