/**
 * login.js — controla o alternar entre login/cadastro e a autenticação.
 */

(async () => {
    // Se já existe sessão ativa, pula direto para o app.
    const existing = await DB.getSession();
    if (existing) {
      window.location.href = 'login.html';
      return;
    }
  
    const panelLogin = document.getElementById('panel-login');
    const panelRegister = document.getElementById('panel-register');
  
    document.getElementById('go-register').addEventListener('click', () => {
      panelLogin.classList.add('hidden');
      panelRegister.classList.remove('hidden');
    });
    document.getElementById('go-login').addEventListener('click', () => {
      panelRegister.classList.add('hidden');
      panelLogin.classList.remove('hidden');
    });
  
    // ------------------------------------------------------------- LOGIN
    const formLogin = document.getElementById('form-login');
    const loginError = document.getElementById('login-error');
  
    formLogin.addEventListener('submit', async (e) => {
      e.preventDefault();
      loginError.textContent = '';
      const email = document.getElementById('login-email').value.trim();
      const senha = document.getElementById('login-senha').value;
  
      try {
        await DB.loginUser({ email, senha });
        window.location.href = 'app.html';
      } catch (err) {
        loginError.textContent = err.message;
      }
    });
  
    // ---------------------------------------------------------- CADASTRO
    const formRegister = document.getElementById('form-register');
    const registerError = document.getElementById('register-error');
  
    formRegister.addEventListener('submit', async (e) => {
      e.preventDefault();
      registerError.textContent = '';
      const nome = document.getElementById('reg-nome').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const senha = document.getElementById('reg-senha').value;
  
      if (senha.length < 6) {
        registerError.textContent = 'A senha precisa ter pelo menos 6 caracteres.';
        return;
      }
  
      try {
        await DB.registerUser({ nome, email, senha });
        try {
          // Se a confirmação de e-mail estiver ativa no Supabase, este login
          // falha até o usuário clicar no link recebido — nesse caso avisamos
          // em vez de travar a tela.
          await DB.loginUser({ email, senha });
          window.location.href = 'app.html';
        } catch (loginErr) {
          registerError.style.color = 'var(--accent)';
          registerError.textContent = 'Conta criada! Verifique seu e-mail para confirmar o cadastro antes de entrar.';
        }
      } catch (err) {
        registerError.style.color = 'var(--danger)';
        registerError.textContent = err.message;
      }
    });
  })();