// JavaScript principal - Funcionalidades globais

// Aguardar carregamento do DOM
document.addEventListener('DOMContentLoaded', function() {
    initializeNotifications();
    initializeLoadingOverlay();
    initializeGlobalEventListeners();
});

// Sistema de notificações
function initializeNotifications() {
    // Auto-fechar notificações após 5 segundos
    const notifications = document.querySelectorAll('.notification');
    notifications.forEach(notification => {
        if (notification.classList.contains('show')) {
            setTimeout(() => {
                closeNotification(notification.querySelector('.close-btn'));
            }, 5000);
        }
    });
}

function closeNotification(button) {
    const notification = button.closest('.notification');
    if (notification) {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        
        setTimeout(() => {
            notification.remove();
        }, 300);
    }
}

function showNotification(message, type = 'info', duration = 5000) {
    const container = document.getElementById('notifications') || createNotificationContainer();
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const iconMap = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    notification.innerHTML = `
        <i class="${iconMap[type] || iconMap.info}"></i>
        <span>${message}</span>
        <button class="close-btn" onclick="closeNotification(this)">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto-close
    if (duration > 0) {
        setTimeout(() => {
            closeNotification(notification.querySelector('.close-btn'));
        }, duration);
    }
    
    return notification;
}

function createNotificationContainer() {
    const container = document.createElement('div');
    container.id = 'notifications';
    container.className = 'notifications-container';
    document.body.appendChild(container);
    return container;
}

// Loading overlay
function initializeLoadingOverlay() {
    const overlay = document.getElementById('loading-overlay');
    if (!overlay) {
        createLoadingOverlay();
    }
}

function createLoadingOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'loading-overlay';
    overlay.className = 'loading-overlay hidden';
    overlay.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p>Carregando...</p>
        </div>
    `;
    document.body.appendChild(overlay);
}

function showLoading(message = 'Carregando...') {
    const overlay = document.getElementById('loading-overlay');
    const text = overlay.querySelector('p');
    if (text) text.textContent = message;
    
    overlay.classList.remove('hidden');
    overlay.classList.add('show');
}

function hideLoading() {
    const overlay = document.getElementById('loading-overlay');
    overlay.classList.remove('show');
    
    setTimeout(() => {
        overlay.classList.add('hidden');
    }, 300);
}

// Event listeners globais
function initializeGlobalEventListeners() {
    // Fechar dropdowns ao clicar fora
    document.addEventListener('click', function(e) {
        const dropdowns = document.querySelectorAll('.user-dropdown.show');
        dropdowns.forEach(dropdown => {
            if (!dropdown.closest('.user-menu').contains(e.target)) {
                dropdown.classList.remove('show');
            }
        });
    });
    
    // Atalhos de teclado
    document.addEventListener('keydown', function(e) {
        // ESC para fechar modais/dropdowns
        if (e.key === 'Escape') {
            const dropdowns = document.querySelectorAll('.user-dropdown.show');
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('show');
            });
            
            const modals = document.querySelectorAll('.modal.show');
            modals.forEach(modal => {
                modal.classList.remove('show');
            });
        }
    });
    
    // Smooth scroll para links âncora
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Utilitários
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Validação de formulários
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    // Mínimo 6 caracteres
    return password.length >= 6;
}

function validateRequired(value) {
    return value && value.trim().length > 0;
}

// Formatação
function formatDate(date, locale = 'pt-BR') {
    return new Date(date).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatTime(date, locale = 'pt-BR') {
    return new Date(date).toLocaleTimeString(locale, {
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatDateTime(date, locale = 'pt-BR') {
    return new Date(date).toLocaleString(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Animações
function fadeIn(element, duration = 300) {
    element.style.opacity = '0';
    element.style.display = 'block';
    
    let start = null;
    function animate(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const opacity = Math.min(progress / duration, 1);
        
        element.style.opacity = opacity;
        
        if (progress < duration) {
            requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
}

function fadeOut(element, duration = 300) {
    let start = null;
    const initialOpacity = parseFloat(getComputedStyle(element).opacity);
    
    function animate(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const opacity = Math.max(initialOpacity - (progress / duration), 0);
        
        element.style.opacity = opacity;
        
        if (progress < duration) {
            requestAnimationFrame(animate);
        } else {
            element.style.display = 'none';
        }
    }
    
    requestAnimationFrame(animate);
}

function slideUp(element, duration = 300) {
    const height = element.offsetHeight;
    element.style.height = height + 'px';
    element.style.overflow = 'hidden';
    element.style.transition = `height ${duration}ms ease-out`;
    
    setTimeout(() => {
        element.style.height = '0px';
    }, 10);
    
    setTimeout(() => {
        element.style.display = 'none';
        element.style.height = '';
        element.style.overflow = '';
        element.style.transition = '';
    }, duration);
}

function slideDown(element, duration = 300) {
    element.style.display = 'block';
    const height = element.scrollHeight;
    element.style.height = '0px';
    element.style.overflow = 'hidden';
    element.style.transition = `height ${duration}ms ease-out`;
    
    setTimeout(() => {
        element.style.height = height + 'px';
    }, 10);
    
    setTimeout(() => {
        element.style.height = '';
        element.style.overflow = '';
        element.style.transition = '';
    }, duration);
}

// Requisições AJAX
async function makeRequest(url, options = {}) {
    const defaultOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    };
    
    const config = { ...defaultOptions, ...options };
    
    try {
        showLoading();
        const response = await fetch(url, config);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Request failed:', error);
        showNotification('Erro na requisição. Tente novamente.', 'error');
        throw error;
    } finally {
        hideLoading();
    }
}

// Cookies
function setCookie(name, value, days = 7) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

// Local Storage
function setLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

function getLocalStorage(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return null;
    }
}

function removeLocalStorage(key) {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error('Error removing from localStorage:', error);
    }
}

// Exportar funções globais
window.closeNotification = closeNotification;
window.showNotification = showNotification;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.makeRequest = makeRequest;
window.validateEmail = validateEmail;
window.validatePassword = validatePassword;
window.validateRequired = validateRequired;
window.formatDate = formatDate;
window.formatTime = formatTime;
window.formatDateTime = formatDateTime;

