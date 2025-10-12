// Constants
const SCROLL_OFFSET = 80;
const SCROLL_THRESHOLD = 200;
const ANIMATION_SELECTORS = '.timeline-item, .project-card, .tech-card, .contact-card';

// Smooth scroll handler
const handleSmoothScroll = (e) => {
  e.preventDefault();
  const target = document.querySelector(e.currentTarget.getAttribute('href'));
  
  if (target) {
    window.scrollTo({
      top: target.offsetTop - SCROLL_OFFSET,
      behavior: 'smooth'
    });
  }
};

// Initialize smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', handleSmoothScroll);
});

// Intersection Observer for animations
const animationObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  },
  {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  }
);

// Active navigation handler
const updateActiveNav = () => {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  
  let currentSection = '';
  
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - SCROLL_THRESHOLD) {
      currentSection = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${currentSection}`);
  });
};

// Tooltip follows cursor
const handleTooltipPosition = () => {
  const tooltipElements = document.querySelectorAll('[data-tooltip]');
  
  tooltipElements.forEach(element => {
    let tooltip = null;
    
    element.addEventListener('mouseenter', (e) => {
      // Create tooltip element
      tooltip = document.createElement('div');
      tooltip.className = 'custom-tooltip';
      tooltip.textContent = element.getAttribute('data-tooltip');
      document.body.appendChild(tooltip);
      
      // Position tooltip near cursor
      updateTooltipPosition(e, tooltip);
    });
    
    element.addEventListener('mousemove', (e) => {
      if (tooltip) {
        updateTooltipPosition(e, tooltip);
      }
    });
    
    element.addEventListener('mouseleave', () => {
      if (tooltip) {
        tooltip.remove();
        tooltip = null;
      }
    });
  });
};

const updateTooltipPosition = (e, tooltip) => {
  const offsetX = 10;
  const offsetY = 20;
  
  // Always position tooltip below and to the right of cursor
  let x = e.clientX + offsetX;
  let y = e.clientY + offsetY;
  
  // Check if tooltip goes off screen
  const tooltipRect = tooltip.getBoundingClientRect();
  
  // If goes off right edge, show on left side of cursor
  if (x + tooltipRect.width > window.innerWidth - 10) {
    x = e.clientX - tooltipRect.width - offsetX;
  }
  
  // If goes off bottom edge, show above cursor
  if (y + tooltipRect.height > window.innerHeight - 10) {
    y = e.clientY - tooltipRect.height - offsetY;
  }
  
  tooltip.style.left = x + 'px';
  tooltip.style.top = y + 'px';
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  // Setup fade-in animations
  const animatedElements = document.querySelectorAll(ANIMATION_SELECTORS);
  
  animatedElements.forEach(el => {
    el.style.cssText = 'opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease, transform 0.6s ease';
    animationObserver.observe(el);
  });
  
  // Setup scroll listener
  window.addEventListener('scroll', updateActiveNav, { passive: true });
  
  // Setup tooltip positioning
  handleTooltipPosition();
});
