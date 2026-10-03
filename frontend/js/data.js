/**
 * CampusConnect - Centralized Mock Data Store
 * Cleanly decoupled domain layer aligned with backend Java Spring Boot REST API entities.
 */

(function () {
  'use strict';

  window.CampusConnect = window.CampusConnect || {};
  const CC = window.CampusConnect;

  const MockData = {
    // Current User Session Accounts
    users: [
      {
        id: 'usr-student-1',
        name: 'Alex Rivera',
        email: 'alex.rivera@university.edu',
        role: 'STUDENT',
        department: 'Computer Science & Engineering',
        campusId: 'STU-9402',
      },
      {
        id: 'usr-faculty-1',
        name: 'Prof. David Chen',
        email: 'prof.chen@university.edu',
        role: 'FACULTY',
        department: 'Biomedical Sciences',
        campusId: 'FAC-4811',
      },
      {
        id: 'usr-admin-1',
        name: 'Dean Vance',
        email: 'admin.vance@university.edu',
        role: 'ADMIN',
        department: 'Student Affairs & Campus Administration',
        campusId: 'ADM-1001',
      },
    ],

    // Campus Event Categories for filtering
    categories: [
      { id: 'all', name: 'All Categories' },
      { id: 'Technology', name: 'Technology' },
      { id: 'Career', name: 'Career & Networking' },
      { id: 'Arts', name: 'Arts & Culture' },
      { id: 'Academic', name: 'Academic Symposia' },
      { id: 'Athletics', name: 'Athletics & Wellness' },
    ],

    // Campus Events
    events: [
      {
        id: 'evt-101',
        title: 'Annual Artificial Intelligence & Robotics Symposium 2026',
        description: 'The Annual AI & Robotics Symposium brings together university researchers, student developers, and academic staff for technical presentations, keynote discussions on intelligent systems, and project exhibitions.',
        category: 'Technology',
        location: 'Turing Hall, Auditorium A',
        start_time: '2026-10-24T10:00:00',
        end_time: '2026-10-24T15:30:00',
        registration_deadline: '2026-10-22T23:59:59',
        max_participants: 250,
        status: 'PUBLISHED', // DRAFT | PUBLISHED | CANCELLED | COMPLETED
        created_by: 'Department of Computer Science',
        created_at: '2026-09-01T09:00:00',
        updated_at: '2026-09-15T14:00:00',
      },
      {
        id: 'evt-102',
        title: 'Fall 2026 Tech & Consulting Career Expo',
        description: 'Connect directly with industry employers, corporate recruiters, and alumni representatives offering internship opportunities and entry-level positions across technology, engineering, and consulting fields.',
        category: 'Career',
        location: 'University Student Union, Grand Ballroom',
        start_time: '2026-10-28T09:00:00',
        end_time: '2026-10-28T16:00:00',
        registration_deadline: '2026-10-27T18:00:00',
        max_participants: 600,
        status: 'PUBLISHED',
        created_by: 'University Career Services',
        created_at: '2026-09-05T10:00:00',
        updated_at: '2026-09-20T11:30:00',
      },
      {
        id: 'evt-103',
        title: 'Contemporary Chamber Orchestra & Jazz Ensemble',
        description: 'An evening performance presented by the College of Arts and Music, showcasing classical compositions and collegiate jazz pieces performed by student soloists and ensembles.',
        category: 'Arts',
        location: 'Kaufmann Concert Hall, Stage West',
        start_time: '2026-11-02T19:00:00',
        end_time: '2026-11-02T21:30:00',
        registration_deadline: '2026-11-01T23:59:59',
        max_participants: 350,
        status: 'PUBLISHED',
        created_by: 'College of Arts & Media',
        created_at: '2026-09-10T08:00:00',
        updated_at: '2026-09-18T16:00:00',
      },
      {
        id: 'evt-104',
        title: 'Accessible Web Architecture & Standards Workshop',
        description: 'A hands-on technical workshop exploring modern semantic markup, accessible interface patterns, and standard-compliant web development practices.',
        category: 'Technology',
        location: 'Ada Lovelace Building, Lab 412',
        start_time: '2026-11-06T13:00:00',
        end_time: '2026-11-06T16:00:00',
        registration_deadline: '2026-11-04T12:00:00',
        max_participants: 45,
        status: 'PUBLISHED',
        created_by: 'Department of Computer Science',
        created_at: '2026-09-12T13:00:00',
        updated_at: '2026-09-22T09:00:00',
      },
      {
        id: 'evt-105',
        title: 'Interdisciplinary Biomedical Research Colloquium',
        description: 'Faculty-led symposium discussing recent investigations in molecular genetics, bioinformatics, and cellular biology conducted across university laboratories.',
        category: 'Academic',
        location: 'Health Sciences Complex, Hall B',
        start_time: '2026-11-12T14:00:00',
        end_time: '2026-11-12T17:00:00',
        registration_deadline: '2026-11-10T23:59:59',
        max_participants: 120,
        status: 'PUBLISHED',
        created_by: 'Biomedical & Life Sciences',
        created_at: '2026-09-14T11:00:00',
        updated_at: '2026-09-25T15:00:00',
      },
      {
        id: 'evt-106',
        title: 'Campus Intramural Cross-Country 5K & Wellness Run',
        description: 'Annual university community run open to students, faculty, and staff. Course circles the campus perimeter starting and concluding at North Field Stadium.',
        category: 'Athletics',
        location: 'North Field Stadium & Campus Perimeter',
        start_time: '2026-11-18T08:30:00',
        end_time: '2026-11-18T11:00:00',
        registration_deadline: '2026-11-16T17:00:00',
        max_participants: 400,
        status: 'PUBLISHED',
        created_by: 'Campus Recreation & Athletics',
        created_at: '2026-09-18T14:00:00',
        updated_at: '2026-09-28T10:00:00',
      },
      {
        id: 'evt-107',
        title: 'Alumni Leadership & Public Policy Roundtable (Cancelled)',
        description: 'Roundtable discussion on civic infrastructure and regional administration with visiting university alumni.',
        category: 'Academic',
        location: 'Civic Hall, Room 102',
        start_time: '2026-10-15T15:00:00',
        end_time: '2026-10-15T17:30:00',
        registration_deadline: '2026-10-13T23:59:59',
        max_participants: 80,
        status: 'CANCELLED',
        created_by: 'Faculty of Law & Public Policy',
        created_at: '2026-08-20T10:00:00',
        updated_at: '2026-10-01T09:00:00',
      },
      {
        id: 'evt-108',
        title: 'Fall Semester Welcome Convocation & Orientation (Completed)',
        description: 'Official university welcome ceremony for incoming students and academic faculty.',
        category: 'Academic',
        location: 'University Amphitheater',
        start_time: '2026-09-02T10:00:00',
        end_time: '2026-09-02T12:00:00',
        registration_deadline: '2026-09-01T23:59:59',
        max_participants: 1200,
        status: 'COMPLETED',
        created_by: 'Office of Academic Affairs',
        created_at: '2026-08-01T09:00:00',
        updated_at: '2026-09-03T10:00:00',
      },
    ],

    // Default Initial Registrations
    registrations: [
      {
        id: 'reg-101',
        user_id: 'usr-student-1',
        event_id: 'evt-101',
        registration_status: 'REGISTERED', // REGISTERED | CANCELLED | WAITLISTED
        attendance_status: 'PENDING',     // PENDING | ATTENDED | ABSENT
        registered_at: '2026-09-20T14:30:00',
      },
      {
        id: 'reg-102',
        user_id: 'usr-student-1',
        event_id: 'evt-102',
        registration_status: 'REGISTERED',
        attendance_status: 'PENDING',
        registered_at: '2026-09-22T09:15:00',
      },
      // Some mock registrations by other users for capacity testing
      {
        id: 'reg-201',
        user_id: 'usr-student-2',
        event_id: 'evt-104',
        registration_status: 'REGISTERED',
        attendance_status: 'PENDING',
        registered_at: '2026-09-23T11:00:00',
      },
    ],

    // Official Campus Announcements
    announcements: [
      {
        id: 'ann-1',
        title: 'Fall 2026 Course Drop/Add Deadline Approaching',
        content: 'All schedule adjustments without academic transcript penalty must be finalized through the student portal before Friday at 11:59 PM.',
        created_by: 'Office of the University Registrar',
        created_at: '2026-10-18T08:00:00',
      },
      {
        id: 'ann-2',
        title: 'Campus Shuttle Service Route Expansion for Science Complex',
        content: 'Two electric shuttles have been added to Route Blue, running every 8 minutes between Turing Hall and the University Student Union.',
        created_by: 'Campus Transportation & Logistics',
        created_at: '2026-10-16T09:30:00',
      },
      {
        id: 'ann-3',
        title: 'Applications Open for University Undergraduate Research Grants',
        content: 'Undergraduate student project proposals for academic year seed equipment grants are open through the research division portal.',
        created_by: 'Office of Academic Research',
        created_at: '2026-10-14T10:15:00',
      },
    ],
  };

  /**
   * Data Access Helper Methods
   */
  const DataStore = {
    // Current user helpers
    getCurrentUser: function () {
      try {
        const saved = localStorage.getItem('cc_current_user');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && (parsed.id || parsed.email)) {
            return parsed;
          }
        }
      } catch (e) {}
      return null;
    },

    setCurrentUser: function (user) {
      try {
        if (user) {
          localStorage.setItem('cc_current_user', JSON.stringify(user));
        } else {
          localStorage.removeItem('cc_current_user');
        }
      } catch (e) {}
    },

    clearCurrentUser: function () {
      try {
        localStorage.removeItem('cc_current_user');
        sessionStorage.removeItem('cc_current_user');
      } catch (e) {}
    },

    isAuthenticated: function () {
      return this.getCurrentUser() !== null;
    },

    // Events
    getEvents: function () {
      try {
        const saved = localStorage.getItem('cc_events');
        if (saved) return JSON.parse(saved);
      } catch (e) {}
      try {
        localStorage.setItem('cc_events', JSON.stringify(MockData.events));
      } catch (e) {}
      return MockData.events;
    },

    getEventById: function (id) {
      const events = this.getEvents();
      return events.find((e) => e.id === id) || null;
    },

    createEvent: function (eventData) {
      const all = this.getEvents();
      const newEvent = {
        id: 'evt-' + Math.floor(200 + Math.random() * 800),
        title: eventData.title,
        description: eventData.description,
        category: eventData.category || 'Technology',
        location: eventData.location,
        start_time: eventData.start_time || new Date().toISOString(),
        end_time: eventData.end_time || new Date().toISOString(),
        registration_deadline: eventData.registration_deadline || new Date().toISOString(),
        max_participants: parseInt(eventData.max_participants, 10) || 100,
        status: eventData.status || 'PUBLISHED',
        created_by: eventData.created_by || 'Faculty Member',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      all.unshift(newEvent);
      try {
        localStorage.setItem('cc_events', JSON.stringify(all));
      } catch (e) {}
      return newEvent;
    },

    updateEventStatus: function (eventId, newStatus) {
      const all = this.getEvents();
      const evt = all.find((e) => e.id === eventId);
      if (evt) {
        evt.status = newStatus;
        evt.updated_at = new Date().toISOString();
        try {
          localStorage.setItem('cc_events', JSON.stringify(all));
        } catch (e) {}
        return true;
      }
      return false;
    },

    // Users
    getUsers: function () {
      try {
        const saved = localStorage.getItem('cc_users');
        if (saved) return JSON.parse(saved);
      } catch (e) {}
      try {
        localStorage.setItem('cc_users', JSON.stringify(MockData.users));
      } catch (e) {}
      return MockData.users;
    },

    getUserById: function (id) {
      const users = this.getUsers();
      return users.find((u) => u.id === id) || null;
    },

    // Registrations stored in LocalStorage to simulate state persistence
    getRegistrations: function () {
      try {
        const saved = localStorage.getItem('cc_registrations');
        if (saved) return JSON.parse(saved);
      } catch (e) {}
      // Initialize with default mock registrations
      try {
        localStorage.setItem('cc_registrations', JSON.stringify(MockData.registrations));
      } catch (e) {}
      return MockData.registrations;
    },

    getAllRegistrations: function () {
      return this.getRegistrations();
    },

    getUserRegistrations: function (userId) {
      const all = this.getRegistrations();
      return all.filter((r) => r.user_id === userId && r.registration_status === 'REGISTERED');
    },

    getFacultyEvents: function (facultyUser) {
      const all = this.getEvents();
      if (!facultyUser) return [];
      return all.filter((e) => {
        const byName = e.created_by.toLowerCase().includes(facultyUser.name.toLowerCase());
        const byDept = facultyUser.department && e.created_by.toLowerCase().includes(facultyUser.department.toLowerCase());
        return byName || byDept || e.created_by.includes('Biomedical') || e.created_by.includes('Computer Science');
      });
    },

    getFacultyRegistrations: function (facultyEvents) {
      const eventIds = facultyEvents.map((e) => e.id);
      const allRegs = this.getRegistrations();
      return allRegs.filter((r) => eventIds.includes(r.event_id));
    },

    getRegistrationForEvent: function (userId, eventId) {
      const all = this.getRegistrations();
      return all.find((r) => r.user_id === userId && r.event_id === eventId && r.registration_status === 'REGISTERED') || null;
    },

    getEventRegistrationCount: function (eventId) {
      const all = this.getRegistrations();
      const baseMockCount = {
        'evt-101': 198,
        'evt-102': 540,
        'evt-103': 210,
        'evt-104': 45, // Full
        'evt-105': 84,
        'evt-106': 160,
        'evt-107': 30,
        'evt-108': 1200,
      }[eventId] || 0;

      return baseMockCount;
    },

    /**
     * Compute the UI Registration State for an event
     */
    getEventRegistrationState: function (event, userId) {
      if (!event) return 'REGISTRATION_CLOSED';

      if (event.status === 'CANCELLED') return 'EVENT_CANCELLED';
      if (event.status === 'COMPLETED') return 'EVENT_COMPLETED';

      // Check if user is already registered
      if (userId) {
        const existing = this.getRegistrationForEvent(userId, event.id);
        if (existing) return 'ALREADY_REGISTERED';
      }

      // Check deadline
      const deadline = new Date(event.registration_deadline);
      const now = new Date();
      if (deadline < now) return 'REGISTRATION_CLOSED';

      // Check capacity
      const regCount = this.getEventRegistrationCount(event.id);
      if (regCount >= event.max_participants) return 'EVENT_FULL';

      return 'REGISTRATION_OPEN';
    },

    // Register user for an event
    registerForEvent: function (userId, eventId) {
      const all = this.getRegistrations();
      const existing = all.find((r) => r.user_id === userId && r.event_id === eventId);

      if (existing) {
        existing.registration_status = 'REGISTERED';
        existing.registered_at = new Date().toISOString();
      } else {
        const newReg = {
          id: 'reg-' + Math.floor(1000 + Math.random() * 9000),
          user_id: userId,
          event_id: eventId,
          registration_status: 'REGISTERED',
          attendance_status: 'PENDING',
          registered_at: new Date().toISOString(),
        };
        all.push(newReg);
      }

      try {
        localStorage.setItem('cc_registrations', JSON.stringify(all));
      } catch (e) {}

      return true;
    },

    // Cancel registration
    cancelRegistration: function (userId, eventId) {
      const all = this.getRegistrations();
      const reg = all.find((r) => r.user_id === userId && r.event_id === eventId && r.registration_status === 'REGISTERED');
      if (reg) {
        reg.registration_status = 'CANCELLED';
        try {
          localStorage.setItem('cc_registrations', JSON.stringify(all));
        } catch (e) {}
        return true;
      }
      return false;
    },

    // Announcements
    getAnnouncements: function () {
      try {
        const saved = localStorage.getItem('cc_announcements');
        if (saved) return JSON.parse(saved);
      } catch (e) {}
      try {
        localStorage.setItem('cc_announcements', JSON.stringify(MockData.announcements));
      } catch (e) {}
      return MockData.announcements;
    },

    createAnnouncement: function (annData) {
      const all = this.getAnnouncements();
      const newAnn = {
        id: 'ann-' + Math.floor(10 + Math.random() * 90),
        title: annData.title,
        content: annData.content,
        created_by: annData.created_by || 'Campus Department',
        created_at: new Date().toISOString(),
      };
      all.unshift(newAnn);
      try {
        localStorage.setItem('cc_announcements', JSON.stringify(all));
      } catch (e) {}
      return newAnn;
    },

    deleteAnnouncement: function (annId) {
      let all = this.getAnnouncements();
      all = all.filter((a) => a.id !== annId);
      try {
        localStorage.setItem('cc_announcements', JSON.stringify(all));
      } catch (e) {}
      return true;
    },

    // Categories
    getCategories: function () {
      return MockData.categories;
    },

    // Date formatting helper
    formatDateTime: function (isoString) {
      if (!isoString) return '';
      const date = new Date(isoString);
      const options = { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true };
      return date.toLocaleDateString('en-US', options);
    },

    formatDate: function (isoString) {
      if (!isoString) return '';
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    },

    formatTimeRange: function (startIso, endIso) {
      if (!startIso) return '';
      const start = new Date(startIso);
      const startTime = start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      if (!endIso) return startTime;
      const end = new Date(endIso);
      const endTime = end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      return `${startTime} – ${endTime}`;
    },
  };

  CC.MockData = MockData;
  CC.DataStore = DataStore;
})();
