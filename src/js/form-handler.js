document.addEventListener('DOMContentLoaded', function () {
  const orderForm = document.querySelector('.your-order-form');
  const submitBtn = document.querySelector('.your-order-btn');

  if (!orderForm || !submitBtn) {
    return;
  }

  function showNotification(title, message, type = 'success') {
    if (typeof iziToast !== 'undefined') {
      if (type === 'success') {
        iziToast.success({
          title: title,
          message: message,
          position: 'topRight',
          timeout: 5000,
        });
      } else {
        iziToast.error({
          title: title,
          message: message,
          position: 'topRight',
          timeout: 5000,
        });
      }
    } else {
      alert(`${title}: ${message}`);
    }
  }

  function validateForm(formData) {
    const errors = [];

    const fullName = formData.get('Full name');
    if (!fullName || fullName.trim().length === 0) {
      errors.push("Введіть ваше повне ім'я");
    } else if (fullName.trim().length < 2) {
      errors.push("Ім'я повинно містити мінімум 2 символи");
    }

    const email = formData.get('Email');
    const emailRegex = /^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,8}$/;
    if (!email || email.trim().length === 0) {
      errors.push('Введіть ваш email');
    } else if (!emailRegex.test(email.trim())) {
      errors.push('Введіть коректний email адрес');
    }

    return errors;
  }

  function toggleSubmitButton(disabled = false) {
    submitBtn.disabled = disabled;
    if (disabled) {
      submitBtn.textContent = 'Відправляємо...';
    } else {
      submitBtn.textContent = 'Send';
    }
  }

  orderForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(orderForm);

    const errors = validateForm(formData);

    if (errors.length > 0) {
      showNotification('Помилка', errors.join(', '), 'error');
      return;
    }

    toggleSubmitButton(true);

    setTimeout(() => {
      showNotification(
        'Успіх!',
        'Дякуємо! Ваше замовлення прийнято.',
        'success'
      );
      orderForm.reset();
      toggleSubmitButton(false);
    }, 1500);
  });
});
