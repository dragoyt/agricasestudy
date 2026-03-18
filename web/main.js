/**
 * AgriEcosystem — Case Study Interactions
 */
document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
     * 1. Theme Toggle Logic
     * ========================================= */
    const themeBtn = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;
    
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('agri-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial
    if (savedTheme) {
        htmlEl.setAttribute('data-theme', savedTheme);
    } else {
        htmlEl.setAttribute('data-theme', systemPrefersDark ? 'dark' : 'light');
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const currentTheme = htmlEl.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            htmlEl.setAttribute('data-theme', newTheme);
            localStorage.setItem('agri-theme', newTheme);
        });
    }

    /* =========================================
     * 2. Sticky Nav — scroll class + spy
     * ========================================= */
    const nav = document.getElementById('nav');
    const sections = document.querySelectorAll('section, .contrast-section');
    const navLinks = document.querySelectorAll('.nav-link');

    const onScroll = () => {
        // Add .scrolled for background blur
        if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);

        // Active link tracking
        let current = '';
        sections.forEach(sec => {
            const top = sec.offsetTop - 200;
            if (window.scrollY >= top) {
                current = sec.getAttribute('id') || '';
            }
        });

        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + current);
        });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* =========================================
     * 3. Scroll Reveal (IntersectionObserver)
     * ========================================= */
    const revealTargets = document.querySelectorAll(
        '.problem-card, .persona-card, .method-item, .bento-card, .outcome-card, .hmw-card'
    );

    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // stop observing once visible to prevent re-triggering
                revealObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealTargets.forEach((el, i) => {
        el.classList.add('reveal');
        el.style.transitionDelay = `${i * 0.05}s`;
        revealObs.observe(el);
    });

    /* =========================================
     * 4. Smooth Scroll for anchor links
     * ========================================= */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault();
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* =========================================
     * 5. Universal X-Ray Flashlight
     * ========================================= */
    let lastXrayNode = null;

    document.body.addEventListener('mousemove', (e) => {
        // Safely find the most relevant structural container being hovered
        let target = e.target;
        if (target && target.nodeType === Node.TEXT_NODE) {
            target = target.parentElement;
        }
        target = target.closest('div, section, article, header, footer, button, a');
        
        if (!target || target === document.body || target.id === 'nav') return; // Skip nav body itself

        // Clean up the previously hovered element
        if (lastXrayNode && lastXrayNode !== target) {
            lastXrayNode.classList.remove('xray-focus');
            lastXrayNode.style.removeProperty('--mouse-x');
            lastXrayNode.style.removeProperty('--mouse-y');
        }

        // Apply to current element
        const rect = target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        target.style.setProperty('--mouse-x', `${x}px`);
        target.style.setProperty('--mouse-y', `${y}px`);
        
        // Only append class if it's a structural element that accepts overlays
        target.classList.add('xray-focus');
        
        lastXrayNode = target;
    });

    document.body.addEventListener('mouseleave', () => {
        if (lastXrayNode) {
            lastXrayNode.classList.remove('xray-focus');
            lastXrayNode = null;
        }
    });

});
