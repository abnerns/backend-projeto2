// Middleware de autenticação

const User = require('../models/User');

class AuthMiddleware {
  // Middleware para verificar se o usuário está autenticado
  static requireAuth(req, res, next) {
    // Verificar se existe sessão ativa
    if (!req.session || !req.session.userId) {
      // Salvar URL de destino para redirecionamento após login
      req.session.redirectTo = req.originalUrl;
      req.session.error = 'Você precisa fazer login para acessar esta página';
      return res.redirect('/login');
    }

    // Verificar se a sessão não expirou
    if (req.session.cookie && req.session.cookie.maxAge <= 0) {
      req.session.destroy((err) => {
        if (err) {
          console.error('Erro ao destruir sessão expirada:', err);
        }
      });
      
      req.session = {};
      req.session.error = 'Sua sessão expirou. Faça login novamente';
      return res.redirect('/login');
    }

    // Verificar se o usuário ainda existe no banco de dados
    User.findById(req.session.userId)
      .then(user => {
        if (!user) {
          // Usuário não encontrado, destruir sessão
          req.session.destroy((err) => {
            if (err) {
              console.error('Erro ao destruir sessão de usuário inexistente:', err);
            }
          });
          
          return res.redirect('/login?error=user_not_found');
        }

        // Adicionar dados do usuário à requisição
        req.user = user.toSafeObject();
        next();
      })
      .catch(err => {
        console.error('Erro ao verificar usuário na sessão:', err);
        req.session.error = 'Erro interno do servidor';
        res.redirect('/login');
      });
  }

  // Middleware para verificar se o usuário NÃO está autenticado
  static requireGuest(req, res, next) {
    if (req.session && req.session.userId) {
      // Usuário já está logado, redirecionar para dashboard
      return res.redirect('/dashboard');
    }
    next();
  }

  // Middleware para verificar permissões específicas
  static requireRole(roles) {
    return (req, res, next) => {
      if (!req.session || !req.session.userId) {
        req.session.error = 'Acesso negado. Faça login primeiro';
        return res.redirect('/login');
      }

      User.findById(req.session.userId)
        .then(user => {
          if (!user) {
            req.session.error = 'Usuário não encontrado';
            return res.redirect('/login');
          }

          // Verificar se o usuário tem uma das roles necessárias
          const userRole = user.role || 'user'; // Role padrão
          const allowedRoles = Array.isArray(roles) ? roles : [roles];
          
          if (!allowedRoles.includes(userRole)) {
            req.session.error = 'Você não tem permissão para acessar esta página';
            return res.redirect('/dashboard');
          }

          req.user = user.toSafeObject();
          next();
        })
        .catch(err => {
          console.error('Erro ao verificar permissões:', err);
          req.session.error = 'Erro interno do servidor';
          res.redirect('/login');
        });
    };
  }

  // Middleware para adicionar dados do usuário a todas as views
  static addUserToViews(req, res, next) {
    res.locals.currentUser = null;
    res.locals.isAuthenticated = false;

    if (req.session && req.session.userId) {
      res.locals.currentUser = {
        id: req.session.userId,
        username: req.session.username,
        email: req.session.email
      };
      res.locals.isAuthenticated = true;
    }

    next();
  }

  // Middleware para logging de atividades de autenticação
  static logAuthActivity(req, res, next) {
    const originalSend = res.send;
    
    res.send = function(data) {
      // Log da atividade
      const activity = {
        timestamp: new Date().toISOString(),
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
        method: req.method,
        url: req.originalUrl,
        userId: req.session ? req.session.userId : null,
        statusCode: res.statusCode
      };

      // Em uma aplicação real, salvaria no banco de dados ou arquivo de log
      if (req.originalUrl.includes('/login') || req.originalUrl.includes('/logout')) {
        console.log('Auth Activity:', JSON.stringify(activity, null, 2));
      }

      originalSend.call(this, data);
    };

    next();
  }

  // Middleware para proteção CSRF (básico)
  static csrfProtection(req, res, next) {
    if (req.method === 'GET') {
      // Gerar token CSRF para formulários
      req.session.csrfToken = generateCSRFToken();
      res.locals.csrfToken = req.session.csrfToken;
      return next();
    }

    // Verificar token CSRF em requisições POST/PUT/DELETE
    const token = req.body._csrf || req.headers['x-csrf-token'];
    
    if (!token || token !== req.session.csrfToken) {
      req.session.error = 'Token de segurança inválido. Tente novamente';
      return res.redirect('back');
    }

    next();
  }

  // Middleware para rate limiting básico
  static rateLimit(maxRequests = 5, windowMs = 15 * 60 * 1000) {
    const requests = new Map();

    return (req, res, next) => {
      const key = req.ip || req.connection.remoteAddress;
      const now = Date.now();
      
      // Limpar registros antigos
      for (const [ip, data] of requests.entries()) {
        if (now - data.firstRequest > windowMs) {
          requests.delete(ip);
        }
      }

      // Verificar limite para este IP
      const requestData = requests.get(key);
      
      if (!requestData) {
        requests.set(key, {
          count: 1,
          firstRequest: now
        });
        return next();
      }

      if (requestData.count >= maxRequests) {
        req.session.error = 'Muitas tentativas de login. Tente novamente em 15 minutos';
        return res.status(429).redirect('/login');
      }

      requestData.count++;
      next();
    };
  }

  // Middleware para validar força da sessão
  static validateSession(req, res, next) {
    if (!req.session || !req.session.userId) {
      return next();
    }

    // Verificar se a sessão não expirou
    if (req.session.cookie && req.session.cookie.maxAge <= 0) {
      req.session.destroy((err) => {
        if (err) {
          console.error('Erro ao destruir sessão expirada:', err);
        }
      });
      
      return res.redirect('/login');
    }

    // Regenerar ID da sessão periodicamente
    const lastRegeneration = req.session.lastRegeneration || 0;
    const regenerationInterval = 30 * 60 * 1000; // 30 minutos

    if (Date.now() - lastRegeneration > regenerationInterval) {
      const userId = req.session.userId;
      const username = req.session.username;
      const email = req.session.email;
      
      req.session.regenerate((err) => {
        if (err) {
          console.error('Erro ao regenerar sessão:', err);
          return next();
        }

        // Restaurar dados da sessão
        req.session.userId = userId;
        req.session.username = username;
        req.session.email = email;
        req.session.lastRegeneration = Date.now();
        
        next();
      });
    } else {
      next();
    }
  }

  // Middleware para detectar múltiplas sessões
  static detectMultipleSessions(req, res, next) {
    if (!req.session || !req.session.userId) {
      return next();
    }

    // Em uma aplicação real, verificaria sessões ativas no banco de dados
    // Por agora, apenas adiciona informação à sessão
    req.session.sessionId = req.sessionID;
    req.session.lastActivity = Date.now();

    next();
  }
}

// Função auxiliar para gerar token CSRF
function generateCSRFToken() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

module.exports = AuthMiddleware;

