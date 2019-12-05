const sqlite3 = require("sqlite3").verbose();
const config = require("../config");

/**
 * Opens a new db object using connection parameters. Returns db object.
 */
const openDB = () => {
  let db = new sqlite3.Database(`./db/${config.dbname}`, err => {
    if (err) return console.error(err.message);
    console.log(`Connected to SQlite database: ./db/${config.dbname}.`);
  });
  return db;
};

/**
 * Takes DB object and performs close operation.
 */
const closeDB = db => {
  db.close(err => {
    if (err) return console.error(err.message);
    console.log("Closed the database connection.");
  });
};

/**
 * Takes query and arguments. Opens a db object and performs
 * a prepared statement using the query and args provided.
 * Returns a promise which resolves with a single row.
 */
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

/**
 * Takes query and arguments. Opens a db object and performs
 * a prepared statement using the query and args provided.
 * Returns a promise which resolves with all rows.
 */
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

/**
 * Takes and query and arguments. Opens a db object and performs
 * a prepared insert statement using the query and args provided.
 * If the query is successful, returns a promise which resolves as true.
 */
const insert = (query, args) => {
  let db = openDB();
  return new Promise((resolve, reject) => {
    db.run(query, args, err => {
      closeDB(db);
      if (err) reject(err);
      resolve(true);
    });
  });
};

/**
 * Used for initializing the database.
 * Created users and videos tables based on configuration file.
 */
const createTables = () => {
  let db = openDB();
  db.serialize(() => {
    db.run(config.createUsersQuery);
    db.run("INSERT INTO users(username, password) VALUES(?, ?)", ["admin", "1234"], err => {
      if (err) return console.error(err.message);
      console.log("Users table created and populated.");
    });
    db.run(config.createVideosQuery);
  });
  closeDB(db);
};

/**
 * Takes username as an argument and returns all user data for that user.
 */
const getUser = username => {
  console.log(`Looking up user: ${username} in database.`);
  return selectRow("SELECT * FROM users WHERE username = ?", [username]);
};

/**
 * Takes a username and password, checks if user already exists in database
 * then adds the new user.
 */
const addUser = (username, password) => {
  console.log(`Adding user: ${username} to database.`);
  getUser(username).then(row => {
    if (row) return false;
    return insert("INSERT INTO users (username, password) VALUES (?, ?)", [username, password]);
  });
};

/**
 * Takes a video id and retrieves the path from the videos table
 */
const getVideoPath = id => {
  console.log(`Retrieving video id: ${id} from database.`);
  return selectRow("SELECT path FROM videos WHERE id = ?", [id]);
};

/**
 * Retrieves all rows from the videos table
 */
const getAllVideos = () => {
  console.log("Retrieving all videos from database.");
  return selectAll("SELECT * FROM videos", []);
};

/**
 * Takes new video name and path, creates entry in database for it.
 */
const addVideo = (name, path) => {
  console.log(`Adding video: ${path} to database.`);
  return insert("INSERT INTO videos (name, path) VALUES (?, ?)", [name, path]);
};

module.exports = {
  createTables,
  getUser,
  addUser,
  getVideoPath,
  getAllVideos,
  addVideo
};
