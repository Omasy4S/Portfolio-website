/* ============================================
   КОНСТАНТЫ И НАСТРОЙКИ
   ============================================ */

// Отступ при прокрутке к секции (учитывает высоту navbar)
const SCROLL_OFFSET = 80;

// Порог для определения активной секции в навигации
const SCROLL_THRESHOLD = 200;

// Селекторы элементов для анимации появления
const ANIMATION_SELECTORS = '.project-card, .tech-card, .learning-card, .contact-card';


/* ============================================
   ПЛАВНАЯ ПРОКРУТКА
   ============================================ */

/**
 * Обработчик плавной прокрутки к секциям
 * @param {Event} e - Событие клика
 */
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

// Инициализация плавной прокрутки будет в DOMContentLoaded


/* ============================================
   АНИМАЦИЯ ПОЯВЛЕНИЯ ЭЛЕМЕНТОВ
   ============================================ */

/**
 * Intersection Observer для анимации появления элементов при скролле
 * Отслеживает когда элемент попадает в область видимости
 */
const animationObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Делаем элемент видимым и возвращаем на место
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  },
  {
    threshold: 0.1, // Срабатывает когда 10% элемента видно
    rootMargin: '0px 0px -50px 0px' // Отступ снизу для более раннего срабатывания
  }
);


/* ============================================
   АКТИВНАЯ НАВИГАЦИЯ
   ============================================ */

/**
 * Обновляет активный пункт навигации в зависимости от текущей секции
 * Подсвечивает ссылку соответствующую видимой секции
 */
const updateActiveNav = () => {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  
  let currentSection = '';
  
  // Определяем текущую секцию на основе позиции скролла
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - SCROLL_THRESHOLD) {
      currentSection = section.getAttribute('id');
    }
  });

  // Обновляем класс active для соответствующей ссылки
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${currentSection}`);
  });
};


/* ============================================
   УМНЫЕ ТУЛТИПЫ (ПОДСКАЗКИ)
   ============================================ */

/**
 * Инициализирует тултипы которые следуют за курсором мыши
 * Создает динамические подсказки для элементов с атрибутом data-tooltip
 */
const handleTooltipPosition = () => {
  const tooltipElements = document.querySelectorAll('[data-tooltip]');
  
  tooltipElements.forEach(element => {
    let tooltip = null;
    
    // При наведении создаем тултип
    element.addEventListener('mouseenter', (e) => {
      tooltip = document.createElement('div');
      tooltip.className = 'custom-tooltip';
      tooltip.textContent = element.getAttribute('data-tooltip');
      document.body.appendChild(tooltip);
      
      // Позиционируем тултип рядом с курсором
      updateTooltipPosition(e, tooltip);
    });
    
    // При движении мыши обновляем позицию тултипа
    element.addEventListener('mousemove', (e) => {
      if (tooltip) {
        updateTooltipPosition(e, tooltip);
      }
    });
    
    // При уходе курсора удаляем тултип
    element.addEventListener('mouseleave', () => {
      if (tooltip) {
        tooltip.remove();
        tooltip = null;
      }
    });
  });
};

/**
 * Обновляет позицию тултипа относительно курсора
 * Автоматически корректирует позицию если тултип выходит за границы экрана
 * @param {Event} e - Событие движения мыши
 * @param {HTMLElement} tooltip - Элемент тултипа
 */
const updateTooltipPosition = (e, tooltip) => {
  const offsetX = 10; // Отступ по горизонтали от курсора
  const offsetY = 20; // Отступ по вертикали от курсора
  
  // По умолчанию показываем тултип справа-снизу от курсора
  let x = e.clientX + offsetX;
  let y = e.clientY + offsetY;
  
  const tooltipRect = tooltip.getBoundingClientRect();
  
  // Если тултип выходит за правый край экрана - показываем слева
  if (x + tooltipRect.width > window.innerWidth - 10) {
    x = e.clientX - tooltipRect.width - offsetX;
  }
  
  // Если тултип выходит за нижний край экрана - показываем сверху
  if (y + tooltipRect.height > window.innerHeight - 10) {
    y = e.clientY - tooltipRect.height - offsetY;
  }
  
  tooltip.style.left = x + 'px';
  tooltip.style.top = y + 'px';
};


/* ============================================
   ПАРАЛЛАКС ЭФФЕКТЫ
   ============================================ */

/**
 * Параллакс эффект при скролле для hero секции
 * Плавающие фигуры двигаются с разной скоростью при прокрутке
 */
const handleParallax = () => {
  const hero = document.querySelector('.hero');
  const shapes = document.querySelectorAll('.floating-shape');
  
  if (!hero) return;
  
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const heroHeight = hero.offsetHeight;
    
    // Применяем параллакс только пока hero секция видна
    if (scrolled < heroHeight) {
      shapes.forEach((shape, index) => {
        // Каждая фигура двигается с разной скоростью
        const speed = 0.3 + (index * 0.1);
        const yPos = -(scrolled * speed);
        shape.style.transform = `translateY(${yPos}px)`;
      });
    }
  }, { passive: true }); // passive для лучшей производительности
};

/**
 * Параллакс эффект при движении мыши
 * Плавающие фигуры следуют за курсором с разной интенсивностью
 */
const handleMouseMove = () => {
  const hero = document.querySelector('.hero');
  const shapes = document.querySelectorAll('.floating-shape');
  
  if (!hero) return;
  
  hero.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    
    // Вычисляем позицию курсора относительно центра экрана (-1 до 1)
    const xPercent = (clientX / innerWidth - 0.5) * 2;
    const yPercent = (clientY / innerHeight - 0.5) * 2;
    
    // Каждая фигура реагирует с разной интенсивностью
    shapes.forEach((shape, index) => {
      const speed = 10 + (index * 5); // Увеличивающаяся скорость для каждой фигуры
      const x = xPercent * speed;
      const y = yPercent * speed;
      shape.style.transform = `translate(${x}px, ${y}px)`;
    });
  });
};


/* ============================================
   ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ
   ============================================ */

/**
 * Добавляет эффект скролла для navbar
 * При прокрутке страницы navbar становится более непрозрачным
 */
const handleNavbarScroll = () => {
  const navbar = document.querySelector('.navbar');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });
};

/**
 * Управляет кнопкой "Наверх"
 * Показывает/скрывает кнопку в зависимости от позиции скролла
 */
const handleScrollToTop = () => {
  const scrollToTopBtn = document.getElementById('scrollToTop');
  
  if (!scrollToTopBtn) return;
  
  // Показываем/скрываем кнопку при скролле
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollToTopBtn.classList.add('visible');
    } else {
      scrollToTopBtn.classList.remove('visible');
    }
  }, { passive: true });
  
  // Обработчик клика - плавная прокрутка наверх
  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
};

/**
 * Анимированные счётчики для статистики
 * Числа плавно считаются от 0 до целевого значения
 */
const animateCounters = () => {
  const stats = document.querySelectorAll('.stat-value');
  let animated = false;
  
  const animateValue = (element, start, end, duration, suffix = '') => {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        element.textContent = end + suffix;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current) + suffix;
      }
    }, 16);
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        stats.forEach(stat => {
          const text = stat.textContent;
          const value = parseInt(text);
          const suffix = text.replace(/[0-9]/g, '');
          animateValue(stat, 0, value, 2000, suffix);
        });
      }
    });
  }, { threshold: 0.5 });
  
  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) observer.observe(statsSection);
};

/**
 * Ripple эффект для кнопок
 * Создаёт волновой эффект при клике
 */
const addRippleEffect = () => {
  const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .contact-btn');
  
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        left: ${x}px;
        top: ${y}px;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
      `;
      
      this.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  });
};

/**
 * Анимация появления элементов timeline
 */
const animateTimeline = () => {
  const timelineItems = document.querySelectorAll('.timeline-item');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 150);
      }
    });
  }, { threshold: 0.2 });
  
  timelineItems.forEach(item => observer.observe(item));
};

/**
 * Инициализация всех функций после загрузки DOM
 * Запускается когда HTML полностью загружен и готов к работе
 */
document.addEventListener('DOMContentLoaded', () => {
  
  // 0. Инициализация плавной прокрутки
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', handleSmoothScroll);
  });
  
  // 1. Настройка анимаций появления элементов
  const animatedElements = document.querySelectorAll(ANIMATION_SELECTORS);
  animatedElements.forEach(el => {
    // Изначально скрываем элементы и сдвигаем вниз
    el.style.cssText = 'opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease, transform 0.6s ease';
    // Подключаем наблюдатель для анимации при появлении
    animationObserver.observe(el);
  });
  
  // 2. Отслеживание скролла для активной навигации
  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav(); // Вызываем сразу для установки начального состояния
  
  // 3. Инициализация тултипов
  handleTooltipPosition();
  
  // 4. Запуск параллакс эффектов
  handleParallax();
  handleMouseMove();
  
  // 5. Эффект скролла для navbar
  handleNavbarScroll();
  
  // 6. Кнопка "Наверх"
  handleScrollToTop();
  
  // 7. Анимированные счётчики
  animateCounters();
  
  // 8. Ripple эффект для кнопок
  addRippleEffect();
  
  // 9. Анимация timeline
  animateTimeline();
});

// Дополнительная проверка после полной загрузки страницы (для GitHub Pages)
window.addEventListener('load', () => {
  updateActiveNav();
});
