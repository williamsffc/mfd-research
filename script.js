/**
 * Main application initialization
 * Sets up all interactive features when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
  /**
   * Combined scroll handler for navbar and back-to-top button
   * Uses passive listeners for better scroll performance
   */
  function setupScrollHandlers() {
    const navbar = document.getElementById('navbar');
    const backToTopBtn = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (navbar) navbar.classList.toggle('scrolled', scrollY > 40);
      if (backToTopBtn) backToTopBtn.classList.toggle('visible', scrollY > 300);
    }, { passive: true });

    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  /**
   * Mobile navigation toggle functionality
   * Handles hamburger menu, escape key, and click outside to close
   */
  function setupMobileNavToggle() {
    const navLinks = document.getElementById('navLinks');
    const hamburger = document.getElementById('hamburger');
    if (!navLinks || !hamburger) return;

    /**
     * Toggle navigation menu state
     * @param {boolean} [forceOpen] - Optional: force menu to specific state
     */
    function toggleNav(forceOpen) {
      const isOpen =
        typeof forceOpen === 'boolean' ? forceOpen : !navLinks.classList.contains('open');
      navLinks.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    }

    hamburger.addEventListener('click', () => toggleNav());
    
    // Event delegation: One listener for all links
    navLinks.addEventListener('click', (e) => {
      if (e.target.closest('a')) toggleNav(false);
    });

    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') toggleNav(false);
    });
  }

  /**
   * Scroll-triggered reveal animations
   * Uses IntersectionObserver for performance
   */
  function setupScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal, .timeline-item');
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealElements.forEach((element) => revealObserver.observe(element));
  }

  /**
   * Timeline item highlighting based on scroll position
   * Keeps one timeline item active based on viewport center
   */
  function setupTimelineHighlight() {
    const timelineItems = Array.from(document.querySelectorAll('.timeline-item'));
    if (timelineItems.length === 0) return;

    let activeItem = null;
    let ticking = false;

    function setActiveItem(nextItem) {
      if (activeItem === nextItem) return;
      timelineItems.forEach((item) => {
        item.classList.toggle('is-active', item === nextItem);
      });
      activeItem = nextItem;
    }

    function updateActiveItem() {
      ticking = false;
      const viewportCenter = window.innerHeight / 2;
      let closestItem = timelineItems[0];
      let closestDistance = Number.POSITIVE_INFINITY;

      timelineItems.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const itemCenter = rect.top + rect.height / 2;
        const distance = Math.abs(itemCenter - viewportCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestItem = item;
        }
      });

      setActiveItem(closestItem);
    }

    function requestUpdate() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateActiveItem);
    }

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    updateActiveItem();
  }

  /**
   * Automatically sets copyright year in footer
   */
  function setupFooterYear() {
    const footerYear = document.getElementById('footerYear');
    if (!footerYear) return;
    footerYear.textContent = new Date().getFullYear();
  }

  /**
   * Form validation and UX enhancement
   * Provides real-time validation, error messages, and submit feedback
   */
  function setupFormValidation() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    const submitBtn = form.querySelector('.form-submit');
    const originalBtnText = submitBtn ? submitBtn.textContent : 'Send Message →';

    // Real-time validation feedback
    const inputs = form.querySelectorAll('input[required], textarea[required], select');
    inputs.forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('error')) {
          validateField(input);
        }
      });
    });

    /**
     * Validate a single form field
     * @param {HTMLElement} field - The input/textarea/select element to validate
     * @returns {boolean} True if valid, false otherwise
     */
    function validateField(field) {
      const errorMsg = field.parentElement.querySelector('.error-message');
      if (errorMsg) errorMsg.remove();

      field.classList.remove('error', 'valid');

      if (!field.value.trim() && field.hasAttribute('required')) {
        showError(field, 'This field is required');
        return false;
      }

      if (field.type === 'email' && field.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
          showError(field, 'Please enter a valid email address');
          return false;
        }
      }

      field.classList.add('valid');
      return true;
    }

    /**
     * Display error message for a field
     * @param {HTMLElement} field - The field that has an error
     * @param {string} message - The error message to display
     */
    function showError(field, message) {
      field.classList.add('error');
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-message';
      errorDiv.textContent = message;
      field.parentElement.appendChild(errorDiv);
    }

    /**
     * Handle form submission with validation and error handling
     * Submits to Netlify Forms with async/await
     */
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Validate all fields
      let isValid = true;
      inputs.forEach(input => {
        if (!validateField(input)) isValid = false;
      });

      if (!isValid) {
        const firstError = form.querySelector('.error');
        if (firstError) {
          firstError.focus();
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      // Show loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        submitBtn.classList.add('loading');
      }

      try {
        // Submit to Netlify
        const formData = new FormData(form);
        const response = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(formData).toString()
        });

        if (response.ok) {
          showSuccessMessage();
          form.reset();
          inputs.forEach(input => input.classList.remove('valid'));
        } else {
          throw new Error('Form submission failed');
        }
      } catch (error) {
        showErrorMessage();
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
          submitBtn.classList.remove('loading');
        }
      }
    });

    /**
     * Display success message after form submission
     */
    function showSuccessMessage() {
      const successDiv = document.createElement('div');
      successDiv.className = 'form-message success';
      successDiv.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        <span>Thank you! Your message has been sent successfully. We'll respond within 1-2 business days.</span>
      `;
      form.insertAdjacentElement('beforebegin', successDiv);
      setTimeout(() => successDiv.remove(), 8000);
    }

    /**
     * Display error message if form submission fails
     */
    function showErrorMessage() {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'form-message error';
      errorDiv.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <span>Oops! Something went wrong. Please try again or email us directly at info@mfdresearch.com</span>
      `;
      form.insertAdjacentElement('beforebegin', errorDiv);
      setTimeout(() => errorDiv.remove(), 8000);
    }
  }

  /**
   * Dark/light theme toggle functionality
   * Respects system preferences and saves user choice to localStorage
   */
  function setupThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;

    // Load saved theme or system preference
    try {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    } catch (e) {}

    /**
     * Update ARIA label on theme toggle button for accessibility
     */
    function updateAriaLabel() {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      toggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    }
    updateAriaLabel();
    toggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      updateAriaLabel();
    });
  }

  /**
   * Page loader animation
   * Hides loader overlay once page is fully loaded
   */
  function setupLoader() {
    const loader = document.getElementById('loader-overlay');
    if (!loader) return;

    /**
     * Hide the loading overlay and mark body as loaded
     */
    const hideLoader = () => {
      loader.classList.add('loader-hidden');
      document.body.classList.add('loaded');
    };

    if (document.readyState === 'complete') {
      hideLoader();
    } else {
      window.addEventListener('load', hideLoader);
    }
  }

  /**
   * Smooth scrolling for anchor links
   * Uses event delegation for better performance
   */
  function setupSmoothScroll() {
    // Event delegation for smooth scrolling
    document.addEventListener('click', (e) => {
      const anchor = e.target.closest('a[href^="#"]:not([href="#"])');
      if (!anchor) return;

      const targetId = anchor.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  }

  /**
   * Register service worker for offline support
   * Only registers in production (when served over HTTPS)
   */
  function setupServiceWorker() {
    if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content available — could notify user here
              }
            });
          });
        })
        .catch(() => {});
    }
  }

  /**
   * Cursor spotlight effect on service and trust cards
   * Tracks mouse position and renders a radial light on each card
   */
  function setupCursorSpotlight() {
    const cards = document.querySelectorAll('.service-card-front, .trust-card');
    cards.forEach(card => {
      const spotlight = document.createElement('div');
      spotlight.className = 'card-spotlight';
      card.appendChild(spotlight);

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        spotlight.style.setProperty('--x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
        spotlight.style.setProperty('--y', `${((e.clientY - rect.top) / rect.height) * 100}%`);
      });

      card.addEventListener('mouseenter', () => { spotlight.style.opacity = '1'; });
      card.addEventListener('mouseleave', () => { spotlight.style.opacity = '0'; });
    });
  }

  /**
   * Animates numeric stats (data-count) counting up when they enter the viewport
   * Uses ease-out cubic easing for a satisfying feel
   */
  function setupCountingStats() {
    const elements = document.querySelectorAll('[data-count]');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);

        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        const duration = 1400;
        const start = performance.now();

        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target) + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
      });
    }, { threshold: 0.6 });

    elements.forEach(el => observer.observe(el));
  }

  /**
   * Highlights the matching nav link as sections scroll into view
   * Excludes the .nav-cta button from the active treatment
   */
  function setupScrollspy() {
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]:not(.nav-cta)');
    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
          link.classList.toggle('spy-active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      });
    }, { rootMargin: '-72px 0px -55% 0px', threshold: 0 });

    sections.forEach(s => observer.observe(s));
  }

  /**
   * Converts the credibility bar into a seamless looping marquee
   * Clones the inner items and animates via CSS; pauses on hover
   */
  function setupMarquee() {
    const credibility = document.getElementById('credibility');
    const inner = credibility?.querySelector('.cred-inner');
    if (!inner) return;

    const track = document.createElement('div');
    track.className = 'cred-track';
    inner.parentNode.insertBefore(track, inner);
    track.appendChild(inner);

    const clone = inner.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  }

  // Initialize all features
  setupScrollHandlers();
  setupMobileNavToggle();
  setupScrollReveal();
  setupTimelineHighlight();
  setupFooterYear();
  setupFormValidation();
  setupThemeToggle();
  setupLoader();
  setupSmoothScroll();
  setupServiceWorker();
  setupCursorSpotlight();
  setupCountingStats();
  setupScrollspy();
  setupMarquee();
});
