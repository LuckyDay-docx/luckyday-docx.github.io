document.addEventListener('DOMContentLoaded', () => {
  // =========================================================
  // MOBILE MENU
  // =========================================================

  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav');

  const closeMenu = () => {
    if (!nav || !burger) return;
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
  };

  if (burger && nav) {
    burger.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(isOpen));
    });

    document.querySelectorAll('.nav a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !burger.contains(e.target)) {
        closeMenu();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  // =========================================================
  // MODALS
  // =========================================================

  const modals = document.querySelectorAll('.modal');
  const openers = document.querySelectorAll('.open-modal, .js-open-modal');
  const closers = document.querySelectorAll('.close-modal, .js-close-modal');

  // Храним элемент, который открыл модалку,
  // чтобы вернуть на него фокус после закрытия.
  let lastModalOpener = null;

  const lockScroll = (lock) => {
    document.body.classList.toggle('modal-open', lock);
  };

  const setFormMessage = (message) => {
    if (!message) return;

    document.querySelectorAll('[data-lead-form] [data-message-field], [data-contact-form] [data-message-field]').forEach((field) => {
      field.value = message;
      field.dispatchEvent(new Event('input', { bubbles: true }));
    });
  };

  const getOrderMessage = (button) => {
    const explicit = button.dataset.orderMessage || button.getAttribute('data-order-message');
    if (explicit) return explicit;

    const card = button.closest('article');
    const title = card?.querySelector('h3, h2')?.textContent?.trim() || 'кухню';
    return `Здравствуйте! Хочу заказать ${title.toLowerCase()}.`;
  };

  const closeAllModals = ({ restoreFocus = true } = {}) => {
    modals.forEach((modal) => {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
    });

    lockScroll(false);

    if (restoreFocus && lastModalOpener && typeof lastModalOpener.focus === 'function') {
      lastModalOpener.focus({ preventScroll: true });
    }

    if (restoreFocus) {
      lastModalOpener = null;
    }
  };

  const openModalById = (id, opener = null) => {
    const modal = document.getElementById(id);
    if (!modal) return;

    // Сначала закрываем все модалки без возврата фокуса,
    // потому что сейчас мы открываем новую модалку.
    closeAllModals({ restoreFocus: false });

    // Запоминаем, кто открыл модалку
    lastModalOpener = opener;

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    lockScroll(true);

    // Фокусируемся на первом доступном элементе внутри модалки
    const focusTarget = modal.querySelector(
      '.modal__close, .btn, a, button, input, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusTarget) {
      focusTarget.focus({ preventScroll: true });
    }
  };

  // Открытие модалки по клику на карточку
  openers.forEach((opener) => {
    opener.addEventListener('click', (e) => {
      // Если клик был по кнопке "Заказать", модалку карточки не открываем
      if (e.target.closest('.js-order')) return;
      // Клик по фото — переход на страницу с крупными фото, а не модалка
      if (e.target.closest('.js-gallery-link')) return;

      e.preventDefault();

      const modalId = opener.dataset.modal || opener.getAttribute('data-modal');
      if (modalId) openModalById(modalId, opener);
    });

    // Поддержка клавиатуры для карточек
    opener.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        // Если фокус на кнопке "Заказать" или на фото, не открываем карточку
        if (
          document.activeElement &&
          document.activeElement.closest('.js-order, .js-gallery-link')
        ) {
          return;
        }

        e.preventDefault();

        const modalId = opener.dataset.modal || opener.getAttribute('data-modal');
        if (modalId) openModalById(modalId, opener);
      }
    });
  });

  // Закрытие по кнопке и по клику на оверлей
  closers.forEach((closer) => {
    closer.addEventListener('click', () => closeAllModals());
  });

  modals.forEach((modal) => {
    modal.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal__overlay')) {
        closeAllModals();
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });

  // =========================================================
  // ORDER BUTTONS
  // =========================================================

  // Кнопки "Заказать" ведут к форме, а не открывают модалку карточки
  document.querySelectorAll('.js-order').forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      setFormMessage(getOrderMessage(button));
      closeMenu();
      closeAllModals();

      const target = document.querySelector('#contacts');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // =========================================================
  // LEAD TO FORM
  // =========================================================

  document.querySelectorAll('.js-lead-to-form').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      const modal = link.closest('.modal');
      const modalTitle = modal?.querySelector('[aria-label]')?.getAttribute('aria-label')?.trim()
        || modal?.querySelector('.eyebrow')?.textContent?.trim()
        || modal?.querySelector('h3')?.textContent?.trim()
        || 'кухню на заказ';
      setFormMessage(`Здравствуйте! Хочу заказать ${modalTitle.toLowerCase()}.`);

      closeAllModals();
      closeMenu();

      const target = document.querySelector('#contacts');
      if (target) {
        setTimeout(() => {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
      }
    });
  });

  // =========================================================
  // SMOOTH SCROLL FOR HASH LINKS
  // =========================================================

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;

      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      closeMenu();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // =========================================================
  // ФОТО КАРТОЧЕК: листаем кадры при наведении
  // =========================================================

  document.querySelectorAll('.js-gallery-link').forEach((box) => {
    const shots = box.querySelectorAll('img');
    if (shots.length < 2) return;

    let current = 0;
    let timer = null;

    const show = (next) => {
      shots[current].classList.remove('is-active');
      current = next;
      shots[current].classList.add('is-active');
    };

    const start = () => {
      if (timer) return;
      // подгружаем остальные кадры при первом наведении
      shots.forEach((img) => {
        if (img.dataset.src) {
          img.src = img.dataset.src;
          delete img.dataset.src;
        }
      });
      timer = setInterval(() => show((current + 1) % shots.length), 1200);
    };

    const stop = () => {
      clearInterval(timer);
      timer = null;
      show(0);
    };

    box.addEventListener('mouseenter', start);
    box.addEventListener('mouseleave', stop);
    box.addEventListener('focus', start);
    box.addEventListener('blur', stop);
  });

  // =========================================================
  // ФОТОГАЛЕРЕЯ СТРАНИЦЫ: миниатюра -> крупный кадр
  // =========================================================

  document.querySelectorAll('[data-photoset]').forEach((set) => {
    const main = set.querySelector('[data-photoset-main]');
    const thumbs = set.querySelectorAll('.photoset__thumb');
    if (!main || !thumbs.length) return;

    thumbs.forEach((thumb, i) => {
      thumb.addEventListener('click', () => {
        main.src = thumb.dataset.src;
        main.alt = `Фото ${i + 1}`;
        thumbs.forEach((t) => t.classList.remove('is-active'));
        thumb.classList.add('is-active');
      });
    });
  });

  // =========================================================
  // RESIZE FIX
  // =========================================================

  window.addEventListener('resize', () => {
    if (window.innerWidth > 720) {
      closeMenu();
    }
  });
});
