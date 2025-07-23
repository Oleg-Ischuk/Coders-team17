document.addEventListener('DOMContentLoaded', function () {
  const reviewsContainer = document.querySelector('.reviews-list-container');

  if (!reviewsContainer) return;

  let currentIndex = 0;
  const reviewItems = document.querySelectorAll('.reviews-list-item');
  const totalItems = reviewItems.length;
  let isAnimating = false;

  // Створюємо контейнер для навігації
  const navigationContainer = document.createElement('div');
  navigationContainer.className = 'reviews-navigation';

  // Створюємо кнопки навігації
  const prevBtn = document.createElement('button');
  prevBtn.className = 'reviews-nav-btn prev';
  prevBtn.setAttribute('aria-label', 'Previous review');

  const nextBtn = document.createElement('button');
  nextBtn.className = 'reviews-nav-btn next';
  nextBtn.setAttribute('aria-label', 'Next review');

  // Додаємо кнопки до контейнера навігації
  navigationContainer.appendChild(prevBtn);
  navigationContainer.appendChild(nextBtn);

  // Додаємо контейнер навігації до основного контейнера
  reviewsContainer.appendChild(navigationContainer);

  // Функція для плавної анімації з'явлення/зникнення
  function animateCard(card, show, delay = 0) {
    return new Promise(resolve => {
      setTimeout(() => {
        if (show) {
          card.style.display = 'block';
          card.style.opacity = '0';
          card.style.transform = 'translateY(30px) scale(0.9)';

          requestAnimationFrame(() => {
            card.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          });

          setTimeout(resolve, 500);
        } else {
          card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
          card.style.opacity = '0';
          card.style.transform = 'translateY(-20px) scale(0.95)';

          setTimeout(() => {
            card.style.display = 'none';
            resolve();
          }, 300);
        }
      }, delay);
    });
  }

  // Функція для показу/приховування навігації
  function toggleNavigation() {
    const screenWidth = window.innerWidth;

    if (screenWidth >= 1280) {
      navigationContainer.style.display = 'none';
    } else {
      navigationContainer.style.display = 'flex';
    }
  }

  // Функція для показу відгуків з анімацією
  async function showReviews(direction = 'next') {
    if (isAnimating) return;
    isAnimating = true;

    const screenWidth = window.innerWidth;

    if (screenWidth >= 1280) {
      // Десктоп - показуємо всі 3 без анімації
      reviewItems.forEach(item => {
        item.style.display = 'block';
        item.style.opacity = '1';
        item.style.transform = 'translateY(0) scale(1)';
      });
      isAnimating = false;
      return;
    }

    // Спочатку приховуємо всі видимі картки
    const visibleCards = Array.from(reviewItems).filter(
      item => item.style.display !== 'none' && item.style.opacity !== '0'
    );

    // Анімація зникнення
    const hidePromises = visibleCards.map((card, index) =>
      animateCard(card, false, index * 50)
    );

    await Promise.all(hidePromises);

    // Визначаємо які картки показувати
    let cardsToShow = [];

    if (screenWidth >= 768) {
      // Планшет - показуємо 2
      for (let i = currentIndex; i < currentIndex + 2 && i < totalItems; i++) {
        cardsToShow.push(reviewItems[i]);
      }
      // Якщо не вистачає карток, додаємо з початку
      if (cardsToShow.length < 2 && totalItems > 1) {
        const remaining = 2 - cardsToShow.length;
        for (let i = 0; i < remaining; i++) {
          if (reviewItems[i] && !cardsToShow.includes(reviewItems[i])) {
            cardsToShow.push(reviewItems[i]);
          }
        }
      }
    } else {
      // Мобільний - показуємо 1
      cardsToShow = [reviewItems[currentIndex]];
    }

    // Анімація появи нових карток
    const showPromises = cardsToShow.map((card, index) =>
      animateCard(card, true, index * 100)
    );

    await Promise.all(showPromises);
    isAnimating = false;
  }

  // Функція для переходу до наступного відгуку
  async function nextReview() {
    if (isAnimating) return;

    const step = 1;
    currentIndex = (currentIndex + step) % totalItems;
    await showReviews('next');

    // Додаємо ефект "bounce" для кнопки
    nextBtn.style.transform = 'scale(0.9)';
    setTimeout(() => {
      nextBtn.style.transform = 'scale(1)';
    }, 150);
  }

  // Функція для переходу до попереднього відгуку
  async function prevReview() {
    if (isAnimating) return;

    const step = 1;
    currentIndex = (currentIndex - step + totalItems) % totalItems;
    await showReviews('prev');

    // Додаємо ефект "bounce" для кнопки
    prevBtn.style.transform = 'scale(0.9)';
    setTimeout(() => {
      prevBtn.style.transform = 'scale(1)';
    }, 150);
  }

  // Обробники подій
  nextBtn.addEventListener('click', nextReview);
  prevBtn.addEventListener('click', prevReview);

  // Початковий показ без анімації
  function initialShow() {
    const screenWidth = window.innerWidth;

    toggleNavigation();

    if (screenWidth >= 1280) {
      reviewItems.forEach(item => {
        item.style.display = 'block';
        item.style.opacity = '1';
        item.style.transform = 'translateY(0) scale(1)';
      });
    } else {
      reviewItems.forEach(item => {
        item.style.display = 'none';
        item.style.opacity = '0';
      });

      if (screenWidth >= 768) {
        // Планшет - показуємо перші 2
        reviewItems[0].style.display = 'block';
        reviewItems[0].style.opacity = '1';
        reviewItems[0].style.transform = 'translateY(0) scale(1)';
        if (reviewItems[1]) {
          reviewItems[1].style.display = 'block';
          reviewItems[1].style.opacity = '1';
          reviewItems[1].style.transform = 'translateY(0) scale(1)';
        }
      } else {
        // Мобільний - показуємо першу
        reviewItems[0].style.display = 'block';
        reviewItems[0].style.opacity = '1';
        reviewItems[0].style.transform = 'translateY(0) scale(1)';
      }
    }
  }

  initialShow();

  // Обробка зміни розміру екрану
  let resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      currentIndex = 0;
      isAnimating = false;
      initialShow();
    }, 250);
  });

  // Додаємо підтримку свайпів для мобільних пристроїв
  let startX = 0;
  let endX = 0;
  let startY = 0;
  let endY = 0;

  reviewsContainer.addEventListener('touchstart', function (e) {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  });

  reviewsContainer.addEventListener('touchend', function (e) {
    endX = e.changedTouches[0].clientX;
    endY = e.changedTouches[0].clientY;
    handleSwipe();
  });

  function handleSwipe() {
    const swipeThreshold = 50;
    const diffX = startX - endX;
    const diffY = Math.abs(startY - endY);

    // Перевіряємо що це горизонтальний свайп, а не вертикальний
    if (Math.abs(diffX) > swipeThreshold && diffY < 100) {
      if (diffX > 0) {
        // Свайп вліво - наступний
        nextReview();
      } else {
        // Свайп вправо - попередній
        prevReview();
      }
    }
  }
});
