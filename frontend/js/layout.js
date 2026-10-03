/**
 * CampusConnect - Reusable Layout & Navigation Controller
 * Shared Header, Responsive Slide-over Drawer, and Session Synchronization.
 */

(function () {
  'use strict';

  window.CampusConnect = window.CampusConnect || {};
  const CC = window.CampusConnect;

  const Layout = {
    isDrawerOpen: false,

    navConfig: {
      visitor: [
        { id: 'nav-home', label: 'Home', icon: 'home', href: './index.html' },
        { id: 'nav-events', label: 'Event Catalog', icon: 'event', href: './events.html' },
        { id: 'nav-login', label: 'Portal Sign In', icon: 'login', href: './login.html' },
      ],
      student: [
        { id: 'nav-dashboard', label: 'Dashboard', icon: 'dashboard', href: './dashboard.html' },
        { id: 'nav-events', label: 'Event Catalog', icon: 'event', href: './events.html' },
        { id: 'nav-home', label: 'Campus Home', icon: 'home', href: './index.html' },
      ],
    },

    init: function () {
      this.bindDrawerEvents();
      this.renderNavigation();

      CC.on('auth:success', () => this.renderNavigation());
      CC.on('auth:logout', () => this.renderNavigation());

      console.info('CampusConnect Layout & Navigation initialized.');
    },

    renderNavigation: function () {
      const desktopNav = document.getElementById('primary-nav-links');
      const headerActions = document.getElementById('header-actions-container');
      const drawerBody = document.getElementById('drawer-nav-links');
      const drawerFooter = document.getElementById('drawer-footer-container');

      const user = CC.DataStore ? CC.DataStore.getCurrentUser() : null;
      const isAuthenticated = !!(user && user.role);
      const roleKey = isAuthenticated ? 'student' : 'visitor';

      const path = window.location.pathname.toLowerCase();
      const isInPagesDir = /\/pages\/|\\pages\\/i.test(window.location.pathname) || /\/pages\/|\\pages\\/i.test(window.location.href);

      const homeHref = isInPagesDir ? '../index.html' : './index.html';
      const eventsHref = isInPagesDir ? './events.html' : './pages/events.html';
      const loginHref = isInPagesDir ? './login.html' : './pages/login.html';
      const dashboardHref = isInPagesDir ? './dashboard.html' : './pages/dashboard.html';

      const navMap = {
        visitor: [
          { id: 'nav-home', label: 'Home', icon: 'home', href: homeHref },
          { id: 'nav-events', label: 'Event Catalog', icon: 'event', href: eventsHref },
          { id: 'nav-login', label: 'Portal Sign In', icon: 'login', href: loginHref },
        ],
        student: [
          { id: 'nav-dashboard', label: 'Dashboard', icon: 'dashboard', href: dashboardHref },
          { id: 'nav-events', label: 'Event Catalog', icon: 'event', href: eventsHref },
          { id: 'nav-home', label: 'Campus Home', icon: 'home', href: homeHref },
        ],
      };

      let links = (navMap[roleKey] || navMap.visitor).slice();

      const isLoginPage = path.endsWith('login.html') || !!document.getElementById('login-form');
      const isLandingPage = !isInPagesDir && (path.endsWith('index.html') || path.endsWith('/frontend/') || path.endsWith('/frontend') || path === '' || path === '/');
      const isEventsPage = path.endsWith('events.html') || path.endsWith('event-details.html') || path.endsWith('register.html');
      const isDashboardPage = path.endsWith('dashboard.html');

      // Minimal login header
      if (isLoginPage) {
        if (desktopNav) desktopNav.innerHTML = '';
        if (drawerBody) drawerBody.innerHTML = '';
        return;
      }

      // Hide portal sign in link from navbar on landing page (CTA buttons already exist)
      if (isLandingPage && !isAuthenticated) {
        links = links.filter((l) => l.id !== 'nav-login');
      }

      // Determine active link
      links = links.map((link) => {
        let active = false;
        if (isLandingPage && link.id === 'nav-home') active = true;
        if (isEventsPage && link.id === 'nav-events') active = true;
        if (isDashboardPage && link.id === 'nav-dashboard') active = true;
        return { ...link, active };
      });

      // Desktop Nav Links
      if (desktopNav) {
        desktopNav.innerHTML = links
          .map(
            (link) => `
          <a href="${link.href}" class="cc-nav-link ${link.active ? 'active' : ''}" id="${link.id}">
            <span>${link.label}</span>
          </a>
        `
          )
          .join('');
      }

      // Header Action Buttons
      if (headerActions) {
        if (!isAuthenticated) {
          headerActions.innerHTML = `
            <a href="${loginHref}" class="btn btn-ghost btn-sm" id="header-btn-login">Sign In</a>
            <a href="${eventsHref}" class="btn btn-primary btn-sm" id="header-btn-cta">
              <span>Explore Events</span>
              <span class="icon icon-sm">arrow_forward</span>
            </a>
          `;
        } else {
          const initials = user.name ? user.name.split(' ').map((n) => n[0]).join('').substring(0, 2) : 'U';
          headerActions.innerHTML = `
            <a href="${dashboardHref}" class="cc-user-chip" id="header-user-chip" title="Signed in as ${user.name}">
              <div class="cc-user-avatar">${initials}</div>
              <div class="flex flex-col" style="line-height: 1.2; padding-right: 4px;">
                <strong style="font-size: var(--text-sm); color: var(--color-text-primary);">${user.name}</strong>
                <span class="text-muted" style="font-size: 12px; font-weight: 500;">${user.role}</span>
              </div>
            </a>
            <button type="button" class="btn btn-outline btn-sm" id="header-btn-logout" title="Sign Out" aria-label="Sign Out">
              <span class="icon icon-sm">logout</span>
            </button>
          `;

          const handleLogout = (e) => {
            if (e) e.preventDefault();
            if (CC.DataStore) {
              CC.DataStore.clearCurrentUser();
            }
            try {
              localStorage.removeItem('cc_current_user');
              sessionStorage.clear();
            } catch (err) {}
            CC.emit('auth:logout');
            window.location.replace(loginHref);
          };

          const logoutBtn = document.getElementById('header-btn-logout');
          if (logoutBtn) {
            logoutBtn.addEventListener('click', handleLogout);
          }
        }
      }

      // Mobile Drawer Links
      if (drawerBody) {
        drawerBody.innerHTML = links
          .map(
            (link) => `
          <a href="${link.href}" class="cc-drawer-link ${link.active ? 'active' : ''}">
            <span class="icon icon-md">${link.icon}</span>
            <span>${link.label}</span>
          </a>
        `
          )
          .join('');
      }

      // Mobile Drawer Footer
      if (drawerFooter) {
        if (!isAuthenticated) {
          drawerFooter.innerHTML = `
            <div class="flex flex-col gap-xs">
              <a href="${loginHref}" class="btn btn-outline btn-sm" style="width: 100%;">Sign In</a>
              <a href="${eventsHref}" class="btn btn-primary btn-sm" style="width: 100%;">Explore Events</a>
            </div>
          `;
        } else {
          const initials = user.name ? user.name.split(' ').map((n) => n[0]).join('').substring(0, 2) : 'U';
          drawerFooter.innerHTML = `
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-xs">
                <div class="cc-user-avatar">${initials}</div>
                <div>
                  <strong class="text-xs text-primary block">${user.name}</strong>
                  <span class="text-xs text-muted block">${user.role}</span>
                </div>
              </div>
              <button type="button" class="btn btn-ghost btn-sm" id="drawer-btn-logout" title="Sign Out" aria-label="Sign Out">
                <span class="icon icon-sm">logout</span>
              </button>
            </div>
          `;

          const drawerLogout = document.getElementById('drawer-btn-logout');
          if (drawerLogout) {
            drawerLogout.addEventListener('click', (e) => {
              Layout.closeDrawer();
              if (CC.DataStore) {
                CC.DataStore.clearCurrentUser();
              }
              try {
                localStorage.removeItem('cc_current_user');
                sessionStorage.clear();
              } catch (err) {}
              CC.emit('auth:logout');
              window.location.replace(loginHref);
            });
          }
        }
      }
    },

    bindDrawerEvents: function () {
      const toggleBtn = document.getElementById('mobile-drawer-toggle');
      const closeBtn = document.getElementById('drawer-close-btn');
      const overlay = document.getElementById('mobile-drawer-overlay');
      const drawerNav = document.getElementById('drawer-nav-links');

      if (toggleBtn) {
        toggleBtn.addEventListener('click', () => this.openDrawer());
      }
      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.closeDrawer());
      }
      if (overlay) {
        overlay.addEventListener('click', (e) => {
          if (e.target === overlay) this.closeDrawer();
        });
      }
      if (drawerNav) {
        drawerNav.addEventListener('click', (e) => {
          if (e.target.closest('.cc-drawer-link')) {
            this.closeDrawer();
          }
        });
      }

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isDrawerOpen) {
          this.closeDrawer();
        }
      });
    },

    openDrawer: function () {
      const overlay = document.getElementById('mobile-drawer-overlay');
      if (overlay) {
        overlay.classList.add('is-open');
        this.isDrawerOpen = true;
        document.body.style.overflow = 'hidden';
      }
    },

    closeDrawer: function () {
      const overlay = document.getElementById('mobile-drawer-overlay');
      if (overlay) {
        overlay.classList.remove('is-open');
        this.isDrawerOpen = false;
        document.body.style.overflow = '';
      }
    },
  };

  CC.Layout = Layout;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Layout.init());
  } else {
    Layout.init();
  }
})();
