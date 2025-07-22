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

// Scroll Management and Animations
class ScrollManager {
  constructor() {
    this.init();
  }

  init() {
    this.createScrollIndicator();
    this.bindEvents();
  }

  createScrollIndicator() {
    // Create scroll progress indicator
    const indicator = document.createElement('div');
    indicator.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      height: 3px;
      background: linear-gradient(90deg, #3b82f6, #8b5cf6);
      z-index: 9999;
      transition: width 0.25s ease;
      width: 0%;
    `;
    document.body.appendChild(indicator);
    this.scrollIndicator = indicator;
  }

  bindEvents() {
    window.addEventListener('scroll', this.throttle(() => this.updateScrollIndicator(), 16));
  }

  updateScrollIndicator() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    this.scrollIndicator.style.width = `${Math.min(scrollPercent, 100)}%`;
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
    this.observedElements = new Set();
    this.init();
  }

  init() {
    this.createIntersectionObserver();
    this.observeElements();
  }

  createIntersectionObserver() {
    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );
  }

  observeElements() {
    const elementsToAnimate = document.querySelectorAll(`
      .project-card,
      .skill-category,
      .timeline-item,
      .stat-card,
      .contact-card,
      .profile-card,
      .about-text,
      .tech-grid
    `);

    elementsToAnimate.forEach((element, index) => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
      element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      element.style.transitionDelay = `${index * 0.1}s`;
      this.observer.observe(element);
    });
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting && !this.observedElements.has(entry.target)) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        this.observedElements.add(entry.target);
      }
    });
  }
}

// Typing Animation for Hero Section
class TypingAnimation {
  constructor() {
    this.element = document.querySelector('.title-role');
    this.texts = [
      'Full Stack Developer',
      'Backend Engineer',
      'Problem Solver',
      'Innovation Enthusiast'
    ];
    this.currentIndex = 0;
    this.currentText = '';
    this.isDeleting = false;
    this.typeSpeed = 100;
    this.deleteSpeed = 50;
    this.pauseTime = 2000;

    if (this.element) {
      this.init();
    }
  }

  init() {
    this.type();
  }

  type() {
    const fullText = this.texts[this.currentIndex];

    if (this.isDeleting) {
      this.currentText = fullText.substring(0, this.currentText.length - 1);
    } else {
      this.currentText = fullText.substring(0, this.currentText.length + 1);
    }

    this.element.textContent = this.currentText;

    let typeSpeed = this.isDeleting ? this.deleteSpeed : this.typeSpeed;

    if (!this.isDeleting && this.currentText === fullText) {
      typeSpeed = this.pauseTime;
      this.isDeleting = true;
    } else if (this.isDeleting && this.currentText === '') {
      this.isDeleting = false;
      this.currentIndex = (this.currentIndex + 1) % this.texts.length;
    }

    setTimeout(() => this.type(), typeSpeed);
  }
}

// Skills Animation System
class SkillsAnimation {
  constructor() {
    this.skillBars = document.querySelectorAll('.level-fill');
    this.animated = new Set();
    this.init();
  }

  init() {
    if (this.skillBars.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => this.handleSkillsIntersection(entries),
      { threshold: 0.5 }
    );

    document.querySelectorAll('.skill-category').forEach(category => {
      observer.observe(category);
    });
  }

  handleSkillsIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting && !this.animated.has(entry.target)) {
        const skillBars = entry.target.querySelectorAll('.level-fill');
        skillBars.forEach((bar, index) => {
          setTimeout(() => {
            const width = bar.style.width;
            bar.style.width = '0%';
            bar.style.transition = 'width 1s ease-out';
            setTimeout(() => {
              bar.style.width = width;
            }, 100);
          }, index * 200);
        });
        this.animated.add(entry.target);
      }
    });
  }
}

// Stats Counter Animation
class StatsCounter {
  constructor() {
    this.counters = document.querySelectorAll('.stat-number');
    this.animated = new Set();
    this.init();
  }

  init() {
    if (this.counters.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => this.handleCounterIntersection(entries),
      { threshold: 0.8 }
    );

    this.counters.forEach(counter => {
      observer.observe(counter);
    });
  }

  handleCounterIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting && !this.animated.has(entry.target)) {
        this.animateCounter(entry.target);
        this.animated.add(entry.target);
      }
    });
  }

  animateCounter(element) {
    const target = element.textContent;
    const isNumber = /^\d+$/.test(target);
    
    if (!isNumber) return;
    
    const finalValue = parseInt(target);
    const duration = 2000;
    const increment = finalValue / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= finalValue) {
        element.textContent = target; // Keep original format (e.g., "300+", "25%")
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current).toString();
      }
    }, 16);
  }
}

// Contact Management System
class ContactManager {
  constructor() {
    this.init();
  }

  init() {
    this.bindEmailCopy();
    this.bindPhoneCopy();
  }

  bindEmailCopy() {
    const emailElements = document.querySelectorAll('p, a');
    emailElements.forEach(element => {
      if (element.textContent.includes('pulkit.jindal30@gmail.com')) {
        element.style.cursor = 'pointer';
        element.title = 'Click to copy email';
        element.addEventListener('click', (e) => {
          e.preventDefault();
          this.copyToClipboard('pulkit.jindal30@gmail.com', 'Email');
        });
      }
    });
  }

  bindPhoneCopy() {
    const phoneElements = document.querySelectorAll('p, a');
    phoneElements.forEach(element => {
      if (element.textContent.includes('+91-97737-35800')) {
        element.style.cursor = 'pointer';
        element.title = 'Click to copy phone number';
        element.addEventListener('click', (e) => {
          e.preventDefault();
          this.copyToClipboard('+919773735800', 'Phone number');
        });
      }
    });
  }

  async copyToClipboard(text, type) {
    try {
      await navigator.clipboard.writeText(text);
      this.showNotification(`${type} copied to clipboard!`, 'success');
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      this.showNotification(`${type} copied to clipboard!`, 'success');
    }
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#10b981' : '#3b82f6'};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 0.75rem;
      font-weight: 500;
      font-size: 0.875rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      z-index: 10000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);

    // Animate out and remove
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }
}

// Performance Optimization System
class PerformanceOptimizer {
  constructor() {
    this.init();
  }

  init() {
    this.lazyLoadImages();
    this.prefetchResources();
    this.optimizeScrollEvents();
    this.preloadCriticalResources();
  }

  lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback for older browsers
      images.forEach(img => {
        img.src = img.dataset.src;
      });
    }
  }

  prefetchResources() {
    // Prefetch important resources on hover
    const importantLinks = document.querySelectorAll('a[href^="http"]');
    
    importantLinks.forEach(link => {
      link.addEventListener('mouseenter', () => {
        const prefetchLink = document.createElement('link');
        prefetchLink.rel = 'prefetch';
        prefetchLink.href = link.href;
        document.head.appendChild(prefetchLink);
      }, { once: true });
    });
  }

  optimizeScrollEvents() {
    // Use passive listeners for better scroll performance
    const passiveOptions = { passive: true };
    
    // Remove existing scroll listeners and add passive ones
    window.addEventListener('scroll', () => {}, passiveOptions);
    window.addEventListener('touchstart', () => {}, passiveOptions);
    window.addEventListener('touchmove', () => {}, passiveOptions);
  }

  preloadCriticalResources() {
    // Preload critical fonts
    const criticalFonts = [
      'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap',
      'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap'
    ];

    criticalFonts.forEach(fontUrl => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = fontUrl;
      link.as = 'style';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }
}

// Utility Functions
class Utils {
  static debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func(...args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func(...args);
    };
  }

  static throttle(func, wait) {
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

  static getScrollPercent() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    return Math.round((scrollTop / docHeight) * 100);
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

// Service Worker Registration for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('SW registered:', registration);
    } catch (registrationError) {
      console.log('SW registration failed:', registrationError);
    }
  });
}

// Handle online/offline status
window.addEventListener('online', () => {
  document.body.classList.remove('offline');
});

window.addEventListener('offline', () => {
  document.body.classList.add('offline');
});

// Add CSS for offline indicator
const offlineCSS = `
  .offline::before {
    content: 'You are offline';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: #ef4444;
    color: white;
    text-align: center;
    padding: 0.5rem;
    z-index: 10000;
    font-size: 0.875rem;
  }
`;

const offlineStyle = document.createElement('style');
offlineStyle.textContent = offlineCSS;
document.head.appendChild(offlineStyle);

// Console message for developers
console.log(`
  ╔══════════════════════════════════════╗
  ║                                      ║
  ║        🚀 Pulkit's Portfolio         ║
  ║                                      ║
  ║   Built with vanilla JavaScript      ║
  ║   Designed for performance           ║
  ║   Crafted with attention to detail   ║
  ║                                      ║
  ║   Press 'T' to toggle theme          ║
  ║   Press 'H' to go to home            ║
  ║                                      ║
  ║   Want to hire me? 📧                ║
  ║   pulkit.jindal30@gmail.com          ║
  ║                                      ║
  ╚══════════════════════════════════════╝
`);
class OptimizedNavigationManager {
  constructor() {
    this.navbar = document.querySelector('.navbar');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.sections = document.querySelectorAll('section[id]');
    
    // Cache section positions
    this.sectionData = [];
    this.cacheSectionPositions();
    
    // Recalculate on resize only
    window.addEventListener('resize', this.debounce(() => {
      this.cacheSectionPositions();
    }, 250));
  }

  cacheSectionPositions() {
    this.sectionData = Array.from(this.sections).map(section => ({
      id: section.getAttribute('id'),
      top: section.offsetTop,
      height: section.offsetHeight,
      element: section
    }));
  }

  updateActiveSection() {
    const scrollPosition = window.scrollY + 100;
    
    // Use cached data instead of DOM queries
    for (const section of this.sectionData) {
      if (scrollPosition >= section.top && 
          scrollPosition < section.top + section.height) {
        this.setActiveSection(section.id);
        break; // Exit early once found
      }
    }
  }

  setActiveSection(activeId) {
    // Only update if section changed
    if (this.currentActiveId === activeId) return;
    
    this.currentActiveId = activeId;
    
    // Batch DOM updates
    requestAnimationFrame(() => {
      this.navLinks.forEach(link => {
        const isActive = link.getAttribute('href') === `#${activeId}`;
        link.classList.toggle('active', isActive);
      });
    });
  }
}

class OptimizedScrollManager {
  constructor() {
    this.documentHeight = 0;
    this.windowHeight = 0;
    this.ticking = false;
    
    this.init();
    this.cacheDocumentMetrics();
    
    // Only recalculate on resize
    window.addEventListener('resize', this.debounce(() => {
      this.cacheDocumentMetrics();
    }, 250));
  }

  cacheDocumentMetrics() {
    this.documentHeight = document.documentElement.scrollHeight;
    this.windowHeight = window.innerHeight;
  }

  onScroll() {
    if (!this.ticking) {
      requestAnimationFrame(() => {
        this.updateScrollIndicator();
        this.ticking = false;
      });
      this.ticking = true;
    }
  }

  updateScrollIndicator() {
    const scrollTop = window.pageYOffset;
    const maxScroll = this.documentHeight - this.windowHeight;
    const scrollPercent = Math.min((scrollTop / maxScroll) * 100, 100);
    
    // Use transform instead of width for better performance
    this.scrollIndicator.style.transform = `scaleX(${scrollPercent / 100})`;
  }
}

class PerformantScrollHandler {
  constructor() {
    this.isScrolling = false;
    this.scrollCallbacks = [];
  }

  addScrollCallback(callback) {
    this.scrollCallbacks.push(callback);
  }

  init() {
    window.addEventListener('scroll', () => {
      if (!this.isScrolling) {
        this.isScrolling = true;
        requestAnimationFrame(() => {
          // Execute all scroll callbacks in a single frame
          this.scrollCallbacks.forEach(callback => callback());
          this.isScrolling = false;
        });
      }
    }, { passive: true });
  }
}

