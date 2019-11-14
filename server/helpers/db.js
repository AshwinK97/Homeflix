const sqlite3 = require("sqlite3").verbose();
const config = require("../config");

const openDB = () => {
  let db = new sqlite3.Database(`./db/${config.dbname}`, err => {
    if (err) return console.error(err.message);
    console.log(`Connected to SQlite database: ./db/${config.dbname}.`);
  });
  return db;
};

const closeDB = db => {
  db.close(err => {
    if (err) return console.error(err.message);
    console.log("Closed the database connection.");
  });
};

const select = (query, args) => {
  let db = openDB();
  db.serialize(() => {
    db.get(query, args, (err, row) => {
      if (err) return console.error(err.message);
      return row;
    });
  });
  closeDB(db);
};

const createTables = () => {
  let db = openDB();
  db.serialize(() => {
    db.run(config.createUsersQuery);
    db.run(
      "INSERT INTO users(username, password) VALUES(?, ?)",
      ["admin", "1234"],
      err => {
        if (err) return console.error(err.message);
        console.log("Users table created and populated.");
      }
    );

    db.run(config.createVideosQuery);
    db.run(
      "INSERT INTO videos(name, path) VALUES(?, ?)",
      ["Apex cucks Fornite", "./videos/apex.mp4"],
      err => {
        if (err) return console.error(err.message);
        console.log("Videos table created and populated.");
      }
    );

    db.run(config.createUserVideoQuery);
  });
  closeDB(db);
};

const getVideoPath = id => {
  let query = "SELECT path from ";
};

module.exports = { createTables, getVideoPath };
