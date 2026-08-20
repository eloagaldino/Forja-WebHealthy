/**
 * profile.js — cadastro/edição de dados pessoais e cálculo de IMC.
 * Dispara um evento customizado 'fitpulse:profile-updated' sempre que
 * o perfil muda, para que outras abas (Calorias, Treino) reajam.
 */

const Profile = (() => {
    let uid = null;
    let notify = () => {};
  
    const RING_CIRC = 2 * Math.PI * 78; // ~490
  
    function classifyIMC(imc) {
      if (imc < 18.5) return { label: 'Abaixo do peso', color: '#4d9dff' };
      if (imc < 25) return { label: 'Peso normal', color: 'var(--accent)' };
      if (imc < 30) return { label: 'Sobrepeso', color: 'var(--warn)' };
      return { label: 'Obesidade', color: 'var(--danger)' };
    }
  
    function paintIMC(peso, alturaCm) {
      const ring = document.getElementById('imc-ring-fill');
      const valueEl = document.getElementById('imc-value');
      const badgeEl = document.getElementById('imc-badge');
      const emptyEl = document.getElementById('imc-empty');
  
      if (!peso || !alturaCm) {
        valueEl.textContent = '--';
        badgeEl.textContent = 'Sem dados';
        badgeEl.style.background = 'var(--surface-3)';
        badgeEl.style.color = 'var(--text-dim)';
        ring.style.strokeDashoffset = RING_CIRC;
        emptyEl.classList.remove('hidden');
        return null;
      }
  
      const alturaM = alturaCm / 100;
      const imc = peso / (alturaM * alturaM);
      const { label, color } = classifyIMC(imc);
  
      // Mapeia IMC (15 a 40) para 0-100% do aro, só para dar sensação de progresso visual.
      const pct = Math.min(Math.max((imc - 15) / (40 - 15), 0.04), 1);
      ring.style.stroke = color;
      ring.style.strokeDashoffset = String(RING_CIRC * (1 - pct));
  
      valueEl.textContent = imc.toFixed(1);
      badgeEl.textContent = label;
      badgeEl.style.background = color;
      badgeEl.style.color = '#08170e';
      emptyEl.classList.add('hidden');
  
      return imc;
    }
  
    async function loadIntoForm() {
      const profile = await DB.getProfile(uid);
      if (!profile) return null;
      document.getElementById('p-nome').value = profile.nome || '';
      document.getElementById('p-idade').value = profile.idade || '';
      document.getElementById('p-genero').value = profile.genero || '';
      document.getElementById('p-peso').value = profile.peso || '';
      document.getElementById('p-altura').value = profile.altura || '';
      document.getElementById('p-objetivo').value = profile.objetivo || '';
      paintIMC(profile.peso, profile.altura);
      return profile;
    }
  
    function livePreview() {
      const peso = parseFloat(document.getElementById('p-peso').value);
      const altura = parseFloat(document.getElementById('p-altura').value);
      paintIMC(peso, altura);
    }
  
    function bindForm() {
      ['p-peso', 'p-altura'].forEach((id) => {
        document.getElementById(id).addEventListener('input', livePreview);
      });
  
      document.getElementById('form-profile').addEventListener('submit', async (e) => {
        e.preventDefault();
        const profile = {
          nome: document.getElementById('p-nome').value.trim(),
          idade: parseInt(document.getElementById('p-idade').value, 10),
          genero: document.getElementById('p-genero').value,
          peso: parseFloat(document.getElementById('p-peso').value),
          altura: parseFloat(document.getElementById('p-altura').value),
          objetivo: document.getElementById('p-objetivo').value,
        };
  
        await DB.saveProfile(uid, profile);
        paintIMC(profile.peso, profile.altura);
        document.getElementById('profile-msg').textContent = '';
        notify('Dados salvos com sucesso!', true);
  
        document.dispatchEvent(new CustomEvent('fitpulse:profile-updated', { detail: profile }));
      });
    }
  
    async function init(userId, notifyFn) {
      uid = userId;
      notify = notifyFn;
      bindForm();
      await loadIntoForm();
    }
  
    return { init, getProfile: () => DB.getProfile(uid) };
  })();