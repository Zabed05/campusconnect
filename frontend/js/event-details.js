/**
 * CampusConnect - Event Details Controller
 * Handles event inspection and the 6 UI registration states.
 */

(function () {
  'use strict';

  window.CampusConnect = window.CampusConnect || {};
  const CC = window.CampusConnect;

  const EventDetails = {
    currentEvent: null,
    currentUser: null,

    init: function () {
      if (!CC.DataStore) {
        console.warn('CampusConnect DataStore not available.');
        return;
      }

      this.currentUser = CC.DataStore.getCurrentUser();
      this.resolveEvent();
      this.render();

      CC.on('auth:logout', () => {
        this.currentUser = null;
        this.render();
      });
      CC.on('auth:success', () => {
        this.currentUser = CC.DataStore.getCurrentUser();
        this.render();
      });
      window.addEventListener('pageshow', () => {
        this.currentUser = CC.DataStore.getCurrentUser();
        this.render();
      });

      console.info('CampusConnect Event Details initialized.');
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
    },

    render: function () {
      const e = this.currentEvent;
      if (!e) {
        const main = document.querySelector('.cc-main-content');
        if (main) {
          main.innerHTML = `
            <div class="container" style="padding: var(--space-2xl) 0; text-align: center;">
              <div class="card" style="padding: var(--space-2xl); max-width: 540px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: var(--space-md);">
                <span class="icon icon-2xl text-muted" style="font-size: 48px;">event_busy</span>
                <h2 style="font-size: var(--text-xl); margin: 0;">Event Not Found</h2>
                <p class="text-muted" style="font-size: var(--text-md); margin: 0;">The requested campus event could not be found or has been removed.</p>
                <a href="./events.html" class="btn btn-primary btn-sm" style="margin-top: var(--space-sm);">Return to Event Catalog</a>
              </div>
            </div>
          `;
        }
        return;
      }

      this.currentUser = CC.DataStore.getCurrentUser();
      const userId = this.currentUser ? this.currentUser.id : null;
      const isAuthenticated = !!(this.currentUser && (this.currentUser.id || this.currentUser.email));
      const regCount = CC.DataStore.getEventRegistrationCount(e.id);
      const capacityPercent = Math.min(100, Math.round((regCount / e.max_participants) * 100));
      const regState = CC.DataStore.getEventRegistrationState(e, userId);

      // Hero Elements
      const titleEl = document.getElementById('details-event-title');
      const catEl = document.getElementById('details-event-category');
      const dateEl = document.getElementById('details-event-date');
      const timeEl = document.getElementById('details-event-time');
      const locEl = document.getElementById('details-event-location');
      const orgEl = document.getElementById('details-event-organizer');
      const statusBadgeEl = document.getElementById('details-event-status-badge');

      if (titleEl) titleEl.textContent = e.title;
      if (catEl) catEl.textContent = e.category;
      if (dateEl) dateEl.textContent = CC.DataStore.formatDate(e.start_time);
      if (timeEl) timeEl.textContent = CC.DataStore.formatTimeRange(e.start_time, e.end_time);
      if (locEl) locEl.textContent = e.location;
      if (orgEl) orgEl.textContent = e.created_by;

      if (statusBadgeEl) {
        if (e.status === 'CANCELLED') {
          statusBadgeEl.innerHTML = `<span class="badge badge-danger font-mono">CANCELLED</span>`;
        } else if (e.status === 'COMPLETED') {
          statusBadgeEl.innerHTML = `<span class="badge badge-neutral font-mono">COMPLETED</span>`;
        } else {
          statusBadgeEl.innerHTML = `<span class="badge badge-success font-mono">PUBLISHED</span>`;
        }
      }

      // Main Content
      const descEl = document.getElementById('details-description-text');
      const tableLocEl = document.getElementById('table-event-location');
      const tableDateEl = document.getElementById('table-event-date');
      const tableTimeEl = document.getElementById('table-event-time');
      const tableDeadlineEl = document.getElementById('table-event-deadline');
      const tableCapacityEl = document.getElementById('table-event-capacity');
      const tableOrganizerEl = document.getElementById('table-event-organizer');

      if (descEl) descEl.textContent = e.description;
      if (tableLocEl) tableLocEl.textContent = e.location;
      if (tableDateEl) tableDateEl.textContent = CC.DataStore.formatDate(e.start_time);
      if (tableTimeEl) tableTimeEl.textContent = CC.DataStore.formatTimeRange(e.start_time, e.end_time);
      if (tableDeadlineEl) tableDeadlineEl.textContent = CC.DataStore.formatDateTime(e.registration_deadline);
      if (tableCapacityEl) tableCapacityEl.textContent = `${e.max_participants} Participants`;
      if (tableOrganizerEl) tableOrganizerEl.textContent = e.created_by;

      // Render Registration Action Panel based on the 6 States
      this.renderRegistrationActionPanel(e, regState, regCount, capacityPercent);
    },

    renderRegistrationActionPanel: function (e, regState, regCount, capacityPercent) {
      const panel = document.getElementById('details-reg-action-container');
      if (!panel) return;

      let stateContentHtml = '';

      switch (regState) {
        case 'REGISTRATION_OPEN':
          const isAuthenticated = !!(this.currentUser && (this.currentUser.id || this.currentUser.email));
          const regHref = isAuthenticated ? `./register.html?event=${e.id}` : './login.html';
          stateContentHtml = `
            <div class="cc-state-alert cc-state-alert-success">
              <span class="icon icon-sm">check_circle</span>
              <div>
                <strong>Registration Open</strong>
                <p style="margin-top: 2px;">Seats are currently available for this campus event.</p>
              </div>
            </div>
            <a href="${regHref}" class="btn btn-primary" id="btn-register-event" style="width: 100%; height: 44px;">
              <span>Register for Event</span>
              <span class="icon icon-sm">arrow_forward</span>
            </a>
          `;
          break;

        case 'ALREADY_REGISTERED':
          stateContentHtml = `
            <div class="cc-state-alert cc-state-alert-success">
              <span class="icon icon-sm">check_circle</span>
              <div>
                <strong>Already Registered</strong>
                <p style="margin-top: 2px;">You are currently registered for this event.</p>
              </div>
            </div>
            <div class="flex flex-col gap-xs">
              <a href="./dashboard.html" class="btn btn-primary" style="width: 100%;">
                <span class="icon icon-sm">dashboard</span>
                <span>View in Dashboard</span>
              </a>
              <button type="button" class="btn btn-ghost btn-sm text-danger" id="btn-cancel-reg" style="width: 100%;">
                <span class="icon icon-sm">cancel</span>
                <span>Cancel Registration</span>
              </button>
            </div>
          `;
          break;

        case 'EVENT_FULL':
          stateContentHtml = `
            <div class="cc-state-alert cc-state-alert-warning">
              <span class="icon icon-sm">warning</span>
              <div>
                <strong>Event Full</strong>
                <p style="margin-top: 2px;">All ${e.max_participants} registration spots have been filled.</p>
              </div>
            </div>
            <button type="button" class="btn btn-outline" disabled style="width: 100%; opacity: 0.6; cursor: not-allowed;">
              <span>Registration Full</span>
            </button>
          `;
          break;

        case 'REGISTRATION_CLOSED':
          stateContentHtml = `
            <div class="cc-state-alert cc-state-alert-info">
              <span class="icon icon-sm">info</span>
              <div>
                <strong>Registration Closed</strong>
                <p style="margin-top: 2px;">The deadline (${CC.DataStore.formatDateTime(e.registration_deadline)}) has passed.</p>
              </div>
            </div>
            <button type="button" class="btn btn-outline" disabled style="width: 100%; opacity: 0.6; cursor: not-allowed;">
              <span>Registration Closed</span>
            </button>
          `;
          break;

        case 'EVENT_CANCELLED':
          stateContentHtml = `
            <div class="cc-state-alert cc-state-alert-danger">
              <span class="icon icon-sm">cancel</span>
              <div>
                <strong>Event Cancelled</strong>
                <p style="margin-top: 2px;">This event has been officially cancelled by ${e.created_by}.</p>
              </div>
            </div>
            <button type="button" class="btn btn-outline" disabled style="width: 100%; opacity: 0.6; cursor: not-allowed;">
              <span>Event Cancelled</span>
            </button>
          `;
          break;

        case 'EVENT_COMPLETED':
          stateContentHtml = `
            <div class="cc-state-alert cc-state-alert-info">
              <span class="icon icon-sm">history</span>
              <div>
                <strong>Event Completed</strong>
                <p style="margin-top: 2px;">This event took place on ${CC.DataStore.formatDate(e.start_time)} and is completed.</p>
              </div>
            </div>
            <button type="button" class="btn btn-outline" disabled style="width: 100%; opacity: 0.6; cursor: not-allowed;">
              <span>Event Completed</span>
            </button>
          `;
          break;
      }

      panel.innerHTML = `
        <div class="cc-reg-capacity-box">
          <div class="flex items-center justify-between text-xs" style="margin-bottom: 4px;">
            <span class="text-muted font-weight-semibold">Participant Capacity</span>
            <span class="font-mono text-primary font-weight-bold">${regCount} / ${e.max_participants}</span>
          </div>
          <div style="height: 8px; background-color: var(--color-border); border-radius: var(--radius-full); overflow: hidden;">
            <div style="width: ${capacityPercent}%; height: 100%; background-color: ${capacityPercent >= 100 ? 'var(--color-danger)' : 'var(--color-secondary)'}; border-radius: var(--radius-full);"></div>
          </div>
          <span class="text-xs text-muted block" style="margin-top: 4px;">
            Deadline: ${CC.DataStore.formatDate(e.registration_deadline)}
          </span>
        </div>

        ${stateContentHtml}
      `;

      // Bind cancel registration button if present
      const cancelBtn = document.getElementById('btn-cancel-reg');
      if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
          if (confirm(`Are you sure you want to cancel your registration for "${e.title}"?`)) {
            const userId = this.currentUser ? this.currentUser.id : 'usr-student-1';
            CC.DataStore.cancelRegistration(userId, e.id);
            alert('Your registration has been cancelled.');
            this.render();
          }
        });
      }

      // Bind register event button guard if clicked while unauthenticated
      const regBtn = document.getElementById('btn-register-event');
      if (regBtn) {
        regBtn.addEventListener('click', (ev) => {
          if (!CC.DataStore.isAuthenticated()) {
            ev.preventDefault();
            window.location.href = './login.html';
          }
        });
      }
    },
  };

  CC.EventDetails = EventDetails;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => EventDetails.init());
  } else {
    EventDetails.init();
  }
})();
