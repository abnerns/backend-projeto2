const User = require('../models/User');
const AuthController = require('./authController');

class PageController {
  // Exibir dashboard (página protegida)
  static async showDashboard(req, res) {
    try {
      // Obter dados do usuário atual
      const currentUser = AuthController.getCurrentUser(req);
      
      if (!currentUser) {
        req.session.error = 'Sessão expirada. Faça login novamente.';
        return res.redirect('/login');
      }

      // Buscar dados completos do usuário no banco
      const user = await User.findById(currentUser.id);
      
      if (!user) {
        req.session.error = 'Usuário não encontrado. Faça login novamente.';
        return res.redirect('/login');
      }

      // Buscar estatísticas do sistema (exemplo)
      const allUsers = await User.findAll();
      const stats = {
        totalUsers: allUsers.length,
        currentTime: new Date().toLocaleString('pt-BR'),
        sessionStart: req.session.cookie.originalMaxAge ? 
          new Date(Date.now() - (req.session.cookie.originalMaxAge - req.session.cookie.maxAge)).toLocaleString('pt-BR') : 
          'Não disponível'
      };

      // Verificar se há mensagens de sucesso ou erro
      const error = req.session.error;
      const success = req.session.success;
      
      // Limpar mensagens da sessão
      delete req.session.error;
      delete req.session.success;

      res.render('dashboard', {
        title: 'Dashboard - Sistema MVC',
        user: user.toSafeObject(),
        stats: stats,
        error: error,
        success: success
      });

    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
      req.session.error = 'Erro ao carregar página. Tente novamente.';
      res.redirect('/login');
    }
  }

  // Página de perfil do usuário (exemplo de outra página protegida)
  static async showProfile(req, res) {
    try {
      const currentUser = AuthController.getCurrentUser(req);
      
      if (!currentUser) {
        req.session.error = 'Sessão expirada. Faça login novamente.';
        return res.redirect('/login');
      }

      const user = await User.findById(currentUser.id);
      
      if (!user) {
        req.session.error = 'Usuário não encontrado. Faça login novamente.';
        return res.redirect('/login');
      }

      const error = req.session.error;
      const success = req.session.success;
      
      delete req.session.error;
      delete req.session.success;

      res.render('profile', {
        title: 'Perfil - Sistema MVC',
        user: user.toSafeObject(),
        error: error,
        success: success
      });

    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      req.session.error = 'Erro ao carregar página. Tente novamente.';
      res.redirect('/dashboard');
    }
  }

  // Página de configurações (exemplo)
  static async showSettings(req, res) {
    try {
      const currentUser = AuthController.getCurrentUser(req);
      
      if (!currentUser) {
        req.session.error = 'Sessão expirada. Faça login novamente.';
        return res.redirect('/login');
      }

      const user = await User.findById(currentUser.id);
      
      if (!user) {
        req.session.error = 'Usuário não encontrado. Faça login novamente.';
        return res.redirect('/login');
      }

      const error = req.session.error;
      const success = req.session.success;
      
      delete req.session.error;
      delete req.session.success;

      res.render('settings', {
        title: 'Configurações - Sistema MVC',
        user: user.toSafeObject(),
        error: error,
        success: success
      });

    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      req.session.error = 'Erro ao carregar página. Tente novamente.';
      res.redirect('/dashboard');
    }
  }
}

module.exports = PageController;

