/**
 * CampusConnect - Login Controller
 * Clean Vanilla JS authentication UI with demo role selector.
 */

(function () {
  'use strict';

  window.CampusConnect = window.CampusConnect || {};
  const CC = window.CampusConnect;

  let currentRole = 'STUDENT';

  const LoginPage = {
    init: function () {
      this.bindRoleTabs();
      this.bindPasswordToggle();
      this.bindDemoQuickFill();
      this.bindFormSubmit();
      this.checkExistingSession();

      window.addEventListener('pageshow', () => {
        this.checkExistingSession();
      });

      console.info('CampusConnect Login Controller initialized.');
    },

    bindRoleTabs: function () {
      const tabs = document.querySelectorAll('.cc-role-tab');
      const emailInput = document.getElementById('login-email-input');
      const passInput = document.getElementById('login-password-input');
      const labelText = document.getElementById('login-identifier-label');

      tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
          tabs.forEach((t) => {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
          });
          tab.classList.add('active');
          tab.setAttribute('aria-selected', 'true');

          const roleKey = tab.getAttribute('data-role').toUpperCase();
          currentRole = roleKey;

          // Fill demo credentials
          const demoUser = CC.MockData.users.find((u) => u.role === roleKey);
          if (demoUser && emailInput && passInput) {
            emailInput.value = demoUser.email;
            passInput.value = 'password123';
          }

          if (labelText) {
            if (roleKey === 'STUDENT') {
              labelText.textContent = 'Student University Email / Campus ID';
            } else if (roleKey === 'FACULTY') {
              labelText.textContent = 'Faculty / Staff University Email';
            } else if (roleKey === 'ADMIN') {
              labelText.textContent = 'Administrator University Email';
            }
          }

          this.clearErrors();
        });
      });
    },

    bindPasswordToggle: function () {
      const toggleBtn = document.getElementById('toggle-password-visibility');
      const passInput = document.getElementById('login-password-input');
      if (!toggleBtn || !passInput) return;

      toggleBtn.addEventListener('click', () => {
        const isPassword = passInput.type === 'password';
        passInput.type = isPassword ? 'text' : 'password';
        const icon = toggleBtn.querySelector('.icon');
        if (icon) {
          icon.textContent = isPassword ? 'visibility_off' : 'visibility';
        }
      });
    },

    bindDemoQuickFill: function () {
      const quickBtns = document.querySelectorAll('.cc-demo-chip-btn');
      quickBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          const role = (btn.getAttribute('data-fill-role') || 'student').toLowerCase();
          const targetTab = document.querySelector(`.cc-role-tab[data-role="${role}"]`);
          if (targetTab) {
            targetTab.click();
          }
        });
      });
    },

    bindFormSubmit: function () {
      const form = document.getElementById('login-form');
      const emailInput = document.getElementById('login-email-input');
      const passInput = document.getElementById('login-password-input');
      const submitBtn = document.getElementById('login-submit-btn');

      if (!form) return;

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.clearErrors();

        const email = emailInput ? emailInput.value.trim() : '';
        const password = passInput ? passInput.value.trim() : '';

        let hasError = false;

        if (!email) {
          this.showError('email-error', 'Please enter your university email or ID.');
          hasError = true;
        }

        if (!password) {
          this.showError('password-error', 'Please enter your password.');
          hasError = true;
        } else if (password.length < 6) {
          this.showError('password-error', 'Password must be at least 6 characters.');
          hasError = true;
        }

        if (hasError) return;

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = `
            <span class="icon icon-sm" style="animation: spin 0.8s linear infinite;">sync</span>
            <span>Signing in...</span>
          `;
        }

        setTimeout(() => {
          this.completeLogin(email);
        }, 400);
      });
    },

    completeLogin: function (identifier) {
      // Find matching mock user or build user session
      let matchedUser = CC.MockData.users.find(
        (u) => u.email.toLowerCase() === identifier.toLowerCase() || (u.campusId && u.campusId.toLowerCase() === identifier.toLowerCase())
      );

      if (!matchedUser) {
        matchedUser = {
          id: 'usr-' + Math.floor(1000 + Math.random() * 9000),
          name: identifier.split('@')[0].replace('.', ' ').toUpperCase(),
          email: identifier,
          role: currentRole,
          department: 'Academic Studies',
          campusId: 'ID-' + Math.floor(1000 + Math.random() * 9000),
        };
      }

      CC.DataStore.setCurrentUser(matchedUser);
      CC.emit('auth:success', { user: matchedUser });

      window.location.href = './dashboard.html';
    },

    showError: function (elementId, message) {
      const errorEl = document.getElementById(elementId);
      if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.add('visible');
      }
    },

    clearErrors: function () {
      const errors = document.querySelectorAll('.cc-form-error-msg');
      errors.forEach((err) => {
        err.textContent = '';
        err.classList.remove('visible');
      });
    },

    checkExistingSession: function () {
      const user = CC.DataStore ? CC.DataStore.getCurrentUser() : null;
      const banner = document.getElementById('login-feedback-banner');
      if (user && user.name && banner) {
        banner.innerHTML = `
          <div class="card" style="background-color: var(--color-primary-container); border-color: #bfdbfe; margin-bottom: var(--space-md);">
            <div class="flex items-center justify-between flex-wrap gap-xs">
              <div class="flex items-center gap-xs">
                <span class="icon icon-sm text-primary">account_circle</span>
                <span class="text-xs text-primary font-weight-semibold">Active Session: ${user.name} (${user.role})</span>
              </div>
              <a href="./dashboard.html" class="btn btn-primary btn-sm">
                <span>Go to Dashboard</span>
                <span class="icon icon-sm">arrow_forward</span>
              </a>
            </div>
          </div>
        `;
      } else if (banner) {
        banner.innerHTML = '';
      }
    },
  };

  CC.Login = LoginPage;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => LoginPage.init());
  } else {
    LoginPage.init();
  }
})();
