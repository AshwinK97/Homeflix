const port = 3000;
const dbname = "videoDB.db";
const createUsersQuery = `CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, username Text NOT NULL, password Text NOT NULL)`;
const createVideosQuery = `CREATE TABLE videos (id INTEGER PRIMARY KEY AUTOINCREMENT, name Text NOT NULL, path Text NOT NULL)`;
const createUserVideoQuery = `CREATE TABLE user_video (id INTEGER PRIMARY KEY AUTOINCREMENT, userid INTEGER NOT NULL, videoid INTEGER NOT NULL)`;

module.exports = {
  port,
  dbname,
  createUsersQuery,
  createVideosQuery,
  createUserVideoQuery
};
