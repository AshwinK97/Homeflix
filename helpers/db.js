const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(":memory:");
const config = require("../config");

const createTables = () => {
  db.serialize(() => {
    db.run("CREATE TABLE users (id Integer PRIMARY KEY)");
  });
};

// return promise with connection from db pool
const getDBConnection = () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) reject(err);
      else if (connection) resolve(connection);
      else reject("error getting connection to db");
    });
  });
};

// execute query and return promise with rows
const executeQuery = (query, args) => {
  return new Promise((resolve, reject) => {
    getDBConnection()
      .then(connection => {
        connection.query(query, args, (err, rows) => {
          connection.release();
          if (err) reject(err);
          else resolve(rows);
        });
      })
      .catch(err => console.log(err));
  });
};

module.exports = { pool, executeQuery, getDBConnection };
