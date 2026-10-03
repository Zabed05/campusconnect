/**
 * CampusConnect - Core Vanilla JavaScript Foundation
 * Step 1: Baseline Architecture & System Initialization
 *
 * Designed to be modular, cleanly decoupled, and zero-framework.
 * Spring Boot REST API integration will cleanly plug into data adapters.
 */

(function () {
  'use strict';

  // Global namespace
  const CampusConnect = {
    version: '1.0.0-foundation',
    config: {
      useMockData: true,
      apiBaseUrl: null, // To be configured when Spring Boot backend is ready
    },
    state: {
      currentScreen: 'foundation',
      currentUser: null,
      activeTerm: 'Fall 2026',
    },
    events: {},
  };

  /**
   * Simple Event Bus for decoupled component communication
   */
  CampusConnect.on = function (event, handler) {
    if (!CampusConnect.events[event]) {
      CampusConnect.events[event] = [];
    }
    CampusConnect.events[event].push(handler);
  };

  CampusConnect.emit = function (event, data) {
    if (CampusConnect.events[event]) {
      CampusConnect.events[event].forEach((handler) => handler(data));
    }
  };

  /**
   * System initialization
   */
  CampusConnect.init = function () {
    console.info(
      `%c CampusConnect %c v${CampusConnect.version} initialized [Vanilla JS | Academic Modern]`,
      'background: #1e3a8a; color: #ffffff; padding: 2px 6px; border-radius: 4px; font-weight: bold;',
      'color: #2563eb; font-weight: bold;'
    );

    // Initial event emission
    CampusConnect.emit('system:ready', {
      timestamp: new Date().toISOString(),
      term: CampusConnect.state.activeTerm,
    });
  };

  // Expose to window
  window.CampusConnect = CampusConnect;

  // Auto-init on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', CampusConnect.init);
  } else {
    CampusConnect.init();
  }
})();
