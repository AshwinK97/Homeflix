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

const selectRow = (query, args) => {
  let db = openDB();
  return new Promise((resolve, reject) => {
    db.get(query, args, (err, row) => {
      closeDB(db);
      if (err) reject(err);
      resolve(row);
    });
  });
};

const selectAll = (query, args) => {
  let db = openDB();
  return new Promise((resolve, reject) => {
    db.all(query, args, (err, rows) => {
      closeDB(db);
      if (err) reject(err);
      resolve(rows);
    });
  });
};

const insert = (query, args) => {
  let db = openDB();
  return new Promise((resolve, reject) => {
    db.run(query, args, err => {
      closeDB(db);
      if (err) reject(err);
      resolve("success");
    });
  });
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

const getUser = username => {
  console.log(`Looking up user: ${username} in database.`);
  return selectRow("SELECT * FROM users WHERE username = ?", [username]);
};

const addUser = (username, password) => {
  console.log(`Adding user: ${username} to database.`);
  return insert("INSERT INTO users (username, password) VALUES (?, ?)", [
    username,
    password
  ]);
};

const getVideoPath = id => {
  console.log(`Retrieving video id: ${id} from database.`);
  return selectRow("SELECT path FROM videos WHERE id = ?", [id]);
};

const getAllVideos = () => {
  console.log("Retrieving all videos from database.");
  return selectAll("SELECT * FROM videos", []);
};

module.exports = { createTables, getUser, addUser, getVideoPath, getAllVideos };
