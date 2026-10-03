/**
 * CampusConnect - Event Catalog Controller
 * Clean, maintainable Vanilla JS controller for discovering campus events.
 */

(function () {
  'use strict';

  window.CampusConnect = window.CampusConnect || {};
  const CC = window.CampusConnect;

  const EventCatalog = {
    events: [],
    filteredEvents: [],
    currentUser: null,

    init: function () {
      if (!CC.DataStore) {
        console.warn('CampusConnect DataStore not available.');
        return;
      }

      this.currentUser = CC.DataStore.getCurrentUser();
      this.events = CC.DataStore.getEvents();
      this.populateCategoryFilter();
      this.readUrlParams();
      this.bindFilters();
      this.applyFilters();

      CC.on('auth:logout', () => {
        this.currentUser = null;
        this.applyFilters();
      });
      CC.on('auth:success', () => {
        this.currentUser = CC.DataStore.getCurrentUser();
        this.applyFilters();
      });
      window.addEventListener('pageshow', () => {
        this.currentUser = CC.DataStore.getCurrentUser();
        this.applyFilters();
      });

      console.info('CampusConnect Event Catalog initialized.');
    },

    readUrlParams: function () {
      const urlParams = new URLSearchParams(window.location.search);
      const query = urlParams.get('q');
      const cat = urlParams.get('cat');

      const searchInput = document.getElementById('catalog-search-input');
      const categorySelect = document.getElementById('catalog-category-filter');

      if (query && searchInput) {
        searchInput.value = query;
      }
      if (cat && categorySelect) {
        for (let i = 0; i < categorySelect.options.length; i++) {
          if (categorySelect.options[i].value.toLowerCase() === cat.toLowerCase()) {
            categorySelect.selectedIndex = i;
            break;
          }
        }
      }
    },

    populateCategoryFilter: function () {
      const select = document.getElementById('catalog-category-filter');
      if (!select) return;

      const categories = CC.DataStore.getCategories();
      select.innerHTML = categories
        .map((c) => `<option value="${c.id}">${c.name}</option>`)
        .join('');
    },

    bindFilters: function () {
      const searchInput = document.getElementById('catalog-search-input');
      const categorySelect = document.getElementById('catalog-category-filter');
      const statusSelect = document.getElementById('catalog-status-filter');
      const sortSelect = document.getElementById('catalog-sort-select');
      const resetBtn = document.getElementById('catalog-reset-btn');

      const triggerFilter = () => this.applyFilters();

      if (searchInput) searchInput.addEventListener('input', triggerFilter);
      if (categorySelect) categorySelect.addEventListener('change', triggerFilter);
      if (statusSelect) statusSelect.addEventListener('change', triggerFilter);
      if (sortSelect) sortSelect.addEventListener('change', triggerFilter);

      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          if (searchInput) searchInput.value = '';
          if (categorySelect) categorySelect.value = 'all';
          if (statusSelect) statusSelect.value = 'all';
          if (sortSelect) sortSelect.value = 'date-asc';
          this.applyFilters();
        });
      }
    },

    applyFilters: function () {
      const searchInput = document.getElementById('catalog-search-input');
      const categorySelect = document.getElementById('catalog-category-filter');
      const statusSelect = document.getElementById('catalog-status-filter');
      const sortSelect = document.getElementById('catalog-sort-select');

      const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
      const category = categorySelect ? categorySelect.value : 'all';
      const statusFilter = statusSelect ? statusSelect.value : 'all';
      const sortBy = sortSelect ? sortSelect.value : 'date-asc';

      let results = this.events.slice();

      // Search keyword filter
      if (query) {
        results = results.filter((evt) => {
          return (
            evt.title.toLowerCase().includes(query) ||
            evt.description.toLowerCase().includes(query) ||
            evt.location.toLowerCase().includes(query) ||
            evt.created_by.toLowerCase().includes(query)
          );
        });
      }

      // Category filter
      if (category && category !== 'all') {
        results = results.filter((evt) => evt.category.toLowerCase() === category.toLowerCase());
      }

      // Status filter
      if (statusFilter && statusFilter !== 'all') {
        results = results.filter((evt) => evt.status.toUpperCase() === statusFilter.toUpperCase());
      }

      // Sort
      results.sort((a, b) => {
        const dateA = new Date(a.start_time).getTime();
        const dateB = new Date(b.start_time).getTime();
        if (sortBy === 'date-desc') return dateB - dateA;
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        if (sortBy === 'capacity') return b.max_participants - a.max_participants;
        return dateA - dateB; // Default earliest date
      });

      this.filteredEvents = results;
      this.renderEvents();
      this.updateSummaryCount();
    },

    updateSummaryCount: function () {
      const countEl = document.getElementById('catalog-results-count');
      if (countEl) {
        countEl.textContent = `Showing ${this.filteredEvents.length} of ${this.events.length} campus events`;
      }
    },

    renderEvents: function () {
      const container = document.getElementById('catalog-events-grid');
      if (!container) return;

      if (this.filteredEvents.length === 0) {
        container.innerHTML = `
          <div class="cc-state-box">
            <span class="icon">event_busy</span>
            <h3>No events found</h3>
            <p>No campus events matched your current search criteria. Try clearing your search query or selecting another category filter.</p>
          </div>
        `;
        return;
      }

      this.currentUser = CC.DataStore.getCurrentUser();
      const userId = this.currentUser ? this.currentUser.id : null;
      const isAuthenticated = !!(this.currentUser && (this.currentUser.id || this.currentUser.email));

      container.innerHTML = this.filteredEvents
        .map((event) => {
          const startDate = CC.DataStore.formatDate(event.start_time);
          const timeRange = CC.DataStore.formatTimeRange(event.start_time, event.end_time);
          const regCount = CC.DataStore.getEventRegistrationCount(event.id);
          const capacityPercent = Math.min(100, Math.round((regCount / event.max_participants) * 100));
          const regState = CC.DataStore.getEventRegistrationState(event, userId);

          // Status Badge
          let statusBadgeHtml = '';
          if (event.status === 'CANCELLED') {
            statusBadgeHtml = `<span class="badge badge-danger">Cancelled</span>`;
          } else if (event.status === 'COMPLETED') {
            statusBadgeHtml = `<span class="badge badge-neutral">Completed</span>`;
          } else if (regState === 'ALREADY_REGISTERED') {
            statusBadgeHtml = `<span class="badge badge-success">Registered</span>`;
          } else if (regState === 'EVENT_FULL') {
            statusBadgeHtml = `<span class="badge badge-warning">Event Full</span>`;
          } else if (regState === 'REGISTRATION_CLOSED') {
            statusBadgeHtml = `<span class="badge badge-neutral">Closed</span>`;
          } else {
            statusBadgeHtml = `<span class="badge badge-primary">Open</span>`;
          }

          // Registration Action Button
          let actionBtnHtml = '';
          if (regState === 'ALREADY_REGISTERED') {
            actionBtnHtml = `
              <a href="./dashboard.html" class="btn btn-outline btn-sm" style="flex: 1;">
                <span>View in Dashboard</span>
              </a>
            `;
          } else if (regState === 'REGISTRATION_OPEN') {
            const regHref = isAuthenticated ? `./register.html?event=${event.id}` : './login.html';
            actionBtnHtml = `
              <a href="${regHref}" class="btn btn-primary btn-sm" style="flex: 1;">
                <span>Register</span>
              </a>
            `;
          } else if (regState === 'EVENT_FULL') {
            actionBtnHtml = `
              <button class="btn btn-outline btn-sm" disabled style="flex: 1; opacity: 0.6; cursor: not-allowed;">
                <span>Full</span>
              </button>
            `;
          } else if (regState === 'EVENT_CANCELLED') {
            actionBtnHtml = `
              <button class="btn btn-outline btn-sm" disabled style="flex: 1; opacity: 0.6; cursor: not-allowed;">
                <span>Cancelled</span>
              </button>
            `;
          } else {
            actionBtnHtml = `
              <button class="btn btn-outline btn-sm" disabled style="flex: 1; opacity: 0.6; cursor: not-allowed;">
                <span>Closed</span>
              </button>
            `;
          }

          return `
            <article class="card cc-event-card" id="${event.id}">
              <div class="flex items-center justify-between gap-xs" style="margin-bottom: var(--space-xs);">
                <span class="badge badge-secondary font-mono">${event.category}</span>
                ${statusBadgeHtml}
              </div>

              <h3 class="text-lg text-primary font-weight-bold" style="margin-bottom: var(--space-xs); line-height: 1.3;" title="${event.title}">
                <a href="./event-details.html?event=${event.id}" class="hover:underline text-primary">
                  ${event.title}
                </a>
              </h3>

              <div class="flex flex-col gap-2xs text-sm text-muted" style="margin-bottom: var(--space-sm);">
                <div class="flex items-center gap-xs">
                  <span class="icon icon-sm">calendar_month</span>
                  <span class="font-mono">${startDate}</span>
                </div>
                <div class="flex items-center gap-xs">
                  <span class="icon icon-sm">schedule</span>
                  <span class="font-mono">${timeRange}</span>
                </div>
                <div class="flex items-center gap-xs">
                  <span class="icon icon-sm">location_on</span>
                  <span>${event.location}</span>
                </div>
              </div>

              <p class="text-sm text-secondary" style="margin-bottom: var(--space-md); display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.55;">
                ${event.description}
              </p>

              <!-- Capacity Tracker -->
              <div style="margin-top: auto; padding-top: var(--space-xs); border-top: 1px solid var(--color-surface-subtle); margin-bottom: var(--space-md);">
                <div class="flex items-center justify-between text-xs" style="margin-bottom: 4px;">
                  <span class="text-muted font-mono">${regCount} / ${event.max_participants} registered</span>
                  <span class="text-muted font-mono">${capacityPercent}%</span>
                </div>
                <div style="height: 6px; background-color: var(--color-surface-subtle); border-radius: var(--radius-full); overflow: hidden;">
                  <div style="width: ${capacityPercent}%; height: 100%; background-color: ${capacityPercent >= 100 ? 'var(--color-danger)' : 'var(--color-secondary)'}; border-radius: var(--radius-full);"></div>
                </div>
              </div>

              <!-- Action Footer -->
              <div class="flex items-center gap-xs">
                <a href="./event-details.html?event=${event.id}" class="btn btn-outline btn-sm" style="flex: 1;">
                  <span>Details</span>
                </a>
                ${actionBtnHtml}
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
            window.location.href = './login.html';
          }
        });
      }
    },
  };

  CC.EventCatalog = EventCatalog;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => EventCatalog.init());
  } else {
    EventCatalog.init();
  }
})();
