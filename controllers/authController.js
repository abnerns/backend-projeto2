const User = require('../models/User');

class AuthController {
  // Exibir página de login
  static showLogin(req, res) {
    // Se já estiver logado, redirecionar para dashboard
    if (req.session.userId) {
      return res.redirect('/dashboard');
    }

    // Verificar se há mensagens de erro ou sucesso
    const error = req.session.error;
    const success = req.session.success;
    
    // Limpar mensagens da sessão
    delete req.session.error;
    delete req.session.success;

    res.render('login', { 
      title: 'Login - Sistema MVC',
      error: error,
      success: success
    });
  }

  // Processar login
  static async processLogin(req, res) {
    try {
      const { username, password } = req.body;

      // Validar campos obrigatórios
      if (!username || !password) {
        req.session.error = 'Por favor, preencha todos os campos';
        return res.redirect('/login');
      }

      // Buscar usuário no banco de dados
      const user = await User.findByUsername(username);
      
      if (!user) {
        req.session.error = 'Usuário ou senha incorretos';
        return res.redirect('/login');
      }

      // Verificar senha
      const isPasswordValid = await user.verifyPassword(password);
      
      if (!isPasswordValid) {
        req.session.error = 'Usuário ou senha incorretos';
        return res.redirect('/login');
      }

      // Login bem-sucedido - criar sessão
      req.session.userId = user.id;
      req.session.username = user.username;
      req.session.email = user.email;
      
      // Regenerar ID da sessão por segurança
      req.session.regenerate((err) => {
        if (err) {
          console.error('Erro ao regenerar sessão:', err);
          req.session.error = 'Erro interno do servidor';
          return res.redirect('/login');
        }

        // Restaurar dados da sessão após regeneração
        req.session.userId = user.id;
        req.session.username = user.username;
        req.session.email = user.email;

        req.session.success = `Bem-vindo, ${user.username}!`;
        res.redirect('/dashboard');
      });

    } catch (error) {
      console.error('Erro no processo de login:', error);
      req.session.error = 'Erro interno do servidor';
      res.redirect('/login');
    }
  }

  // Logout
  static logout(req, res) {
    const username = req.session.username;
    
    req.session.destroy((err) => {
      if (err) {
        console.error('Erro ao fazer logout:', err);
        return res.redirect('/dashboard');
      }

      // Limpar cookie da sessão
      res.clearCookie('connect.sid');
      
      // Redirecionar para login com mensagem de sucesso
      res.redirect('/login');
    });
  }

  // Verificar se usuário está autenticado (método auxiliar)
  static isAuthenticated(req) {
    return req.session && req.session.userId;
  }

  // Obter usuário atual da sessão
  static getCurrentUser(req) {
    if (AuthController.isAuthenticated(req)) {
      return {
        id: req.session.userId,
        username: req.session.username,
        email: req.session.email
      };
    }
    return null;
  }
}

module.exports = AuthController;

