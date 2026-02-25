/**
 * XP Arena Onboarding Tour
 * Displays a spotlight-guided tour on first login.
 */

window.Onboarding = {
    steps: [
        {
            title: "Welcome to XP Arena",
            text: "This is your hub for perfecting your aim and tracking your progress across devices.",
            elementSelector: "body", // Center of screen
            position: "center"
        },
        {
            title: "Calibrate Sensitivity",
            text: "Use our tool to calculate the perfect sensitivity across scopes and games.",
            elementSelector: "nav.bottom-nav a[href='tool.html'], nav.navbar a[href='tool.html']", // Try both navs
            position: "bottom"
        },
        {
            title: "Level Up with AXP",
            text: "Earn Arena XP (AXP) by logging in, submitting setups, and winning Clan Wars.",
            elementSelector: ".profile-hero, nav.bottom-nav a[href='profile.html']",
            position: "bottom"
        },
        {
            title: "Join a Clan",
            text: "Group up with other Arenis, compete in wars, and climb the clan leaderboards.",
            elementSelector: "nav.bottom-nav a[href='guilds.html']",
            position: "top"
        },
        {
            title: "Daily Rewards",
            text: "Don't forget to claim your daily login rewards to maintain your streak!",
            elementSelector: ".fa-gift", // Often in the navbar or profile
            position: "bottom",
            fallback: "center"
        }
    ],

    currentStep: 0,
    isActive: false,

    init() {
        if (!Auth || !Auth.isLoggedIn()) return;

        // Check if already completed
        if (localStorage.getItem(`xp_onboarding_${Auth.getCurrentUser().id}`) === 'true') {
            return;
        }

        // Delay start to allow UI rendering
        setTimeout(() => this.start(), 1500);
    },

    start() {
        this.isActive = true;
        this.currentStep = 0;
        this.buildUI();
        this.showStep();

        // Handle resize properly
        window.addEventListener('resize', this.handleResize.bind(this));
    },

    handleResize() {
        if (this.isActive) this.showStep();
    },

    buildUI() {
        // Main overlay container
        this.overlay = document.createElement('div');
        this.overlay.id = 'onboarding-overlay';

        // Dimmer background
        this.dimmer = document.createElement('div');
        this.dimmer.id = 'onboarding-dimmer';
        this.overlay.appendChild(this.dimmer);

        // Spotlight cutout
        this.spotlight = document.createElement('div');
        this.spotlight.className = 'onboarding-spotlight';
        // Remove dimmer, handled by box-shadow on spotlight
        this.dimmer.style.display = 'none';
        this.overlay.appendChild(this.spotlight);

        // Popover card
        this.popover = document.createElement('div');
        this.popover.className = 'onboarding-popover';
        this.popover.innerHTML = `
            <div class="onboarding-title" id="onboarding-title"></div>
            <div class="onboarding-text" id="onboarding-text"></div>
            <div class="onboarding-controls">
                <button class="onboarding-skip" onclick="Onboarding.end()">Skip Tour</button>
                <div class="onboarding-dots" id="onboarding-dots"></div>
                <button class="onboarding-btn" id="onboarding-next" onclick="Onboarding.next()">Next</button>
            </div>
        `;
        this.overlay.appendChild(this.popover);

        document.body.appendChild(this.overlay);
    },

    showStep() {
        if (this.currentStep >= this.steps.length) {
            this.end();
            return;
        }

        const step = this.steps[this.currentStep];

        // Update content
        document.getElementById('onboarding-title').textContent = step.title;
        document.getElementById('onboarding-text').textContent = step.text;

        // Update dots
        const dotsContainer = document.getElementById('onboarding-dots');
        dotsContainer.innerHTML = '';
        for (let i = 0; i < this.steps.length; i++) {
            const dot = document.createElement('div');
            dot.className = `onboarding-dot ${i === this.currentStep ? 'active' : ''}`;
            dotsContainer.appendChild(dot);
        }

        // Update button text
        const btn = document.getElementById('onboarding-next');
        btn.textContent = this.currentStep === this.steps.length - 1 ? 'Finish' : 'Next';

        // Position Spotlight and Popover
        let targetEl = null;
        if (step.elementSelector !== 'body') {
            const possibleEl = document.querySelectorAll(step.elementSelector);
            // Get first visible
            for (let el of possibleEl) {
                if (el.getBoundingClientRect().width > 0) {
                    targetEl = el;
                    break;
                }
            }
        }

        if (targetEl) {
            // Wait a tick for layouts to settle
            requestAnimationFrame(() => {
                const rect = targetEl.getBoundingClientRect();
                const pad = 10;

                this.spotlight.style.width = `${rect.width + pad * 2}px`;
                this.spotlight.style.height = `${rect.height + pad * 2}px`;
                this.spotlight.style.top = `${rect.top - pad}px`;
                this.spotlight.style.left = `${rect.left - pad}px`;
                this.spotlight.style.boxShadow = '0 0 0 9999px rgba(0, 0, 0, 0.8), 0 0 15px var(--accent-glow)';

                // Position Popover
                const popRect = this.popover.getBoundingClientRect();
                let topPos, leftPos;

                // Simple top/bottom placement based on space
                if (step.position === 'top' || (rect.bottom + popRect.height + pad * 3 > window.innerHeight)) {
                    // Place above
                    topPos = rect.top - popRect.height - pad * 3;
                } else {
                    // Place below
                    topPos = rect.bottom + pad * 3;
                }

                // Center horizontally relative to element
                leftPos = rect.left + (rect.width / 2) - (popRect.width / 2);

                // Clamp to screen bounds
                leftPos = Math.max(pad, Math.min(window.innerWidth - popRect.width - pad, leftPos));
                topPos = Math.max(pad, Math.min(window.innerHeight - popRect.height - pad, topPos));

                this.popover.style.top = `${topPos}px`;
                this.popover.style.left = `${leftPos}px`;
                this.popover.classList.add('visible');
            });
        } else {
            // Fallback to center screen
            this.spotlight.style.boxShadow = 'inset 0 0 0 9999px rgba(0, 0, 0, 0.8)';
            this.spotlight.style.width = '100%';
            this.spotlight.style.height = '100%';
            this.spotlight.style.top = '0';
            this.spotlight.style.left = '0';

            const popRect = this.popover.getBoundingClientRect();
            this.popover.style.top = `${(window.innerHeight - popRect.height) / 2}px`;
            this.popover.style.left = `${(window.innerWidth - 320) / 2}px`;
            this.popover.classList.add('visible');
        }
    },

    next() {
        this.popover.classList.remove('visible');
        setTimeout(() => {
            this.currentStep++;
            this.showStep();
        }, 300); // Wait for transition
    },

    end() {
        this.isActive = false;
        if (this.overlay) {
            this.overlay.style.opacity = '0';
            setTimeout(() => this.overlay.remove(), 400);
        }
        window.removeEventListener('resize', this.handleResize);

        // Mark completed
        if (Auth && Auth.isLoggedIn()) {
            localStorage.setItem(`xp_onboarding_${Auth.getCurrentUser().id}`, 'true');
        }
    }
};

// Auto-init on page load if applicable
document.addEventListener('DOMContentLoaded', () => {
    // Only auto-init on profile page to avoid interrupting tool or specific pages initially
    if (window.location.pathname.includes('profile.html') || window.location.pathname === '/' || window.location.pathname === '/index.html') {
        setTimeout(() => window.Onboarding.init(), 1000);
    }
});
