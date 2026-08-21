/**
 * calories.js — gerenciamento do diário alimentar, cálculo
 * da meta calórica com base no perfil e atualização da UI.
 */
const Calories = (() => {
  let uid = null;
  let notify = () => {};
  let meals = [];
  let dailyGoal = 2000;
  let todayStr = new Date().toISOString().split('T')[0];

  const RING_CIRC = 490;

  // Calcula a Meta Diária (TMB) com base no Perfil
  function calculateGoal(profile) {
    if (!profile || !profile.peso || !profile.altura || !profile.idade || !profile.genero) {
      return 2000; // Valor padrão se o perfil estiver incompleto
    }
    
    // Fórmula de Mifflin-St Jeor
    let tmb = (10 * profile.peso) + (6.25 * profile.altura) - (5 * profile.idade);
    tmb += (profile.genero === 'masculino') ? 5 : -161;

    // Multiplicador de atividade leve
    let tdee = tmb * 1.375;

    // Ajuste de acordo com o objetivo
    if (profile.objetivo === 'emagrecimento') return Math.round(tdee - 500);
    if (profile.objetivo === 'definicao') return Math.round(tdee - 300);
    if (profile.objetivo === 'hipertrofia') return Math.round(tdee + 500);
    return Math.round(tdee);
  }

  async function loadState() {
    const profile = await Profile.getProfile();
    dailyGoal = calculateGoal(profile);

    // Tenta buscar refeições no DB. Se a função não existir no seu storage.js, usa localStorage como fallback para não quebrar.
    try {
      if (typeof DB.getMeals === 'function') {
        meals = await DB.getMeals(uid, todayStr) || [];
      } else {
        const local = localStorage.getItem(`meals_${uid}_${todayStr}`);
        meals = local ? JSON.parse(local) : [];
      }
    } catch (e) {
      meals = [];
    }

    updateUI();
  }

  function updateUI() {
    const consumed = meals.reduce((acc, m) => acc + m.kcal, 0);
    const remaining = dailyGoal - consumed;
    const pct = Math.min((consumed / dailyGoal) * 100, 100) || 0;

    document.getElementById('cal-meta').textContent = `${dailyGoal} kcal`;
    document.getElementById('cal-consumidas').textContent = `${consumed} kcal`;
    document.getElementById('cal-restantes').textContent = `${remaining >= 0 ? remaining : 0} kcal`;
    document.getElementById('cal-percent').textContent = `${Math.round(pct)}%`;

    const ring = document.getElementById('cal-ring-fill');
    if (ring) ring.style.strokeDashoffset = RING_CIRC - ((pct / 100) * RING_CIRC);

    const progress = document.getElementById('cal-progress-fill');
    if (progress) {
        progress.style.width = `${pct}%`;
        progress.style.backgroundColor = remaining < 0 ? 'var(--danger)' : 'var(--orange)';
    }

    renderList();
  }

  function renderList() {
    const list = document.getElementById('meal-list');
    list.innerHTML = '';
    meals.forEach((m, index) => {
      const div = document.createElement('div');
      div.className = 'meal-item';
      // Estilo simples adicionado via JS para os itens da lista
      div.style = "display: flex; justify-content: space-between; align-items: center; padding: 12px; background: var(--surface-2); border-radius: 8px; margin-bottom: 8px;";
      div.innerHTML = `
        <div class="meal-info">
          <strong style="display:block; color:var(--text);">${m.nome}</strong>
          <span style="font-size:12px; color:var(--text-dim);">${m.tipo}</span>
        </div>
        <div class="meal-kcal" style="font-weight:bold; color:var(--orange);">${m.kcal} kcal</div>
        <button class="btn-icon" data-index="${index}" style="background:transparent; border:none; color:var(--text-dim); cursor:pointer; font-size:16px;">✕</button>
      `;
      list.appendChild(div);
    });

    list.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const idx = e.currentTarget.dataset.index;
        meals.splice(idx, 1);
        await saveMeals();
        updateUI();
      });
    });
  }

  async function saveMeals() {
    try {
      if (typeof DB.saveMeals === 'function') {
        await DB.saveMeals(uid, todayStr, meals);
      } else {
        localStorage.setItem(`meals_${uid}_${todayStr}`, JSON.stringify(meals));
      }
    } catch (e) {
      console.error(e);
    }
  }

  function bindForm() {
    document.getElementById('form-meal').addEventListener('submit', async (e) => {
      e.preventDefault();
      const nome = document.getElementById('m-nome').value.trim();
      const kcal = parseInt(document.getElementById('m-kcal').value, 10);
      const tipo = document.getElementById('m-tipo').value;

      meals.push({ nome, kcal, tipo });
      await saveMeals();

      document.getElementById('form-meal').reset();
      notify('Refeição adicionada!', true);
      updateUI();
    });
  }

  async function init(userId, notifyFn) {
    uid = userId;
    notify = notifyFn;

    // Configura a data de hoje no topo da tela
    const dateOpts = { weekday: 'long', day: 'numeric', month: 'long' };
    const dateStr = new Date().toLocaleDateString('pt-BR', dateOpts);
    document.getElementById('cal-date-label').textContent = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);

    // Quando o perfil for salvo/atualizado, recalcula a meta
    document.addEventListener('fitpulse:profile-updated', loadState);
    
    bindForm();
    await loadState();
  }

  return { init };
})();