// Modern Portfolio JavaScript with Enhanced Features

class PortfolioApp {
    constructor() {
        this.initializeComponents();
    }

    initializeComponents() {
        // Initialize all components
        this.themeManager = new ThemeManager();
        this.navigationManager = new NavigationManager();
        this.scrollManager = new ScrollManager();
        this.animationManager = new AnimationManager();
        this.typingAnimation = new TypingAnimation();
        this.skillsAnimation = new SkillsAnimation();
        this.performanceOptimizer = new PerformanceOptimizer();
        this.contactManager = new ContactManager();
        this.statsCounter = new StatsCounter();
    }
}

// Theme Management System
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.currentTheme = this.getStoredTheme() || this.getPreferredTheme();
        this.init();
    }

    init() {
        this.setTheme(this.currentTheme);
        this.bindEvents();
    }

    bindEvents() {
        this.themeToggle?.addEventListener('click', () => this.toggleTheme());
        
        // Listen for system theme changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!this.getStoredTheme()) {
                    this.setTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }

    getStoredTheme() {
        return localStorage.getItem('portfolio-theme');
    }

    getPreferredTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.updateThemeIcon(theme);
        localStorage.setItem('portfolio-theme', theme);
        this.currentTheme = theme;
    }

    updateThemeIcon(theme) {
        const icon = this.themeToggle?.querySelector('i');
        if (!icon) return;
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }
}

// Navigation Management System
class NavigationManager {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.hamburger = document.getElementById('hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.sections = document.querySelectorAll('section[id]');
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateActiveSection();
    }

    bindEvents() {
        // Smooth scroll for navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e));
        });

        // Mobile menu toggle
        this.hamburger?.addEventListener('click', () => this.toggleMobileMenu());

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navbar?.contains(e.target) && this.navMenu?.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });

        // Update active section on scroll
        window.addEventListener('scroll', this.throttle(() => this.updateActiveSection(), 100));
        
        // Navbar scroll effect
        window.addEventListener('scroll', this.throttle(() => this.updateNavbarStyle(), 100));
    }

    handleNavClick(e) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href')?.substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
        
        this.closeMobileMenu();
    }

    toggleMobileMenu() {
        this.hamburger?.classList.toggle('active');
        this.navMenu?.classList.toggle('active');
        document.body.style.overflow = this.navMenu?.classList.contains('active') ? 'hidden' : '';
    }

    closeMobileMenu() {
        this.hamburger?.classList.remove('active');
        this.navMenu?.classList.remove('active');
        document.body.style.overflow = '';
    }

    updateActiveSection() {
        const scrollPosition = window.scrollY + 100;
        
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    updateNavbarStyle() {
        if (window.scrollY > 50) {
            this.navbar?.classList.add('scrolled');
        } else {
            this.navbar?.classList.remove('scrolled');
        }
    }

    throttle(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Scroll Management System
class ScrollManager {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.createScrollIndicator();
    }

    bindEvents() {
        window.addEventListener('scroll', this.throttle(() => {
            this.updateScrollIndicator();
            this.handleScrollAnimations();
        }, 16)); // 60fps
    }

    createScrollIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'scroll-indicator';
        indicator.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 4px;
            background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
            z-index: 9999;
            transition: width 0.3s ease;
            width: 0%;
        `;
        document.body.appendChild(indicator);
        this.scrollIndicator = indicator;
    }

    updateScrollIndicator() {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        this.scrollIndicator.style.width = Math.min(scrolled, 100) + '%';
    }

    handleScrollAnimations() {
        const elements = document.querySelectorAll('[data-animate]');
        elements.forEach(element => {
            if (this.isElementInViewport(element) && !element.classList.contains('animated')) {
                const animationType = element.getAttribute('data-animate');
                element.classList.add(animationType, 'animated');
            }
        });
    }

    isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    throttle(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Animation Management System
class AnimationManager {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }

    init() {
        this.createObserver();
        this.setupAnimationTriggers();
    }

    createObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, this.observerOptions);

        // Observe all animatable elements
        document.querySelectorAll('.hero-content, .about-content, .project-card, .skill-category, .timeline-card, .contact-card').forEach(el => {
            this.observer.observe(el);
        });
    }

    animateElement(element) {
        if (element.classList.contains('animated')) return;

        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        requestAnimationFrame(() => {
            element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
            element.classList.add('animated');
        });

        this.observer.unobserve(element);
    }

    setupAnimationTriggers() {
        // Add staggered animations for lists
        document.querySelectorAll('.tech-list, .project-links, .social-links').forEach(container => {
            const items = container.children;
            Array.from(items).forEach((item, index) => {
                item.style.animationDelay = `${index * 0.1}s`;
            });
        });
    }
}

// Typing Animation System
class TypingAnimation {
    constructor() {
        this.init();
    }

    init() {
        const codeLines = document.querySelectorAll('.code-line .code-text');
        if (codeLines.length > 0) {
            this.animateCode(codeLines);
        }
    }

    animateCode(lines) {
        lines.forEach((line, index) => {
            line.style.opacity = '0';
            setTimeout(() => {
                this.typeText(line);
            }, index * 500);
        });
    }

    typeText(element) {
        const text = element.textContent;
        element.textContent = '';
        element.style.opacity = '1';
        
        let i = 0;
        const typeInterval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typeInterval);
            }
        }, 50);
    }
}

// Skills Animation System
class SkillsAnimation {
    constructor() {
        this.init();
    }

    init() {
        this.observeSkills();
    }

    observeSkills() {
        const skillsSection = document.querySelector('.skills');
        if (!skillsSection) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateSkillBars();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(skillsSection);
    }

    animateSkillBars() {
        const skillBars = document.querySelectorAll('.level-fill');
        skillBars.forEach((bar, index) => {
            setTimeout(() => {
                bar.style.width = bar.style.width || '0%';
                const targetWidth = bar.style.width;
                bar.style.width = '0%';
                
                setTimeout(() => {
                    bar.style.width = targetWidth;
                }, 100);
            }, index * 200);
        });
    }
}

// Performance Optimization System
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.lazyLoadImages();
        this.preloadCriticalResources();
        this.optimizeScrolling();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    preloadCriticalResources() {
        // Preload critical fonts
        const fontLinks = [
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap',
            'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap'
        ];

        fontLinks.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = href;
            document.head.appendChild(link);
        });
    }

    optimizeScrolling() {
        // Passive event listeners for better scroll performance
        document.addEventListener('scroll', () => {
            // Throttled scroll handling is already implemented in other classes
        }, { passive: true });

        document.addEventListener('touchstart', () => {}, { passive: true });
        document.addEventListener('touchmove', () => {}, { passive: true });
    }
}

// Contact Management System
class ContactManager {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupFormValidation();
    }

    bindEvents() {
        // Email links
        const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
        emailLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                this.trackEmailClick(e.target.href);
            });
        });

        // Phone links
        const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
        phoneLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                this.trackPhoneClick(e.target.href);
            });
        });

        // Social links
        const socialLinks = document.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                this.trackSocialClick(e.target.href);
            });
        });
    }

    setupFormValidation() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                    this.showFormError('Please fill in all required fields correctly.');
                }
            });
        });
    }

    validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });

        return isValid;
    }

    showFormError(message) {
        // Create or update error message
        let errorDiv = document.querySelector('.form-error');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'form-error';
            errorDiv.style.cssText = `
                color: #ef4444;
                background: rgba(239, 68, 68, 0.1);
                padding: 1rem;
                border-radius: 0.5rem;
                margin: 1rem 0;
                border: 1px solid rgba(239, 68, 68, 0.2);
            `;
        }
        errorDiv.textContent = message;
        document.querySelector('form')?.appendChild(errorDiv);
    }

    trackEmailClick(href) {
        console.log('Email clicked:', href);
        // Add analytics tracking here
    }

    trackPhoneClick(href) {
        console.log('Phone clicked:', href);
        // Add analytics tracking here
    }

    trackSocialClick(href) {
        console.log('Social link clicked:', href);
        // Add analytics tracking here
    }
}

// Stats Counter System
class StatsCounter {
    constructor() {
        this.init();
    }

    init() {
        this.observeStats();
    }

    observeStats() {
        const statsCards = document.querySelectorAll('.stat-card .stat-number');
        if (statsCards.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    this.animateNumber(entry.target);
                    entry.target.classList.add('counted');
                }
            });
        }, { threshold: 0.5 });

        statsCards.forEach(stat => observer.observe(stat));
    }

    animateNumber(element) {
        const finalNumber = element.textContent;
        const isPercentage = finalNumber.includes('%');
        const isPlus = finalNumber.includes('+');
        const numericValue = parseInt(finalNumber.replace(/[^\d]/g, ''));
        
        if (isNaN(numericValue)) return;

        let current = 0;
        const increment = Math.ceil(numericValue / 50);
        const timer = setInterval(() => {
            current += increment;
            if (current >= numericValue) {
                current = numericValue;
                clearInterval(timer);
            }
            
            let displayValue = current.toString();
            if (isPlus) displayValue += '+';
            if (isPercentage) displayValue += '%';
            
            element.textContent = displayValue;
        }, 30);
    }
}

// Initialize Portfolio App when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
    
    // Add some extra interactive features
    addKeyboardNavigation();
    addEasterEgg();
});

// Keyboard Navigation
function addKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // Press 'T' to toggle theme
        if (e.key.toLowerCase() === 't' && !e.ctrlKey && !e.metaKey) {
            const themeToggle = document.getElementById('themeToggle');
            if (themeToggle && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
                themeToggle.click();
            }
        }
        
        // Press 'H' to go to home
        if (e.key.toLowerCase() === 'h' && !e.ctrlKey && !e.metaKey) {
            if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    });
}

// Easter Egg - Konami Code
function addEasterEgg() {
    const konamiCode = [
        'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
        'KeyB', 'KeyA'
    ];
    let userInput = [];

    document.addEventListener('keydown', (e) => {
        userInput.push(e.code);
        if (userInput.length > konamiCode.length) {
            userInput.shift();
        }

        if (userInput.join('') === konamiCode.join('')) {
            triggerEasterEgg();
            userInput = [];
        }
    });

    function triggerEasterEgg() {
        // Create rainbow effect
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
            body { animation: rainbow 2s infinite; }
        `;
        document.head.appendChild(style);
        
        // Show message
        const message = document.createElement('div');
        message.textContent = '🎉 You found the secret! 🎉';
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7, #fd79a8);
            color: white;
            padding: 2rem;
            border-radius: 1rem;
            font-size: 1.5rem;
            font-weight: bold;
            text-align: center;
            z-index: 10001;
            animation: bounce 0.5s ease;
        `;
        document.body.appendChild(message);
        
        setTimeout(() => {
            document.head.removeChild(style);
            document.body.removeChild(message);
        }, 3000);
    }
}

// Additional utility functions for better UX
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Smooth scroll polyfill for older browsers
if (!('scrollBehavior' in document.documentElement.style)) {
    const smoothScrollPolyfill = () => {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    };
    
    document.addEventListener('DOMContentLoaded', smoothScrollPolyfill);
}
