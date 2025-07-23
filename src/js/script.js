(() => {
  // добавили доп класс на контейнер менюшки
  const mobileMenu = document.querySelector('.js-menu-container');
  // добавили доп класс на кнопку открывать менюшку
  const openMenuBtn = document.querySelector('.js-open-menu');
  // добавили доп класс на кнопку закрывать менюшку
  const closeMenuBtn = document.querySelector('.js-close-menu');
  // добавили доп класс что бы закрыть после нажатия на ссылку
  const menuLinks = document.querySelectorAll('.mobile-modal-link');

  const toggleMenu = () => {
    const isMenuOpen =
      openMenuBtn.getAttribute('aria-expanded') === 'true' || false;

    openMenuBtn.setAttribute('aria-expanded', !isMenuOpen);
    mobileMenu.classList.toggle('is-open');

    // Блокування/розблокування прокрутки
    if (!isMenuOpen) {
      // Меню відкривається - блокуємо прокрутку
      document.body.classList.add('menu-open');
      document.documentElement.classList.add('menu-open');
    } else {
      // Меню закривається - дозволяємо прокрутку
      document.body.classList.remove('menu-open');
      document.documentElement.classList.remove('menu-open');
    }

    // Якщо ви використовуєте bodyScrollLock бібліотеку, залиште цей код
    const scrollLockMethod = !isMenuOpen
      ? 'disableBodyScroll'
      : 'enableBodyScroll';

    // Перевіряємо чи існує bodyScrollLock
    if (typeof bodyScrollLock !== 'undefined') {
      bodyScrollLock[scrollLockMethod](document.body);
    }
  };

  // добавили что бы закрывалось при нажатии на ссылку
  menuLinks.forEach(menuLink => {
    menuLink.addEventListener('click', toggleMenu);
  });

  // стандартно из скрипта от Репеты
  openMenuBtn.addEventListener('click', toggleMenu);
  closeMenuBtn.addEventListener('click', toggleMenu);

  // Close the mobile menu on wider screens if the device orientation changes
  window.matchMedia('(min-width: 768px)').addEventListener('change', e => {
    if (!e.matches) return;
    mobileMenu.classList.remove('is-open');
    openMenuBtn.setAttribute('aria-expanded', false);

    // Розблокувати прокрутку при зміні розміру екрану
    document.body.classList.remove('menu-open');
    document.documentElement.classList.remove('menu-open');

    if (typeof bodyScrollLock !== 'undefined') {
      bodyScrollLock.enableBodyScroll(document.body);
    }
  });
})();
