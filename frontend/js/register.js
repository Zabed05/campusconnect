/**
 * CampusConnect - Event Registration Controller
 * Handles simple event registration submission and confirmation.
 */

(function () {
  'use strict';

  window.CampusConnect = window.CampusConnect || {};
  const CC = window.CampusConnect;

  const RegistrationPage = {
    currentEvent: null,
    currentUser: null,

    init: function () {
      if (!CC.DataStore) {
        console.warn('CampusConnect DataStore not available.');
        return;
      }

      this.currentUser = CC.DataStore.getCurrentUser();
      if (!this.currentUser) {
        window.location.replace('./login.html');
        return;
      }

      this.resolveEvent();
      this.populateForm();
      this.bindForm();

      // Guard against browser Back button bfcache displaying stale state
      window.addEventListener('pageshow', () => {
        if (!CC.DataStore.getCurrentUser()) {
          window.location.replace('./login.html');
        }
      });

      console.info('CampusConnect Event Registration initialized.');
    },

    resolveEvent: function () {
      const urlParams = new URLSearchParams(window.location.search);
      const eventId = urlParams.get('event') || 'evt-101';

      this.currentEvent = CC.DataStore.getEventById(eventId);
      if (!this.currentEvent) {
        const events = CC.DataStore.getEvents();
        if (events && events.length > 0) {
          this.currentEvent = events[0];
        }
      }

      this.renderEventHeader();
    },

    renderEventHeader: function () {
      const e = this.currentEvent;
      if (!e) {
        const titleEl = document.getElementById('reg-event-title');
        if (titleEl) titleEl.textContent = 'Event Not Found';
        const form = document.getElementById('event-registration-form');
        if (form) form.innerHTML = '<p class="text-muted">The requested campus event could not be found. <a href="./events.html" class="btn btn-primary btn-sm" style="margin-top: 12px; display: inline-block;">Return to Event Catalog</a></p>';
        return;
      }

      const titleEl = document.getElementById('reg-event-title');
      const catEl = document.getElementById('reg-event-category');
      const dateEl = document.getElementById('reg-event-date');
      const locEl = document.getElementById('reg-event-location');
      const capEl = document.getElementById('reg-event-capacity');

      if (titleEl) titleEl.textContent = e.title;
      if (catEl) catEl.textContent = e.category;
      if (dateEl) dateEl.textContent = `${CC.DataStore.formatDate(e.start_time)} (${CC.DataStore.formatTimeRange(e.start_time, e.end_time)})`;
      if (locEl) locEl.textContent = e.location;

      const regCount = CC.DataStore.getEventRegistrationCount(e.id);
      const remaining = Math.max(0, e.max_participants - regCount);
      if (capEl) capEl.textContent = `${remaining} spots remaining of ${e.max_participants}`;
    },

    populateForm: function () {
      const u = this.currentUser;
      if (!u) return;

      const nameInput = document.getElementById('reg-name-input');
      const emailInput = document.getElementById('reg-email-input');
      const idInput = document.getElementById('reg-id-input');

      if (nameInput && !nameInput.value) nameInput.value = u.name || '';
      if (emailInput && !emailInput.value) emailInput.value = u.email || '';
      if (idInput && !idInput.value) idInput.value = u.campusId || 'STU-9402';
    },

    bindForm: function () {
      const form = document.getElementById('event-registration-form');
      const submitBtn = document.getElementById('btn-submit-registration');

      if (!form) return;

      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('reg-name-input');
        const emailInput = document.getElementById('reg-email-input');
        const idInput = document.getElementById('reg-id-input');

        const name = nameInput ? nameInput.value.trim() : '';
        const email = emailInput ? emailInput.value.trim() : '';
        const campusId = idInput ? idInput.value.trim() : '';

        if (!name || !email || !campusId) {
          alert('Please fill in your name, university email, and student ID.');
          return;
        }

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = `
            <span class="icon icon-sm" style="animation: spin 0.8s linear infinite;">sync</span>
            <span>Submitting Registration...</span>
          `;
        }

        setTimeout(() => {
          this.executeRegistration(name, email, campusId);
        }, 400);
      });
    },

    executeRegistration: function (name, email, campusId) {
      const e = this.currentEvent;
      if (!this.currentUser) {
        window.location.replace('./login.html');
        return;
      }
      const userId = this.currentUser.id;

      CC.DataStore.registerForEvent(userId, e.id);

      // Hide form card, show confirmation view
      const formCard = document.getElementById('registration-form-card');
      const confirmView = document.getElementById('registration-success-view');

      if (formCard) formCard.style.display = 'none';

      // Fill confirmation view
      const cTitle = document.getElementById('confirm-event-title');
      const cAttendee = document.getElementById('confirm-attendee-name');
      const cEmail = document.getElementById('confirm-attendee-email');
      const cDate = document.getElementById('confirm-event-date');
      const cLoc = document.getElementById('confirm-event-location');

      if (cTitle) cTitle.textContent = e.title;
      if (cAttendee) cAttendee.textContent = name;
      if (cEmail) cEmail.textContent = email;
      if (cDate) cDate.textContent = `${CC.DataStore.formatDate(e.start_time)} (${CC.DataStore.formatTimeRange(e.start_time, e.end_time)})`;
      if (cLoc) cLoc.textContent = e.location;

      if (confirmView) {
        confirmView.classList.add('active');
        confirmView.scrollIntoView({ behavior: 'smooth' });
      }
    },
  };

  CC.Registration = RegistrationPage;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => RegistrationPage.init());
  } else {
    RegistrationPage.init();
  }
})();
