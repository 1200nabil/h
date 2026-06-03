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
        this.setupThemePicker();      // Setup premium glass theme picker mechanics
    }
    setupLoading() {
        window.addEventListener('load', () => {
            const loading = document.getElementById('loading');
            if (loading) {
                setTimeout(() => {
                    loading.classList.add('hidden');
                    setTimeout(() => loading.remove(), 500);
                }, 1000);
            }
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

    setupThemePicker() {
        const themeBtn = document.getElementById('theme-btn');
        const themePanel = document.getElementById('theme-panel');
        const themeCloseBtn = document.getElementById('theme-panel-close');
        const colorPicker = document.getElementById('color-picker');
        const colorPreview = document.querySelector('.color-preview-circle');
        const presetButtons = document.querySelectorAll('.preset-btn');
        const root = document.documentElement;

        // Predefined Theme Palette Base Setup Map
        const themes = {
            gold: { accent: '#913700', secondary: '#ffe600', bg: '#0a0a0b' },
            cyber: { accent: '#ff0055', secondary: '#00ffcc', bg: '#05000a' },
            toxic: { accent: '#0d5f00', secondary: '#00ff66', bg: '#000501' },
            cosmic: { accent: '#4d0099', secondary: '#00ffff', bg: '#02000a' },
            crimson: { accent: '#910000', secondary: '#ff4d4d', bg: '#0a0000' }
        };

        // UI Sync Function with Automatic Contrast Calculator Rules
        const applyThemeStyles = (accentColor, secondaryColor, backgroundColor = '#0a0a0b') => {
            root.style.setProperty('--accent', accentColor);
            root.style.setProperty('--accent-blue', secondaryColor);
            root.style.setProperty('--bg-primary', backgroundColor);
            
            if (colorPreview) colorPreview.style.background = accentColor;
            if (colorPicker) colorPicker.value = accentColor;

            // Extract channels to calculate human relative luminance contrast values
            const cleanHex = accentColor.replace('#', '');
            const r = parseInt(cleanHex.substring(0, 2), 16);
            const g = parseInt(cleanHex.substring(2, 4), 16);
            const b = parseInt(cleanHex.substring(4, 6), 16);
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;

            if (brightness > 165) {
                // Background accent gets light: turn site text colors dark for visibility
                root.style.setProperty('--text-primary', '#111112');
                root.style.setProperty('--text-secondary', '#333336');
                root.style.setProperty('--border', 'rgba(0, 0, 0, 0.15)');
            } else {
                // Background accent is dark: fallback to standard crisp dark mode settings
                root.style.setProperty('--text-primary', '#ffffff');
                root.style.setProperty('--text-secondary', '#b3b3b3');
                root.style.setProperty('--border', 'rgba(255, 255, 255, 0.08)');
            }
        };

        // Open/Close toggle visibility controls
        if (themeBtn && themePanel) {
            themeBtn.addEventListener('click', () => {
                themePanel.classList.toggle('hidden');
            });
        }

        if (themeCloseBtn && themePanel) {
            themeCloseBtn.addEventListener('click', () => {
                themePanel.classList.add('hidden');
            });
        }

        // Close panel layout space if clicking out elsewhere
        document.addEventListener('click', (e) => {
            if (themePanel && themeBtn && !themePanel.contains(e.target) && !themeBtn.contains(e.target)) {
                themePanel.classList.add('hidden');
            }
        });

        // Loop over presets to capture events
        presetButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                presetButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const targetName = btn.dataset.theme;
                const config = themes[targetName];

                if (config) {
                    applyThemeStyles(config.accent, config.secondary, config.bg);
                    localStorage.setItem('site-theme-custom', JSON.stringify(config));
                }
            });
        });

        // Listener hook targeting the stylized custom masked color picker button
        if (colorPicker) {
            colorPicker.addEventListener('input', (e) => {
                presetButtons.forEach(b => b.classList.remove('active'));
                
                const customAccent = e.target.value;
                const customSecondary = '#ffffff'; // Injected white background tint logic 

                applyThemeStyles(customAccent, customSecondary, '#0a0a0b');

                localStorage.setItem('site-theme-custom', JSON.stringify({
                    accent: customAccent,
                    secondary: customSecondary,
                    bg: '#0a0a0b'
                }));
            });
        }

        // Hydrating states from storage safely across reload windows
        const savedCustomConfig = localStorage.getItem('site-theme-custom');
        if (savedCustomConfig) {
            try {
                const parsed = JSON.parse(savedCustomConfig);
                applyThemeStyles(parsed.accent, parsed.secondary, parsed.bg);
                
                presetButtons.forEach(b => {
                    if (themes[b.dataset.theme]?.accent === parsed.accent) {
                        b.classList.add('active');
                    } else {
                        b.classList.remove('active');
                    }
                });
            } catch (e) {
                console.error("Theme configuration mapping issue on startup:", e);
            }
        }
        
    }
}

// Global initialization setup execution parameters
document.addEventListener('DOMContentLoaded', () => {
    new Portfolio();
    updateDiscordCard();
});

// Smooth window scrolling anchors handler link tags
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

// Fetch and update Discord profile details automatically using live Lanyard profiles
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

        const statusTitle = document.querySelector('.status-info h3');
        const statusText = document.querySelector('.status-info p');
        const statusAvatarImg = document.querySelector('.status-avatar');
        const heroAvatar = document.querySelector('.avatar');

        if (statusTitle) statusTitle.textContent = displayName;
        if (statusAvatarImg) statusAvatarImg.src = avatarUrl;
        if (heroAvatar) heroAvatar.src = avatarUrl;
        if (statusText) {
            statusText.textContent = customStatus || (status.charAt(0).toUpperCase() + status.slice(1));
        }

        const icon = document.querySelector('.discord-icon');
        let color = "#686868"; // Default color assignment (offline indicator style)
        if (status === "online") color = "#23a55a";
        else if (status === "idle") color = "#faa61a";
        else if (status === "dnd") color = "#ed4245";
        
        if (icon) icon.style.color = color;

        let dot = document.querySelector('.discord-status-dot');
        const avatarWrapper = document.querySelector('.status-avatar-wrapper');
        if (!dot && avatarWrapper) {
            dot = document.createElement('span');
            dot.className = 'discord-status-dot';
            avatarWrapper.appendChild(dot);
        }
        if (dot) dot.style.background = color;

    } catch (error) {
        console.error("Discord card fetch error:", error);
        const statusTitle = document.querySelector('.status-info h3');
        const statusText = document.querySelector('.status-info p');
        if (statusTitle) statusTitle.textContent = "Unavailable";
        if (statusText) statusText.textContent = "Could not load Discord status.";
    } finally {
        card.classList.remove('loading');
    }
}