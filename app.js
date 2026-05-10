/**
 * FinAdmin BVN — App Logic
 * Handles: login validation, dashboard data, sidebar toggle
 */

/* ============================================================
   CONSTANTS
   ============================================================ */

const DEMO_EMAIL    = 'admin@fintech.io';
const DEMO_PASSWORD = 'Admin@1234';
const STORAGE_KEY   = 'finadmin_session';

/* ============================================================
   UTILITIES
   ============================================================ */

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatCurrency(amount) {
  return '₦' + amount.toLocaleString('en-NG', { minimumFractionDigits: 2 });
}

function randomDigits(length) {
  const arr = new Uint8Array(length);
  crypto.getRandomValues(arr);
  return Array.from(arr, b => b % 10).join('');
}

/** Returns a random integer in [0, max) using crypto. */
function randomInt(max) {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0] % max;
}

function randomBVN() {
  return randomDigits(11);
}

function randomAccount() {
  return randomDigits(10);
}

/* ============================================================
   DUMMY USER DATA (50 records)
   ============================================================ */

const BANKS = ['GTBank', 'Access Bank', 'Zenith', 'First Bank', 'UBA', 'Stanbic IBTC', 'FCMB', 'Sterling'];
const FIRST_NAMES = ['Emeka', 'Ngozi', 'Bola', 'Chidi', 'Amaka', 'Tunde', 'Fatima', 'Ikenna',
                     'Sade', 'Dayo', 'Uche', 'Kemi', 'Seun', 'Ada', 'Musa', 'Chioma'];
const LAST_NAMES  = ['Okafor', 'Adeyemi', 'Ibrahim', 'Nwachukwu', 'Eze', 'Babatunde',
                     'Okonkwo', 'Adeleke', 'Madu', 'Salami', 'Adesanya', 'Obi'];
const STATUSES    = ['active', 'active', 'active', 'pending', 'inactive'];

function generateUsers(count = 50) {
  const users = [];
  for (let i = 0; i < count; i++) {
    const first  = FIRST_NAMES[randomInt(FIRST_NAMES.length)];
    const last   = LAST_NAMES[randomInt(LAST_NAMES.length)];
    const status = STATUSES[randomInt(STATUSES.length)];
    const bank   = BANKS[randomInt(BANKS.length)];
    const daysAgo = randomInt(30);
    const date   = new Date(Date.now() - daysAgo * 24 * 3600 * 1000);

    users.push({
      id:       i + 1,
      name:     `${first} ${last}`,
      email:    `${first.toLowerCase()}.${last.toLowerCase()}${i}@mail.com`,
      bvn:      randomBVN(),
      account:  randomAccount(),
      bank,
      balance:  randomInt(4_000_000) + 5_000,
      status,
      lastLogin: date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      initials: first[0] + last[0],
    });
  }
  return users;
}

const USERS = generateUsers(50);

/* ============================================================
   AVATAR COLOR POOL
   ============================================================ */

const AVATAR_COLORS = [
  '#1a73e8', '#00c6ff', '#6c63ff', '#43a047',
  '#e91e63', '#ff6d00', '#00897b', '#8e24aa',
];

function avatarColor(name) {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) & 0xffffffff;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

/* ============================================================
   LOGIN PAGE
   ============================================================ */

(function initLogin() {
  const form = document.getElementById('loginForm');
  if (!form) return; // Not the login page

  const emailInput    = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const emailError    = document.getElementById('emailError');
  const passwordError = document.getElementById('passwordError');
  const generalError  = document.getElementById('generalError');
  const loginBtn      = document.getElementById('loginBtn');

  function showError(el, input, msg) {
    el.textContent = msg;
    el.classList.add('visible');
    input.classList.add('error-input');
  }

  function clearError(el, input) {
    el.classList.remove('visible');
    input.classList.remove('error-input');
  }

  // Real-time validation
  emailInput.addEventListener('input', () => {
    if (isValidEmail(emailInput.value)) clearError(emailError, emailInput);
  });

  passwordInput.addEventListener('input', () => {
    if (passwordInput.value.length >= 6) clearError(passwordError, passwordInput);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let valid = true;
    generalError.classList.remove('visible');

    // Validate email
    if (!emailInput.value.trim()) {
      showError(emailError, emailInput, 'Email address is required.');
      valid = false;
    } else if (!isValidEmail(emailInput.value)) {
      showError(emailError, emailInput, 'Please enter a valid email address.');
      valid = false;
    } else {
      clearError(emailError, emailInput);
    }

    // Validate password
    if (!passwordInput.value) {
      showError(passwordError, passwordInput, 'Password is required.');
      valid = false;
    } else if (passwordInput.value.length < 6) {
      showError(passwordError, passwordInput, 'Password must be at least 6 characters.');
      valid = false;
    } else {
      clearError(passwordError, passwordInput);
    }

    if (!valid) return;

    // Show loading state
    loginBtn.classList.add('loading');

    // Simulate async authentication
    setTimeout(() => {
      if (
        emailInput.value.trim().toLowerCase() === DEMO_EMAIL &&
        passwordInput.value === DEMO_PASSWORD
      ) {
        // Save session
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
          name:  'Admin Officer',
          email: emailInput.value.trim(),
          role:  'Super Admin',
        }));
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
      } else {
        loginBtn.classList.remove('loading');
        generalError.textContent = 'Invalid email or password. Please try again.';
        generalError.classList.add('visible');
        passwordInput.value = '';
        passwordInput.focus();
      }
    }, 1200);
  });
})();

/* ============================================================
   DASHBOARD PAGE
   ============================================================ */

(function initDashboard() {
  if (!document.getElementById('statsGrid')) return; // Not the dashboard

  /* ── Auth guard ── */
  const session = sessionStorage.getItem(STORAGE_KEY);
  if (!session) { window.location.href = 'index.html'; return; }

  const user = JSON.parse(session);
  const initials = user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  /* ── Update user UI ── */
  const welcomeMsg   = document.getElementById('welcomeMsg');
  const sidebarName  = document.getElementById('sidebarUserName');
  const sidebarAv    = document.getElementById('sidebarAvatar');
  const navbarAv     = document.getElementById('navbarAvatar');

  if (welcomeMsg)  welcomeMsg.textContent = `${getGreeting()}, ${user.name.split(' ')[0]} 👋`;
  if (sidebarName) sidebarName.textContent = user.name;
  if (sidebarAv)   sidebarAv.textContent   = initials;
  if (navbarAv)    navbarAv.textContent     = initials;

  /* ── Logout ── */
  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    sessionStorage.removeItem(STORAGE_KEY);
    window.location.href = 'index.html';
  });

  /* ── Stat Cards ── */
  const STATS = [
    { icon: '👥', iconClass: 'icon-blue',  label: 'Total Users',        value: '48,320',     badge: '+3.4%',  badgeClass: 'badge-up'      },
    { icon: '✅', iconClass: 'icon-green', label: 'Verified BVNs',      value: '41,760',     badge: '+1.8%',  badgeClass: 'badge-up'      },
    { icon: '⏳', iconClass: 'icon-gold',  label: 'Pending Verif.',     value: '3,210',      badge: '-0.6%',  badgeClass: 'badge-down'    },
    { icon: '💳', iconClass: 'icon-cyan',  label: 'Total Transactions', value: '₦2.4B',      badge: '+12.1%', badgeClass: 'badge-up'      },
    { icon: '🚫', iconClass: 'icon-red',   label: 'Flagged Accounts',   value: '128',        badge: '+5',     badgeClass: 'badge-neutral' },
  ];

  const statsGrid = document.getElementById('statsGrid');
  STATS.forEach(s => {
    const card = document.createElement('div');
    card.className = 'stat-card fade-in';
    card.innerHTML = `
      <div class="card-top">
        <div class="card-icon ${s.iconClass}">${s.icon}</div>
        <span class="card-badge ${s.badgeClass}">${s.badge}</span>
      </div>
      <div class="card-value">${s.value}</div>
      <div class="card-label">${s.label}</div>
    `;
    statsGrid.appendChild(card);
  });

  /* ── Bar Chart ── */
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const INCOMING_MULTIPLIER = 2_200_000; // Naira per pixel height unit (incoming)
  const OUTGOING_MULTIPLIER = 1_800_000; // Naira per pixel height unit (outgoing)
  const chartEl = document.getElementById('barChart');
  if (chartEl) {
    MONTHS.forEach(m => {
      const h1 = 40 + randomInt(140);
      const h2 = 20 + randomInt(100);
      const group = document.createElement('div');
      group.className = 'bar-group';
      group.innerHTML = `
        <div class="bar bar-1" style="height:${h1}px" title="${m} — incoming: ${formatCurrency(h1 * INCOMING_MULTIPLIER)}"></div>
        <div class="bar bar-2" style="height:${h2}px" title="${m} — outgoing: ${formatCurrency(h2 * OUTGOING_MULTIPLIER)}"></div>
        <span class="bar-label">${m}</span>
      `;
      chartEl.appendChild(group);
    });
  }

  /* ── Users Table (paginated) ── */
  const PAGE_SIZE = 10;
  let currentPage = 1;
  const totalPages = Math.ceil(USERS.length / PAGE_SIZE);

  function renderTable(page) {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    const start = (page - 1) * PAGE_SIZE;
    const slice = USERS.slice(start, start + PAGE_SIZE);

    slice.forEach((u, i) => {
      const color = avatarColor(u.name);
      const statusClass = `status-${u.status}`;
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${start + i + 1}</td>
        <td>
          <div class="user-cell">
            <div class="table-avatar" style="background:${color}" aria-hidden="true">${u.initials}</div>
            <div>
              <div class="user-cell-name">${u.name}</div>
              <div class="user-cell-email">${u.email}</div>
            </div>
          </div>
        </td>
        <td><span class="bvn-badge">${u.bvn}</span></td>
        <td>${u.account}</td>
        <td>${u.bank}</td>
        <td>${formatCurrency(u.balance)}</td>
        <td><span class="status-badge ${statusClass}">${u.status.charAt(0).toUpperCase() + u.status.slice(1)}</span></td>
        <td>${u.lastLogin}</td>
        <td>
          <button class="action-icon" title="View" aria-label="View ${u.name}">👁</button>
          <button class="action-icon" title="Edit" aria-label="Edit ${u.name}">✏️</button>
        </td>
      `;
      tbody.appendChild(row);
    });

    // Info text
    const info = document.getElementById('tableInfo');
    if (info) {
      info.textContent = `Showing ${start + 1}–${Math.min(start + PAGE_SIZE, USERS.length)} of ${USERS.length} users`;
    }
  }

  function renderPagination(page) {
    const pag = document.getElementById('pagination');
    if (!pag) return;
    pag.innerHTML = '';

    const addBtn = (label, p, active = false, disabled = false) => {
      const btn = document.createElement('button');
      btn.className = `page-btn${active ? ' active' : ''}`;
      btn.textContent = label;
      btn.setAttribute('aria-label', `Page ${label}`);
      if (active) btn.setAttribute('aria-current', 'page');
      if (!disabled && !active) {
        btn.addEventListener('click', () => {
          currentPage = p;
          renderTable(currentPage);
          renderPagination(currentPage);
        });
      } else {
        btn.disabled = disabled;
        btn.style.opacity = disabled ? '0.35' : '1';
      }
      pag.appendChild(btn);
    };

    addBtn('‹', page - 1, false, page === 1);

    // Page numbers window
    const paginationRange = 2;
    for (let p = 1; p <= totalPages; p++) {
      if (p === 1 || p === totalPages || (p >= page - paginationRange && p <= page + paginationRange)) {
        addBtn(String(p), p, p === page);
      } else if (p === page - paginationRange - 1 || p === page + paginationRange + 1) {
        const dots = document.createElement('span');
        dots.textContent = '…';
        dots.className = 'pagination-ellipsis';
        dots.setAttribute('aria-hidden', 'true');
        pag.appendChild(dots);
      }
    }

    addBtn('›', page + 1, false, page === totalPages);
  }

  renderTable(currentPage);
  renderPagination(currentPage);

  /* ── CSV Export ── */
  document.getElementById('exportTableBtn')?.addEventListener('click', () => {
    const headers = ['#', 'Name', 'Email', 'BVN', 'Account', 'Bank', 'Balance', 'Status', 'Last Login'];
    const rows = USERS.map((u, i) =>
      [i + 1, u.name, u.email, u.bvn, u.account, u.bank, u.balance, u.status, u.lastLogin]
        .map(v => `"${v}"`).join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'bvn_users_export.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  });

  /* ── Sidebar collapse (desktop) ── */
  const sidebar  = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('sidebarToggle');

  if (sidebar && toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const collapsed = sidebar.classList.toggle('collapsed');
      toggleBtn.querySelector('i').className = collapsed
        ? 'bx bx-chevrons-right'
        : 'bx bx-chevrons-left';
      toggleBtn.setAttribute('aria-label', collapsed ? 'Expand sidebar' : 'Collapse sidebar');
      // Persist preference
      localStorage.setItem('sidebar_collapsed', collapsed ? '1' : '0');
    });

    // Restore preference
    if (localStorage.getItem('sidebar_collapsed') === '1') {
      sidebar.classList.add('collapsed');
      toggleBtn.querySelector('i').className = 'bx bx-chevrons-right';
    }
  }

  /* ── Sidebar mobile toggle ── */
  const mobileToggle  = document.getElementById('mobileToggle');
  const overlay       = document.getElementById('sidebarOverlay');

  function openSidebar() {
    sidebar?.classList.add('mobile-open');
    overlay?.classList.add('visible');
    overlay?.removeAttribute('aria-hidden');
    mobileToggle?.setAttribute('aria-expanded', 'true');
  }

  function closeSidebar() {
    sidebar?.classList.remove('mobile-open');
    overlay?.classList.remove('visible');
    overlay?.setAttribute('aria-hidden', 'true');
    mobileToggle?.setAttribute('aria-expanded', 'false');
  }

  mobileToggle?.addEventListener('click', openSidebar);
  overlay?.addEventListener('click', closeSidebar);

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSidebar();
  });

})();
