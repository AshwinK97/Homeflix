const port = 3000;
const dbname = "videoDB.db";
const secret =
  "knu6ZDeBwOWUpSylm5gxcuzz1hwVI2JIQzFZ510f6F83pEcx3vkk79nozNhk2TqtgeAZ3KrQ1lrJ7M4ztoL7FsvmOKHwDXy61clesQAtU6eIUGySz3uYR5kY";
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
