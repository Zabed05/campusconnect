/**
 * CampusConnect - Landing Page Controller
 * Displays hero search, featured campus events, and announcements.
 */

(function () {
  'use strict';

  window.CampusConnect = window.CampusConnect || {};
  const CC = window.CampusConnect;

  const LandingPage = {
    init: function () {
      if (!CC.DataStore) {
        console.warn('CampusConnect DataStore not available.');
        return;
      }

      this.renderSearchCategories();
      this.renderFeaturedEvents();
      this.renderAnnouncementTicker();
      this.bindSearchForm();
      this.updateAuthStatus();

      CC.on('layout:role-changed', () => {
        this.updateAuthStatus();
        this.renderFeaturedEvents();
      });
      CC.on('auth:logout', () => {
        this.updateAuthStatus();
        this.renderFeaturedEvents();
      });
      CC.on('auth:success', () => {
        this.updateAuthStatus();
        this.renderFeaturedEvents();
      });
      window.addEventListener('pageshow', () => {
        this.updateAuthStatus();
        this.renderFeaturedEvents();
      });

      console.info('CampusConnect Landing Page initialized.');
    },

    updateAuthStatus: function () {
      const user = CC.DataStore.getCurrentUser();
      const isAuthenticated = !!(user && user.role);

      const heroLoginBtn = document.getElementById('hero-btn-login');
      const ctaLoginBtn = document.getElementById('cta-btn-login');
      const ctaHeading = document.getElementById('cta-banner-heading');
      const ctaDesc = document.getElementById('cta-banner-desc');

      if (isAuthenticated) {
        if (heroLoginBtn) {
          heroLoginBtn.href = './pages/dashboard.html';
          heroLoginBtn.innerHTML = `
            <span class="icon icon-md">dashboard</span>
            <span>Go to Student Portal</span>
          `;
        }

        if (ctaLoginBtn) {
          ctaLoginBtn.href = './pages/dashboard.html';
          ctaLoginBtn.innerHTML = `
            <span>Go to Student Dashboard</span>
            <span class="icon icon-sm">arrow_forward</span>
          `;
        }

        if (ctaHeading) {
          ctaHeading.textContent = `Welcome Back, ${user.name}!`;
        }

        if (ctaDesc) {
          ctaDesc.textContent = `Access your event registrations, view university announcements, and explore new campus events.`;
        }
      } else {
        if (heroLoginBtn) {
          heroLoginBtn.href = './pages/login.html';
          heroLoginBtn.innerHTML = `
            <span class="icon icon-md">login</span>
            <span>Student Portal Sign In</span>
          `;
        }

        if (ctaLoginBtn) {
          ctaLoginBtn.href = './pages/login.html';
          ctaLoginBtn.innerHTML = `
            <span>Student Portal Login</span>
            <span class="icon icon-sm">login</span>
          `;
        }

        if (ctaHeading) {
          ctaHeading.textContent = 'Ready to Experience CampusConnect?';
        }

        if (ctaDesc) {
          ctaDesc.textContent = 'Sign in with your university credentials or explore upcoming events across all campus departments.';
        }
      }
    },

    renderSearchCategories: function () {
      const select = document.getElementById('hero-category-select');
      if (!select) return;

      const categories = CC.DataStore.getCategories();
      select.innerHTML = categories
        .map((cat) => `<option value="${cat.id}">${cat.name}</option>`)
        .join('');
    },

    renderFeaturedEvents: function (filteredEvents = null) {
      const container = document.getElementById('featured-events-grid');
      if (!container) return;

      const events = filteredEvents || CC.DataStore.getEvents().slice(0, 3);
      const user = CC.DataStore.getCurrentUser();
      const userId = user ? user.id : null;
      const isAuthenticated = !!(user && (user.id || user.email));

      if (events.length === 0) {
        container.innerHTML = `
          <div class="card" style="grid-column: 1 / -1; text-align: center; padding: var(--space-2xl);">
            <span class="icon icon-lg text-muted" style="font-size: 40px; margin-bottom: var(--space-xs);">event_busy</span>
            <h4 class="text-md text-primary">No events found matching your criteria</h4>
            <p class="text-xs text-muted">Try adjusting your keyword search or category filter.</p>
          </div>
        `;
        return;
      }

      container.innerHTML = events
        .map((event) => {
          const startDate = CC.DataStore.formatDate(event.start_time);
          const timeRange = CC.DataStore.formatTimeRange(event.start_time, event.end_time);
          const regCount = CC.DataStore.getEventRegistrationCount(event.id);
          const capacityPercent = Math.min(100, Math.round((regCount / event.max_participants) * 100));
          const regState = CC.DataStore.getEventRegistrationState(event, userId);

          let statusBadge = '';
          if (event.status === 'CANCELLED') {
            statusBadge = `<span class="badge badge-danger">Cancelled</span>`;
          } else if (event.status === 'COMPLETED') {
            statusBadge = `<span class="badge badge-neutral">Completed</span>`;
          } else if (regState === 'ALREADY_REGISTERED') {
            statusBadge = `<span class="badge badge-success">Registered</span>`;
          } else if (regState === 'EVENT_FULL') {
            statusBadge = `<span class="badge badge-warning">Event Full</span>`;
          } else if (regState === 'REGISTRATION_CLOSED') {
            statusBadge = `<span class="badge badge-neutral">Closed</span>`;
          } else {
            statusBadge = `<span class="badge badge-primary">Open</span>`;
          }

          const regLinkAttr = isAuthenticated
            ? `href="./pages/register.html?event=${event.id}"`
            : `href="./pages/login.html"`;

          return `
            <article class="cc-event-card" id="${event.id}">
              <div class="cc-event-card-banner" style="background: linear-gradient(135deg, var(--color-primary), #2563eb);">
                <span class="badge badge-neutral font-mono" style="background: rgba(255,255,255,0.92); color: var(--color-primary); font-weight: 700;">
                  ${event.category}
                </span>
                ${statusBadge}
              </div>

              <div class="cc-event-card-body">
                <div class="flex items-center gap-xs" style="margin-bottom: 4px;">
                  <span class="icon icon-sm text-accent">business</span>
                  <span class="text-sm text-muted" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    ${event.created_by}
                  </span>
                </div>

                <h3 class="cc-event-card-title" title="${event.title}">
                  <a href="./pages/event-details.html?event=${event.id}" class="hover:underline text-primary">
                    ${event.title}
                  </a>
                </h3>

                <div class="cc-event-meta-row">
                  <span class="icon icon-sm">calendar_month</span>
                  <span class="font-mono">${startDate}</span>
                </div>

                <div class="cc-event-meta-row">
                  <span class="icon icon-sm">schedule</span>
                  <span class="font-mono">${timeRange}</span>
                </div>

                <div class="cc-event-meta-row">
                  <span class="icon icon-sm">location_on</span>
                  <span>${event.location}</span>
                </div>

                <p class="cc-event-description-snippet">${event.description}</p>

                <!-- Capacity bar -->
                <div class="cc-capacity-wrapper">
                  <div class="cc-capacity-header">
                    <span class="font-mono text-muted">${regCount} / ${event.max_participants} Registered</span>
                    <span class="font-mono text-muted">${capacityPercent}%</span>
                  </div>
                  <div class="cc-progress-track">
                    <div class="cc-progress-fill" style="width: ${capacityPercent}%; ${
                      capacityPercent >= 100 ? 'background-color: var(--color-danger);' : ''
                    }"></div>
                  </div>
                </div>
              </div>

              <div class="cc-event-card-footer">
                <div class="flex items-center gap-xs">
                  <a href="./pages/event-details.html?event=${event.id}" class="btn btn-outline btn-sm" style="flex: 1;">
                    <span>Details</span>
                  </a>
                  <a ${regLinkAttr} class="btn btn-primary btn-sm" style="flex: 1;">
                    <span>Register</span>
                    <span class="icon icon-sm">arrow_forward</span>
                  </a>
                </div>
              </div>
            </article>
          `;
        })
        .join('');

      if (!container._regGuardBound) {
        container._regGuardBound = true;
        container.addEventListener('click', (e) => {
          const regBtn = e.target.closest('a[href*="register.html"]');
          if (regBtn && !CC.DataStore.isAuthenticated()) {
            e.preventDefault();
            window.location.href = './pages/login.html';
          }
        });
      }
    },

    renderAnnouncementTicker: function () {
      const container = document.getElementById('announcement-ticker-item');
      if (!container) return;

      const announcements = CC.DataStore.getAnnouncements();
      if (!announcements || announcements.length === 0) return;

      const latest = announcements[0];
      container.innerHTML = `
        <div class="flex items-center gap-sm flex-wrap">
          <span class="badge badge-primary">Campus Notice</span>
          <strong class="text-sm text-primary">${latest.title}</strong>
          <span class="text-xs text-muted font-mono">&bull; ${latest.created_by}</span>
        </div>
      `;
    },

    bindSearchForm: function () {
      const searchInput = document.getElementById('hero-search-input');
      const categorySelect = document.getElementById('hero-category-select');
      const searchBtn = document.getElementById('hero-search-btn');

      const handleSearch = () => {
        const query = (searchInput ? searchInput.value : '').toLowerCase().trim();
        const cat = categorySelect ? categorySelect.value : 'all';

        // If user clicks search button or presses enter, route to catalog if query is provided or filter locally
        const filtered = CC.DataStore.getEvents().filter((evt) => {
          const matchCat = cat === 'all' || evt.category.toLowerCase() === cat.toLowerCase();
          const matchQuery =
            !query ||
            evt.title.toLowerCase().includes(query) ||
            evt.description.toLowerCase().includes(query) ||
            evt.location.toLowerCase().includes(query);
          return matchCat && matchQuery;
        });

        this.renderFeaturedEvents(filtered);
      };

      if (searchInput) searchInput.addEventListener('input', handleSearch);
      if (categorySelect) categorySelect.addEventListener('change', handleSearch);
      if (searchBtn) {
        searchBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const query = (searchInput ? searchInput.value : '').trim();
          const cat = categorySelect ? categorySelect.value : 'all';
          window.location.href = `./pages/events.html?q=${encodeURIComponent(query)}&cat=${encodeURIComponent(cat)}`;
        });
      }
    },
  };

  CC.Landing = LandingPage;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => LandingPage.init());
  } else {
    LandingPage.init();
  }
})();
