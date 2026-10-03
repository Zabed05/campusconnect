/**
 * CampusConnect - Student Dashboard Controller
 * Displays user registrations, status, and announcements.
 */

(function () {
  'use strict';

  window.CampusConnect = window.CampusConnect || {};
  const CC = window.CampusConnect;

  const DashboardPage = {
    currentUser: null,
    userRegistrations: [],

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

      this.loadUserRegistrations();
      this.renderUserHero();
      this.renderRegistrationsList();
      this.renderAnnouncements();

      // Guard against browser Back button bfcache displaying stale authenticated state
      window.addEventListener('pageshow', (event) => {
        if (!CC.DataStore.getCurrentUser()) {
          window.location.replace('./login.html');
        }
      });

      console.info('CampusConnect Student Dashboard initialized.');
    },

    loadUserRegistrations: function () {
      if (!this.currentUser) return;
      this.userRegistrations = CC.DataStore.getUserRegistrations(this.currentUser.id);
    },

    renderUserHero: function () {
      const u = this.currentUser;
      const greetingEl = document.getElementById('student-greeting-name');
      const deptEl = document.getElementById('student-dept-text');
      const emailEl = document.getElementById('student-email-text');
      const countEl = document.getElementById('metric-active-passes');

      if (greetingEl) greetingEl.textContent = `Welcome back, ${u.name}!`;
      if (deptEl) deptEl.textContent = `${u.role} • ${u.department || 'University Student'}`;
      if (emailEl) emailEl.textContent = u.email;
      if (countEl) countEl.textContent = this.userRegistrations.length;
    },

    renderRegistrationsList: function () {
      const container = document.getElementById('student-passes-container');
      if (!container) return;

      if (this.userRegistrations.length === 0) {
        container.innerHTML = `
          <div class="card" style="text-align: center; padding: var(--space-2xl);">
            <span class="icon icon-lg text-muted" style="font-size: 40px; margin-bottom: var(--space-xs);">event_available</span>
            <h4 class="text-md text-primary">No active event registrations</h4>
            <p class="text-xs text-muted" style="margin-bottom: var(--space-md);">Browse the campus event catalog and register for upcoming sessions.</p>
            <a href="./events.html" class="btn btn-primary btn-sm">
              <span>Explore Event Catalog</span>
              <span class="icon icon-sm">arrow_forward</span>
            </a>
          </div>
        `;
        return;
      }

      container.innerHTML = this.userRegistrations
        .map((reg) => {
          const event = CC.DataStore.getEventById(reg.event_id);
          if (!event) return '';

          const startDate = CC.DataStore.formatDate(event.start_time);
          const timeRange = CC.DataStore.formatTimeRange(event.start_time, event.end_time);

          return `
            <div class="card cc-pass-card" id="reg-card-${reg.id}">
              <div class="flex items-center justify-between gap-xs" style="margin-bottom: var(--space-xs);">
                <div class="flex items-center gap-xs">
                  <span class="badge badge-primary font-mono">${event.category}</span>
                  <span class="badge badge-success font-mono">${reg.registration_status}</span>
                </div>
                <span class="text-xs text-muted font-mono">Reg ID: ${reg.id}</span>
              </div>

              <h4 class="text-base text-primary font-weight-bold" style="margin-bottom: 4px;">
                <a href="./event-details.html?event=${event.id}" class="hover:underline text-primary">
                  ${event.title}
                </a>
              </h4>

              <div class="flex flex-col gap-2xs text-xs text-muted" style="margin-bottom: var(--space-sm);">
                <div class="flex items-center gap-xs">
                  <span class="icon icon-sm">calendar_month</span>
                  <span class="font-mono">${startDate} (${timeRange})</span>
                </div>
                <div class="flex items-center gap-xs">
                  <span class="icon icon-sm">location_on</span>
                  <span>${event.location}</span>
                </div>
                <div class="flex items-center gap-xs">
                  <span class="icon icon-sm">how_to_reg</span>
                  <span>Attendance Status: <strong class="text-secondary">${reg.attendance_status}</strong></span>
                </div>
              </div>

              <div class="flex items-center justify-between gap-xs flex-wrap" style="padding-top: var(--space-xs); border-top: 1px solid var(--color-surface-subtle);">
                <a href="./event-details.html?event=${event.id}" class="btn btn-outline btn-sm">
                  <span>View Details</span>
                  <span class="icon icon-sm">arrow_forward</span>
                </a>
                <button type="button" class="btn btn-ghost btn-sm text-danger" onclick="window.CampusConnect.Dashboard.cancelEventRegistration('${event.id}', '${event.title}')">
                  <span class="icon icon-sm">cancel</span>
                  <span>Cancel Registration</span>
                </button>
              </div>
            </div>
          `;
        })
        .join('');
    },

    cancelEventRegistration: function (eventId, eventTitle) {
      if (confirm(`Are you sure you want to cancel your registration for "${eventTitle}"?`)) {
        const userId = this.currentUser ? this.currentUser.id : 'usr-student-1';
        CC.DataStore.cancelRegistration(userId, eventId);
        this.loadUserRegistrations();
        this.renderUserHero();
        this.renderRegistrationsList();
        alert('Your registration has been successfully cancelled.');
      }
    },

    renderAnnouncements: function () {
      const container = document.getElementById('dashboard-announcements-feed');
      if (!container) return;

      const list = CC.DataStore.getAnnouncements();
      container.innerHTML = list
        .map(
          (ann) => `
          <div class="card" style="padding: var(--space-md); margin-bottom: var(--space-sm);">
            <div class="flex items-center justify-between gap-xs" style="margin-bottom: 2px;">
              <span class="text-xs text-secondary font-weight-semibold">${ann.created_by}</span>
              <span class="text-xs text-muted font-mono">${CC.DataStore.formatDate(ann.created_at)}</span>
            </div>
            <h4 class="text-sm text-primary font-weight-bold" style="margin-bottom: 4px;">${ann.title}</h4>
            <p class="text-xs text-muted" style="line-height: 1.5;">${ann.content}</p>
          </div>
        `
        )
        .join('');
    },
  };

  CC.Dashboard = DashboardPage;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => DashboardPage.init());
  } else {
    DashboardPage.init();
  }
})();
