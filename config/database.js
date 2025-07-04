const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

const dbPath = path.join(__dirname, '..', 'database.sqlite');
let db;

const init = () => {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Erro ao conectar com o banco de dados:', err);
        reject(err);
      } else {
        console.log('Conectado ao banco de dados SQLite');
        createTables().then(resolve).catch(reject);
      }
    });
  });
};

const createTables = () => {
  return new Promise((resolve, reject) => {
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    db.run(createUsersTable, (err) => {
      if (err) {
        console.error('Erro ao criar tabela users:', err);
        reject(err);
      } else {
        console.log('Tabela users criada/verificada com sucesso');
        insertDefaultUsers().then(resolve).catch(reject);
      }
    });
  });
};

const insertDefaultUsers = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      // Verificar se já existem usuários
      db.get('SELECT COUNT(*) as count FROM users', async (err, row) => {
        if (err) {
          reject(err);
          return;
        }

        if (row.count === 0) {
          // Criar usuários padrão
          const defaultUsers = [
            {
              username: 'admin',
              email: 'admin@exemplo.com',
              password: await bcrypt.hash('123456', 10)
            },
            {
              username: 'usuario',
              email: 'usuario@exemplo.com',
              password: await bcrypt.hash('senha123', 10)
            },
            {
              username: 'teste',
              email: 'teste@exemplo.com',
              password: await bcrypt.hash('teste123', 10)
            }
          ];

          let insertedCount = 0;
          const totalUsers = defaultUsers.length;

          defaultUsers.forEach(user => {
            const insertUser = `
              INSERT INTO users (username, email, password)
              VALUES (?, ?, ?)
            `;

            db.run(insertUser, [user.username, user.email, user.password], (err) => {
              if (err) {
                console.error('Erro ao inserir usuário:', err);
              } else {
                console.log(`Usuário ${user.username} criado com sucesso`);
              }

              insertedCount++;
              if (insertedCount === totalUsers) {
                console.log('Usuários padrão criados com sucesso');
                resolve();
              }
            });
          });
        } else {
          console.log('Usuários já existem no banco de dados');
          resolve();
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

const getDatabase = () => {
  return db;
};

const close = () => {
  return new Promise((resolve, reject) => {
    if (db) {
      db.close((err) => {
        if (err) {
          reject(err);
        } else {
          console.log('Conexão com banco de dados fechada');
          resolve();
        }
      });
    } else {
      resolve();
    }
  });
};

module.exports = {
  init,
  getDatabase,
  close
};

