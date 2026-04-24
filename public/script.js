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
    const pageRoot = document.documentElement;

    /**
     * Toggle navigation menu state
     * @param {boolean} [forceOpen] - Optional: force menu to specific state
     */
    function toggleNav(forceOpen) {
      const isOpen =
        typeof forceOpen === 'boolean' ? forceOpen : !navLinks.classList.contains('open');
      navLinks.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      pageRoot.classList.toggle('nav-open', isOpen);
      if (isOpen) {
        const firstLink = navLinks.querySelector('a');
        if (firstLink) firstLink.focus();
      } else {
        hamburger.focus();
      }
    }

    hamburger.addEventListener('click', () => toggleNav());

    document.addEventListener('click', (event) => {
      if (!navLinks.classList.contains('open')) return;
      if (navLinks.contains(event.target) || hamburger.contains(event.target)) return;
      toggleNav(false);
    });

    // Focus trap: keep keyboard focus inside the open mobile menu
    navLinks.addEventListener('keydown', (e) => {
      if (!navLinks.classList.contains('open')) return;
      const focusable = Array.from(navLinks.querySelectorAll('a'));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    // Event delegation: One listener for all links
    navLinks.addEventListener('click', (e) => {
      if (e.target.closest('a')) toggleNav(false);
    });

    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && navLinks.classList.contains('open')) toggleNav(false);
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
    const statusRegion = document.getElementById('contact-status');

    // Real-time validation feedback
    const inputs = form.querySelectorAll('input[required], textarea[required], select');
    inputs.forEach(input => {
      input.dataset.baseDescribedby = input.getAttribute('aria-describedby') || '';
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
      const fieldId = field.id || field.name;
      const existingDescription = field.dataset.baseDescribedby || field.getAttribute('aria-describedby') || '';
      const errorMsg = field.parentElement.querySelector('.error-message');
      if (errorMsg) errorMsg.remove();

      field.classList.remove('error', 'valid');
      field.removeAttribute('aria-invalid');
      if (existingDescription) {
        field.setAttribute('aria-describedby', existingDescription);
      } else {
        field.removeAttribute('aria-describedby');
      }

      if (!field.value.trim() && field.hasAttribute('required')) {
        showError(field, 'This field is required', fieldId);
        return false;
      }

      if (field.type === 'email' && field.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
          showError(field, 'Please enter a valid email address', fieldId);
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
    function showError(field, message, fieldId) {
      field.classList.add('error');
      field.setAttribute('aria-invalid', 'true');
      const errorDiv = document.createElement('p');
      errorDiv.className = 'error-message';
      errorDiv.id = `${fieldId}-error`;
      errorDiv.textContent = message;
      field.parentElement.appendChild(errorDiv);
      const describedBy = [field.dataset.baseDescribedby, errorDiv.id].filter(Boolean).join(' ').trim();
      field.setAttribute('aria-describedby', describedBy);
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
        if (statusRegion) {
          statusRegion.textContent = 'Please correct the highlighted form fields before submitting.';
        }
        if (firstError) {
          firstError.focus();
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      // Show loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
        submitBtn.classList.add('loading');
      }

      try {
        // Submit to Web3Forms
        const formData = new FormData(form);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: json
        });

        const result = await response.json();

        if (response.status === 200) {
          showSuccessMessage();
          form.reset();
          inputs.forEach(input => input.classList.remove('valid'));
        } else {
          throw new Error(result.message || 'Form submission failed');
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
      if (statusRegion) {
        statusRegion.textContent = 'Thank you. Your message was sent successfully.';
      }
      const successDiv = document.createElement('div');
      successDiv.className = 'form-message success';
      successDiv.setAttribute('role', 'alert');
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
      if (statusRegion) {
        statusRegion.textContent = 'There was a problem sending your message. Please try again or email directly.';
      }
      const errorDiv = document.createElement('div');
      errorDiv.className = 'form-message error';
      errorDiv.setAttribute('role', 'alert');
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
     * Update ARIA label and aria-pressed on theme toggle button
     */
    function updateAriaState() {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      toggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
      toggle.setAttribute('aria-pressed', String(isDark));
    }
    updateAriaState();
    toggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      updateAriaState();
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
   * Service card flip support for touch and keyboard users.
   * Hover still works via CSS; click toggles a persistent flipped state.
   */
  function setupServiceCardFlip() {
    const cards = document.querySelectorAll('.service-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const nextState = !card.classList.contains('flipped');
        cards.forEach(other => {
          if (other !== card) {
            other.classList.remove('flipped');
            other.setAttribute('aria-expanded', 'false');
          }
        });
        card.classList.toggle('flipped', nextState);
        card.setAttribute('aria-expanded', String(nextState));
      });

      card.addEventListener('blur', (event) => {
        if (!card.contains(event.relatedTarget)) {
          card.classList.remove('flipped');
          card.setAttribute('aria-expanded', 'false');
        }
      });

      card.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          card.classList.remove('flipped');
          card.setAttribute('aria-expanded', 'false');
          card.blur();
        }
      });
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

  /**
   * FAQ accordion: toggle answer visibility with proper ARIA state
   */
  function setupFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
      const btn = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      if (!btn || !answer) return;

      btn.addEventListener('click', () => {
        const isOpen = btn.getAttribute('aria-expanded') === 'true';
        // Close all others
        faqItems.forEach(other => {
          const otherBtn = other.querySelector('.faq-question');
          const otherAnswer = other.querySelector('.faq-answer');
          if (otherBtn && otherAnswer) {
            otherBtn.setAttribute('aria-expanded', 'false');
            otherAnswer.hidden = true;
            other.classList.remove('faq-open');
          }
        });
        // Toggle current
        if (!isOpen) {
          btn.setAttribute('aria-expanded', 'true');
          answer.hidden = false;
          item.classList.add('faq-open');
        }
      });
    });
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
  setupServiceCardFlip();
  setupCountingStats();
  setupScrollspy();
  setupMarquee();
  setupFaqAccordion();
});
