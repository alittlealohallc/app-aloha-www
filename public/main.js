(function () {
  'use strict';

  // ---- Mobile nav toggle ----
  var toggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('primary-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close menu after a nav link is chosen (mobile)
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---- Formspree AJAX init (see reference/forms.md, Pattern C) ----
  window.formspree = window.formspree || function () {
    (formspree.q = formspree.q || []).push(arguments);
  };
  formspree('initForm', { formElement: '#contact-form', formId: 'xyegjpzq' });
})();
