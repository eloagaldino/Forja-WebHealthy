
const supabaseClient = window.supabase.createClient('https://lxulnsbyltzohejpufli.supabase.co', 'sb_publishable_bz-eYZdMXSLXB6XDtKFpcA_vVYO5Ssf');

const DB = (() => {
  function sessionFromUser(user) {
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      nome: user.user_metadata?.nome || user.email.split('@')[0],
    };
  }

  function traduzErro(error) {
    const msg = error?.message || '';
    if (msg.includes('already registered') || msg.includes('already exists')) {
      return 'Já existe uma conta com este e-mail.';
    }
    if (msg.includes('Invalid login credentials')) {
      return 'E-mail ou senha incorretos.';
    }
    if (msg.toLowerCase().includes('password') && msg.toLowerCase().includes('least')) {
      return 'A senha precisa ter pelo menos 6 caracteres.';
    }
    if (msg.includes('Email not confirmed')) {
      return 'Confirme seu e-mail antes de entrar (verifique sua caixa de entrada).';
    }
    return msg || 'Ocorreu um erro. Tente novamente.';
  }

  // ---------------------------------------------------------------- AUTH

  async function registerUser({ nome, email, senha }) {
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password: senha,
      options: { data: { nome } },
    });
    if (error) throw new Error(traduzErro(error));
    return sessionFromUser(data.user);
  }

  async function loginUser({ email, senha }) {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password: senha,
    });
    if (error) throw new Error(traduzErro(error));
    return sessionFromUser(data.user);
  }

  async function getSession() {
    const { data, error } = await supabaseClient.auth.getSession();
    if (error) return null;
    return sessionFromUser(data.session?.user);
  }

  async function logout() {
    await supabaseClient.auth.signOut();
  }

  // ------------------------------------------------------------- PROFILE

  async function getProfile(uid) {
    const { data, error } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', uid)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  }

  async function saveProfile(uid, profile) {
    const { error } = await supabaseClient
      .from('profiles')
      .upsert({ id: uid, ...profile, updated_at: new Date().toISOString() });
    if (error) throw new Error(error.message);
    return profile;
  }

  // --------------------------------------------------------------- MEALS

  async function getMealsForDate(uid, dateStr) {
    const { data, error } = await supabaseClient
      .from('meals')
      .select('*')
      .eq('user_id', uid)
      .eq('date', dateStr)
      .order('created_at', { ascending: true });
    if (error) throw new Error(error.message);
    return data.map((m) => ({ id: m.id, nome: m.nome, kcal: m.kcal, tipo: m.tipo }));
  }

  async function addMeal(uid, dateStr, meal) {
    const { data, error } = await supabaseClient
      .from('meals')
      .insert({ user_id: uid, date: dateStr, nome: meal.nome, kcal: meal.kcal, tipo: meal.tipo })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return { id: data.id, nome: data.nome, kcal: data.kcal, tipo: data.tipo };
  }

  async function removeMeal(uid, dateStr, mealId) {
    const { error } = await supabaseClient
      .from('meals')
      .delete()
      .eq('id', mealId)
      .eq('user_id', uid);
    if (error) throw new Error(error.message);
  }

  // ------------------------------------------------------------- WORKOUT

  async function getWorkoutProgress(uid) {
    const { data, error } = await supabaseClient
      .from('workout_progress')
      .select('key, done, carga')
      .eq('user_id', uid);
    if (error) throw new Error(error.message);
    const map = {};
    (data || []).forEach((row) => {
      map[row.key] = { done: row.done, carga: row.carga || '' };
    });
    return map;
  }

  // Grava só a chave que mudou (mais leve que reescrever o mapa inteiro).
  async function setWorkoutProgress(uid, progress) {
    const rows = Object.entries(progress).map(([key, val]) => ({
      user_id: uid,
      key,
      done: !!val.done,
      carga: val.carga || '',
      updated_at: new Date().toISOString(),
    }));
    if (!rows.length) return progress;
    const { error } = await supabaseClient
      .from('workout_progress')
      .upsert(rows, { onConflict: 'user_id,key' });
    if (error) throw new Error(error.message);
    return progress;
  }

  return {
    registerUser,
    loginUser,
    getSession,
    logout,
    getProfile,
    saveProfile,
    getMealsForDate,
    addMeal,
    removeMeal,
    getWorkoutProgress,
    setWorkoutProgress,
  };
})();
