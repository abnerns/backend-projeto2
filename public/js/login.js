// JavaScript da página de login

document.addEventListener('DOMContentLoaded', function() {
    initializeLoginForm();
    initializeDemoAccounts();
    initializePasswordToggle();
    initializeFormAnimations();
});

// Inicializar formulário de login
function initializeLoginForm() {
    const form = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('loginBtn');
    const rememberMe = document.getElementById('rememberMe');
    
    if (!form) return;
    
    // Carregar dados salvos
    loadSavedCredentials();
    
    // Validação em tempo real
    usernameInput.addEventListener('input', debounce(validateUsername, 300));
    passwordInput.addEventListener('input', debounce(validatePassword, 300));
    
    // Submit do formulário
    form.addEventListener('submit', handleFormSubmit);
    
    // Enter nos campos
    usernameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            passwordInput.focus();
        }
    });
    
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            form.dispatchEvent(new Event('submit'));
        }
    });
    
    // Lembrar credenciais
    rememberMe.addEventListener('change', function() {
        if (this.checked) {
            showNotification('Suas credenciais serão lembradas neste dispositivo', 'info', 3000);
        }
    });
}

// Validar username
function validateUsername() {
    const input = document.getElementById('username');
    const value = input.value.trim();
    
    clearFieldError(input);
    
    if (!value) {
        showFieldError(input, 'Nome de usuário é obrigatório');
        return false;
    }
    
    if (value.length < 3) {
        showFieldError(input, 'Nome de usuário deve ter pelo menos 3 caracteres');
        return false;
    }
    
    showFieldSuccess(input);
    return true;
}

// Validar senha
function validatePassword() {
    const input = document.getElementById('password');
    const value = input.value;
    
    clearFieldError(input);
    
    if (!value) {
        showFieldError(input, 'Senha é obrigatória');
        return false;
    }
    
    if (value.length < 6) {
        showFieldError(input, 'Senha deve ter pelo menos 6 caracteres');
        return false;
    }
    
    showFieldSuccess(input);
    return true;
}

// Mostrar erro no campo
function showFieldError(input, message) {
    const formGroup = input.closest('.form-group');
    const border = formGroup.querySelector('.input-border');
    
    // Remover classes existentes
    input.classList.remove('success');
    input.classList.add('error');
    
    if (border) {
        border.style.background = 'var(--error-color)';
        border.style.width = '100%';
    }
    
    // Criar ou atualizar mensagem de erro
    let errorMsg = formGroup.querySelector('.error-message');
    if (!errorMsg) {
        errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        formGroup.appendChild(errorMsg);
    }
    
    errorMsg.textContent = message;
    errorMsg.style.color = 'var(--error-color)';
    errorMsg.style.fontSize = 'var(--font-size-xs)';
    errorMsg.style.marginTop = '0.5rem';
    errorMsg.style.animation = 'fadeInUp 0.3s ease-out';
}

// Mostrar sucesso no campo
function showFieldSuccess(input) {
    const formGroup = input.closest('.form-group');
    const border = formGroup.querySelector('.input-border');
    
    input.classList.remove('error');
    input.classList.add('success');
    
    if (border) {
        border.style.background = 'var(--success-color)';
    }
    
    // Remover mensagem de erro
    const errorMsg = formGroup.querySelector('.error-message');
    if (errorMsg) {
        errorMsg.remove();
    }
}

// Limpar erro do campo
function clearFieldError(input) {
    const formGroup = input.closest('.form-group');
    const border = formGroup.querySelector('.input-border');
    
    input.classList.remove('error', 'success');
    
    if (border) {
        border.style.background = 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))';
        border.style.width = '0';
    }
    
    const errorMsg = formGroup.querySelector('.error-message');
    if (errorMsg) {
        errorMsg.remove();
    }
}

// Manipular submit do formulário
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const username = formData.get('username');
    const password = formData.get('password');
    const rememberMe = formData.get('rememberMe') === 'on';
    
    // Validar campos
    const isUsernameValid = validateUsername();
    const isPasswordValid = validatePassword();
    
    if (!isUsernameValid || !isPasswordValid) {
        showNotification('Por favor, corrija os erros no formulário', 'error');
        return;
    }
    
    // Mostrar loading
    setLoginButtonLoading(true);
    showLoading('Verificando credenciais...');
    
    try {
        // Salvar credenciais se solicitado
        if (rememberMe) {
            saveCredentials(username);
        } else {
            clearSavedCredentials();
        }
        
        // Simular delay para melhor UX
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Submeter formulário
        form.submit();
        
    } catch (error) {
        console.error('Erro no login:', error);
        showNotification('Erro ao fazer login. Tente novamente.', 'error');
        setLoginButtonLoading(false);
        hideLoading();
    }
}

// Controlar estado de loading do botão
function setLoginButtonLoading(loading) {
    const btn = document.getElementById('loginBtn');
    const btnText = btn.querySelector('.btn-text');
    const btnLoading = btn.querySelector('.btn-loading');
    
    if (loading) {
        btn.disabled = true;
        btnText.classList.add('hidden');
        btnLoading.classList.remove('hidden');
    } else {
        btn.disabled = false;
        btnText.classList.remove('hidden');
        btnLoading.classList.add('hidden');
    }
}

// Toggle de visibilidade da senha
function initializePasswordToggle() {
    const toggleBtn = document.querySelector('.toggle-password');
    if (!toggleBtn) return;
    
    toggleBtn.addEventListener('click', togglePassword);
}

function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('toggleIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.className = 'fas fa-eye-slash';
    } else {
        passwordInput.type = 'password';
        toggleIcon.className = 'fas fa-eye';
    }
    
    // Manter foco no input
    passwordInput.focus();
}

// Contas de demonstração
function initializeDemoAccounts() {
    const demoAccounts = document.querySelectorAll('.demo-account');
    
    demoAccounts.forEach(account => {
        account.addEventListener('click', function() {
            const text = this.textContent;
            const match = text.match(/(\w+)\s*\/\s*(\w+)/);
            
            if (match) {
                const username = match[1];
                const password = match[2];
                
                fillCredentials(username, password);
                showNotification(`Credenciais preenchidas: ${username}`, 'success', 2000);
            }
        });
    });
}

// Preencher credenciais
function fillCredentials(username, password) {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    
    // Animação de digitação
    typeText(usernameInput, username, () => {
        typeText(passwordInput, password);
    });
}

// Efeito de digitação
function typeText(input, text, callback) {
    input.value = '';
    input.focus();
    
    let i = 0;
    const interval = setInterval(() => {
        input.value += text[i];
        i++;
        
        if (i >= text.length) {
            clearInterval(interval);
            input.dispatchEvent(new Event('input'));
            if (callback) callback();
        }
    }, 100);
}

// Salvar credenciais
function saveCredentials(username) {
    try {
        setLocalStorage('rememberedUsername', username);
        setCookie('rememberLogin', 'true', 30);
    } catch (error) {
        console.error('Erro ao salvar credenciais:', error);
    }
}

// Carregar credenciais salvas
function loadSavedCredentials() {
    try {
        const rememberedUsername = getLocalStorage('rememberedUsername');
        const rememberLogin = getCookie('rememberLogin');
        
        if (rememberedUsername && rememberLogin === 'true') {
            const usernameInput = document.getElementById('username');
            const rememberMe = document.getElementById('rememberMe');
            
            usernameInput.value = rememberedUsername;
            rememberMe.checked = true;
            
            // Focar no campo de senha
            document.getElementById('password').focus();
        }
    } catch (error) {
        console.error('Erro ao carregar credenciais:', error);
    }
}

// Limpar credenciais salvas
function clearSavedCredentials() {
    try {
        removeLocalStorage('rememberedUsername');
        deleteCookie('rememberLogin');
    } catch (error) {
        console.error('Erro ao limpar credenciais:', error);
    }
}

// Animações do formulário
function initializeFormAnimations() {
    const formGroups = document.querySelectorAll('.form-group');
    
    formGroups.forEach((group, index) => {
        group.style.animationDelay = `${index * 0.1}s`;
        group.classList.add('animate-fade-in-up');
    });
    
    // Animação do botão
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.style.animationDelay = `${formGroups.length * 0.1}s`;
        loginBtn.classList.add('animate-fade-in-up');
    }
    
    // Animação das informações de demo
    const demoInfo = document.querySelector('.demo-info');
    if (demoInfo) {
        demoInfo.style.animationDelay = `${(formGroups.length + 1) * 0.1}s`;
        demoInfo.classList.add('animate-fade-in-up');
    }
}

// Adicionar estilos CSS dinâmicos
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .form-group input.error {
            border-color: var(--error-color);
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }
        
        .form-group input.success {
            border-color: var(--success-color);
            box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }
        
        .error-message {
            display: block;
            margin-top: 0.5rem;
            font-size: var(--font-size-xs);
            color: var(--error-color);
            animation: fadeInUp 0.3s ease-out;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}

// Inicializar estilos dinâmicos
addDynamicStyles();

// Exportar funções
window.togglePassword = togglePassword;

