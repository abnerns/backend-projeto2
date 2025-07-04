const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

// Importar controllers
const authController = require('./controllers/authController');
const pageController = require('./controllers/pageController');

// Importar middleware de autenticação
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3001;

// Configurar view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configurar sessões
app.use(session({
  secret: 'meu-super-secreto-para-sessoes-2024',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Para desenvolvimento (HTTP)
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

// Middleware de segurança
app.use(authMiddleware.addUserToViews);
app.use(authMiddleware.logAuthActivity);
app.use(authMiddleware.validateSession);

// Rotas públicas
app.get('/', (req, res) => {
  if (req.session.userId) {
    res.redirect('/dashboard');
  } else {
    res.redirect('/login');
  }
});

// Rotas de autenticação
app.get('/login', authMiddleware.requireGuest, authController.showLogin);
app.post('/login', authMiddleware.rateLimit(5, 15 * 60 * 1000), authController.processLogin);
app.get('/logout', authController.logout);

// Rotas protegidas
app.get('/dashboard', authMiddleware.requireAuth, pageController.showDashboard);
app.get('/profile', authMiddleware.requireAuth, pageController.showProfile);
app.get('/settings', authMiddleware.requireAuth, pageController.showSettings);

// Rota para API de status (exemplo)
app.get('/api/status', authMiddleware.requireAuth, (req, res) => {
  res.json({
    status: 'ok',
    user: req.user,
    timestamp: new Date().toISOString()
  });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro na aplicação:', err);
  
  if (req.session) {
    req.session.error = 'Erro interno do servidor';
  }
  
  res.status(500).redirect('/login');
});

// Middleware para rotas não encontradas
app.use((req, res) => {
  if (req.session) {
    req.session.error = 'Página não encontrada';
  }
  res.status(404).redirect('/dashboard');
});

// Inicializar banco de dados e servidor
const db = require('./config/database');
db.init().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Erro ao inicializar banco de dados:', err);
});

module.exports = app;

