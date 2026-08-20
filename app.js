/**
 * app.js — inicialização do app: guarda de sessão, navegação por abas
 * (sidebar no desktop / tabbar no mobile) e utilitário de toast.
 */

const FitPulse = (() => {
    let session = null;
  
    function toast(msg, accent = false) {
      const el = document.getElementById('toast');
      el.textContent = msg;
      el.classList.toggle('accent', accent);
      el.classList.add('show');
      clearTimeout(toast._t);
      toast._t = setTimeout(() => el.classList.remove('show'), 2200);
    }
  
    function setActiveTab(tabId) {
      document.querySelectorAll('.tab-panel').forEach((p) => {
        p.classList.toggle('active', p.id === `tab-${tabId}`);
      });
      document.querySelectorAll('.nav-item, .tabbar-item').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.tab === tabId);
      });
      localStorage.setItem('fitpulse_last_tab', tabId);
    }
  
    function bindNav() {
      document.querySelectorAll('[data-tab]').forEach((btn) => {
        btn.addEventListener('click', () => setActiveTab(btn.dataset.tab));
      });
    }
  
    function paintUserChip() {
      const initials = session.nome
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase())
        .join('');
      document.getElementById('avatar-chip').textContent = initials || '?';
      document.getElementById('user-name').textContent = session.nome;
      document.getElementById('user-email').textContent = session.email;
    }
  
    function bindLogout() {
      const doLogout = async () => {
        await DB.logout();
        window.location.href = 'login.html';
      };
      document.getElementById('logout-btn').addEventListener('click', doLogout);
      const profileLogoutBtn = document.getElementById('profile-logout-btn');
      if (profileLogoutBtn) profileLogoutBtn.addEventListener('click', doLogout);
    }
  
    async function init() {
      session = await DB.getSession();
      if (!session) {
        window.location.href = 'login.html';
        return;
      }
  
      paintUserChip();
      bindNav();
      bindLogout();
  
      const lastTab = localStorage.getItem('fitpulse_last_tab');
      if (lastTab) setActiveTab(lastTab);
  
      await Profile.init(session.id, toast);
      await Calories.init(session.id, toast);
      await Workout.init(session.id, toast);
    }
  
    document.addEventListener('DOMContentLoaded', init);
  
    return { toast, getSessionId: () => session?.id };
  })();