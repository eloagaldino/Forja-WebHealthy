/**
 * workout.js — monta a rotina de treino de acordo com o objetivo salvo
 * no perfil, controla checkboxes de "concluído" e o registro de carga
 * (kg) usada em cada exercício. Progresso é persistido por dia do split.
 */

const Workout = (() => {
    let uid = null;
    let notify = () => {};
    let plan = null;
    let progress = {};
    let activeDayId = null;
  
    function keyFor(objetivo, dayId, exIndex) {
      return `${objetivo}__${dayId}__${exIndex}`;
    }
  
    async function loadState() {
      const profile = await Profile.getProfile();
      const contentEl = document.getElementById('workout-content');
      const subtitleEl = document.getElementById('workout-subtitle');
      const objetivoLabel = document.getElementById('workout-objetivo-label');
  
      if (!profile || !profile.objetivo) {
        objetivoLabel.textContent = 'Seu plano';
        subtitleEl.textContent = 'Complete seu perfil para gerar o treino.';
        contentEl.innerHTML = `
          <div class="card workout-empty">
            <p>Ainda não temos seu objetivo corporal.</p>
            <p><strong>Vá até a aba Perfil</strong> e preencha seus dados para desbloquear seu treino personalizado.</p>
          </div>`;
        return;
      }
  
      plan = WORKOUT_PLANS[profile.objetivo];
      progress = await DB.getWorkoutProgress(uid);
      activeDayId = activeDayId && plan.days.some((d) => d.id === activeDayId)
        ? activeDayId
        : plan.days[0].id;
  
      objetivoLabel.textContent = plan.label;
      subtitleEl.textContent = plan.subtitle;
  
      renderDayTabs(profile.objetivo);
      renderDay(profile.objetivo);
    }
  
    function renderDayTabs(objetivo) {
      const contentEl = document.getElementById('workout-content');
      contentEl.innerHTML = '';
  
      const tabsWrap = document.createElement('div');
      tabsWrap.className = 'split-tabs';
      plan.days.forEach((day) => {
        const btn = document.createElement('button');
        btn.className = 'split-tab' + (day.id === activeDayId ? ' active' : '');
        btn.textContent = day.title.split('—')[0].trim();
        btn.addEventListener('click', () => {
          activeDayId = day.id;
          renderDayTabs(objetivo);
          renderDay(objetivo);
        });
        tabsWrap.appendChild(btn);
      });
      contentEl.appendChild(tabsWrap);
  
      const dayHolder = document.createElement('div');
      dayHolder.id = 'day-holder';
      contentEl.appendChild(dayHolder);
    }
  
    function renderDay(objetivo) {
      const day = plan.days.find((d) => d.id === activeDayId);
      const holder = document.getElementById('day-holder');
      holder.innerHTML = '';
  
      const header = document.createElement('div');
      header.className = 'workout-header';
      const doneCount = day.exercises.filter((_, i) => progress[keyFor(objetivo, day.id, i)]?.done).length;
      header.innerHTML = `
        <h3>${day.title}</h3>
        <span class="workout-progress-txt">${doneCount}/${day.exercises.length} concluídos</span>
      `;
      holder.appendChild(header);
  
      const list = document.createElement('div');
      list.className = 'exercise-list';
  
      day.exercises.forEach((ex, index) => {
        const k = keyFor(objetivo, day.id, index);
        const state = progress[k] || { done: false, carga: '' };
  
        const card = document.createElement('div');
        card.className = 'exercise-card' + (state.done ? ' done' : '');
        card.innerHTML = `
          <button class="check-box ${state.done ? 'checked' : ''}" aria-label="Marcar concluído">
            <svg viewBox="0 0 24 24" fill="none" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
          </button>
          <div class="exercise-info">
            <p class="exercise-name">${ex.name}</p>
            <p class="exercise-meta">${ex.sets} séries × ${ex.reps}</p>
          </div>
          <div class="load-field">
            <input type="number" min="0" max="500" step="0.5" placeholder="0" value="${state.carga || ''}">
            <span>kg</span>
          </div>
        `;
  
        card.querySelector('.check-box').addEventListener('click', async () => {
          state.done = !state.done;
          progress[k] = state;
          await DB.setWorkoutProgress(uid, progress);
          renderDay(objetivo);
          if (state.done) notify('Exercício concluído! 💪', true);
        });
  
        card.querySelector('.load-field input').addEventListener('change', async (e) => {
          state.carga = e.target.value;
          progress[k] = state;
          await DB.setWorkoutProgress(uid, progress);
        });
  
        list.appendChild(card);
      });
  
      holder.appendChild(list);
    }
  
    async function init(userId, notifyFn) {
      uid = userId;
      notify = notifyFn;
      document.addEventListener('fitpulse:profile-updated', loadState);
      await loadState();
    }
  
    return { init };
  })();