const bcrypt = require('bcrypt');
const db = require('../config/database');

class User {
  constructor(id, username, email, password, created_at) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.created_at = created_at;
  }

  // Buscar usuário por username
  static findByUsername(username) {
    return new Promise((resolve, reject) => {
      const database = db.getDatabase();
      const query = 'SELECT * FROM users WHERE username = ?';
      
      database.get(query, [username], (err, row) => {
        if (err) {
          reject(err);
        } else if (row) {
          const user = new User(
            row.id,
            row.username,
            row.email,
            row.password,
            row.created_at
          );
          resolve(user);
        } else {
          resolve(null);
        }
      });
    });
  }

  // Buscar usuário por ID
  static findById(id) {
    return new Promise((resolve, reject) => {
      const database = db.getDatabase();
      const query = 'SELECT * FROM users WHERE id = ?';
      
      database.get(query, [id], (err, row) => {
        if (err) {
          reject(err);
        } else if (row) {
          const user = new User(
            row.id,
            row.username,
            row.email,
            row.password,
            row.created_at
          );
          resolve(user);
        } else {
          resolve(null);
        }
      });
    });
  }

  // Buscar usuário por email
  static findByEmail(email) {
    return new Promise((resolve, reject) => {
      const database = db.getDatabase();
      const query = 'SELECT * FROM users WHERE email = ?';
      
      database.get(query, [email], (err, row) => {
        if (err) {
          reject(err);
        } else if (row) {
          const user = new User(
            row.id,
            row.username,
            row.email,
            row.password,
            row.created_at
          );
          resolve(user);
        } else {
          resolve(null);
        }
      });
    });
  }

  // Verificar senha
  async verifyPassword(password) {
    try {
      return await bcrypt.compare(password, this.password);
    } catch (error) {
      throw error;
    }
  }

  // Criar novo usuário
  static async create(username, email, password) {
    return new Promise(async (resolve, reject) => {
      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const database = db.getDatabase();
        const query = `
          INSERT INTO users (username, email, password)
          VALUES (?, ?, ?)
        `;

        database.run(query, [username, email, hashedPassword], function(err) {
          if (err) {
            reject(err);
          } else {
            // Buscar o usuário recém-criado
            User.findById(this.lastID).then(resolve).catch(reject);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  // Listar todos os usuários
  static findAll() {
    return new Promise((resolve, reject) => {
      const database = db.getDatabase();
      const query = 'SELECT * FROM users ORDER BY created_at DESC';
      
      database.all(query, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const users = rows.map(row => new User(
            row.id,
            row.username,
            row.email,
            row.password,
            row.created_at
          ));
          resolve(users);
        }
      });
    });
  }

  // Método para retornar dados seguros (sem senha)
  toSafeObject() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      created_at: this.created_at
    };
  }
}

module.exports = User;

