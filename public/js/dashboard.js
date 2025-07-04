// JavaScript da página do dashboard

document.addEventListener('DOMContentLoaded', function() {
    initializeSidebar();
    initializeUserMenu();
    initializeCharts();
    initializeStats();
    initializeActivities();
    initializeMobileMenu();
    initializeNotifications();
});

// Inicializar sidebar
function initializeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const mainContent = document.querySelector('.main-content');
    
    if (!sidebar || !sidebarToggle) return;
    
    // Toggle sidebar
    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
        
        // Salvar estado no localStorage
        const isCollapsed = sidebar.classList.contains('collapsed');
        setLocalStorage('sidebarCollapsed', isCollapsed);
    });
    
    // Carregar estado salvo
    const savedState = getLocalStorage('sidebarCollapsed');
    if (savedState === true) {
        sidebar.classList.add('collapsed');
    }
    
    // Navegação ativa
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Remover classe ativa de todos os itens
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Adicionar classe ativa ao item clicado
            this.closest('.nav-item').classList.add('active');
            
            // Se for um link de demonstração, prevenir navegação
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
                showNotification('Esta é uma página de demonstração', 'info', 3000);
            }
        });
    });
}

// Inicializar menu do usuário
function initializeUserMenu() {
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userDropdown = document.getElementById('userDropdown');
    
    if (!userMenuBtn || !userDropdown) return;
    
    userMenuBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        userDropdown.classList.toggle('show');
    });
    
    // Fechar dropdown ao clicar fora
    document.addEventListener('click', function(e) {
        if (!userMenuBtn.contains(e.target) && !userDropdown.contains(e.target)) {
            userDropdown.classList.remove('show');
        }
    });
    
    // Links do dropdown
    const dropdownItems = userDropdown.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
                showNotification('Esta é uma página de demonstração', 'info', 3000);
            }
            userDropdown.classList.remove('show');
        });
    });
}

// Inicializar gráficos
function initializeCharts() {
    initializeActivityChart();
    initializeCategoryChart();
    initializeChartControls();
}

function initializeActivityChart() {
    const canvas = document.getElementById('activityChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Dados de exemplo
    const data = {
        labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
        datasets: [{
            label: 'Atividade',
            data: [65, 59, 80, 81, 56, 55, 40],
            borderColor: 'rgb(102, 126, 234)',
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            tension: 0.4,
            fill: true
        }]
    };
    
    drawLineChart(ctx, data);
}

function initializeCategoryChart() {
    const canvas = document.getElementById('categoryChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Dados de exemplo
    const data = {
        labels: ['Vendas', 'Marketing', 'Suporte', 'Desenvolvimento'],
        datasets: [{
            data: [30, 25, 20, 25],
            backgroundColor: [
                'rgba(102, 126, 234, 0.8)',
                'rgba(118, 75, 162, 0.8)',
                'rgba(240, 147, 251, 0.8)',
                'rgba(16, 185, 129, 0.8)'
            ]
        }]
    };
    
    drawDoughnutChart(ctx, data);
}

// Desenhar gráfico de linha simples
function drawLineChart(ctx, data) {
    const canvas = ctx.canvas;
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    
    ctx.clearRect(0, 0, width, height);
    
    // Configurações
    const chartWidth = width - (padding * 2);
    const chartHeight = height - (padding * 2);
    const maxValue = Math.max(...data.datasets[0].data);
    const minValue = Math.min(...data.datasets[0].data);
    const valueRange = maxValue - minValue;
    
    // Desenhar grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    // Linhas horizontais
    for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }
    
    // Linhas verticais
    for (let i = 0; i < data.labels.length; i++) {
        const x = padding + (chartWidth / (data.labels.length - 1)) * i;
        ctx.beginPath();
        ctx.moveTo(x, padding);
        ctx.lineTo(x, height - padding);
        ctx.stroke();
    }
    
    // Desenhar linha
    ctx.strokeStyle = data.datasets[0].borderColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    data.datasets[0].data.forEach((value, index) => {
        const x = padding + (chartWidth / (data.labels.length - 1)) * index;
        const y = height - padding - ((value - minValue) / valueRange) * chartHeight;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
    
    // Desenhar pontos
    ctx.fillStyle = data.datasets[0].borderColor;
    data.datasets[0].data.forEach((value, index) => {
        const x = padding + (chartWidth / (data.labels.length - 1)) * index;
        const y = height - padding - ((value - minValue) / valueRange) * chartHeight;
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
    });
    
    // Labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px Inter';
    ctx.textAlign = 'center';
    
    data.labels.forEach((label, index) => {
        const x = padding + (chartWidth / (data.labels.length - 1)) * index;
        ctx.fillText(label, x, height - 10);
    });
}

// Desenhar gráfico de rosca simples
function drawDoughnutChart(ctx, data) {
    const canvas = ctx.canvas;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;
    const innerRadius = radius * 0.6;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    let currentAngle = -Math.PI / 2;
    const total = data.datasets[0].data.reduce((sum, value) => sum + value, 0);
    
    data.datasets[0].data.forEach((value, index) => {
        const sliceAngle = (value / total) * 2 * Math.PI;
        
        // Desenhar fatia
        ctx.fillStyle = data.datasets[0].backgroundColor[index];
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
        ctx.closePath();
        ctx.fill();
        
        currentAngle += sliceAngle;
    });
    
    // Texto central
    ctx.fillStyle = '#374151';
    ctx.font = 'bold 16px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('Total', centerX, centerY - 5);
    ctx.font = '12px Inter';
    ctx.fillText('100%', centerX, centerY + 15);
}

// Controles dos gráficos
function initializeChartControls() {
    const chartBtns = document.querySelectorAll('.chart-btn');
    
    chartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remover classe ativa de todos os botões
            this.closest('.chart-actions').querySelectorAll('.chart-btn').forEach(b => {
                b.classList.remove('active');
            });
            
            // Adicionar classe ativa ao botão clicado
            this.classList.add('active');
            
            // Simular atualização do gráfico
            const period = this.dataset.period;
            showNotification(`Gráfico atualizado para período: ${period}`, 'success', 2000);
        });
    });
}

// Inicializar estatísticas
function initializeStats() {
    animateStats();
    initializeStatCards();
}

function animateStats() {
    const statCards = document.querySelectorAll('.stat-card');
    
    // Observador de interseção para animar quando visível
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statValue = entry.target.querySelector('h3');
                const finalValue = parseInt(statValue.textContent.replace(/[^\d]/g, ''));
                
                animateNumber(statValue, 0, finalValue, 2000);
                observer.unobserve(entry.target);
            }
        });
    });
    
    statCards.forEach(card => {
        observer.observe(card);
    });
}

function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    const originalText = element.textContent;
    const isPercentage = originalText.includes('%');
    const isCurrency = originalText.includes('R$');
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(start + (end - start) * progress);
        
        let formattedValue = current.toLocaleString('pt-BR');
        if (isCurrency) {
            formattedValue = 'R$ ' + formattedValue;
        } else if (isPercentage) {
            formattedValue = formattedValue + '%';
        }
        
        element.textContent = formattedValue;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

function initializeStatCards() {
    const statCards = document.querySelectorAll('.stat-card');
    
    statCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-4px) scale(1)';
        });
    });
}

// Inicializar atividades
function initializeActivities() {
    const activityItems = document.querySelectorAll('.activity-item');
    const viewAllBtn = document.querySelector('.view-all-btn');
    
    // Animação das atividades
    activityItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
        item.classList.add('animate-fade-in-up');
        
        // Hover effect
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(10px)';
            this.style.boxShadow = 'var(--shadow-md)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(5px)';
            this.style.boxShadow = 'none';
        });
    });
    
    // Botão ver todas
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', function() {
            showNotification('Carregando todas as atividades...', 'info', 2000);
        });
    }
    
    // Atualizar timestamps
    updateActivityTimestamps();
    setInterval(updateActivityTimestamps, 60000); // Atualizar a cada minuto
}

function updateActivityTimestamps() {
    const timeElements = document.querySelectorAll('.activity-time');
    
    timeElements.forEach(element => {
        const text = element.textContent;
        // Simular atualização de tempo (em uma aplicação real, viria do servidor)
        if (text.includes('minutos atrás')) {
            const minutes = parseInt(text.match(/\d+/)[0]) + 1;
            element.textContent = `${minutes} minutos atrás`;
        }
    });
}

// Menu mobile
function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('sidebar');
    
    if (!mobileMenuBtn || !sidebar) return;
    
    mobileMenuBtn.addEventListener('click', function() {
        sidebar.classList.toggle('show');
        
        // Adicionar overlay
        if (sidebar.classList.contains('show')) {
            createMobileOverlay();
        } else {
            removeMobileOverlay();
        }
    });
}

function createMobileOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'mobile-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 999;
        backdrop-filter: blur(2px);
    `;
    
    overlay.addEventListener('click', function() {
        document.getElementById('sidebar').classList.remove('show');
        this.remove();
    });
    
    document.body.appendChild(overlay);
}

function removeMobileOverlay() {
    const overlay = document.querySelector('.mobile-overlay');
    if (overlay) {
        overlay.remove();
    }
}

// Notificações do dashboard
function initializeNotifications() {
    const notificationBtns = document.querySelectorAll('.action-btn');
    
    notificationBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            
            if (icon.classList.contains('fa-bell')) {
                showNotification('Você tem 3 novas notificações', 'info', 3000);
            } else if (icon.classList.contains('fa-envelope')) {
                showNotification('Você tem 5 novas mensagens', 'info', 3000);
            }
        });
    });
}

// Confirmação de logout
function confirmLogout() {
    return confirm('Tem certeza que deseja sair do sistema?');
}

// Atualização automática de dados
function startAutoRefresh() {
    setInterval(() => {
        // Simular atualização de dados
        updateDashboardData();
    }, 30000); // Atualizar a cada 30 segundos
}

function updateDashboardData() {
    // Simular atualização silenciosa de dados
    console.log('Atualizando dados do dashboard...');
    
    // Em uma aplicação real, faria requisições AJAX aqui
    // makeRequest('/api/dashboard/stats').then(data => {
    //     updateStats(data);
    // });
}

// Inicializar atualização automática
startAutoRefresh();

// Exportar funções globais
window.confirmLogout = confirmLogout;

