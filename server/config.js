const port = 3000;
const domain = "*";
const dbname = "videoDB.db";
const secret = "knu6ZDeBwOWUpSylm5gxcuz1hwVI2JIQzFZ510f6F83pEcx3vkk79nozNhk2TqtgeAZ3KrQ1lrJ7M4ztoL7FsvmOKHwDXy61clesQAtU6eIUGySz3uYR5kY";
const saltRounds = 12;
const algorithm = "aes-256-ctr";
const createUsersQuery = `CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, username Text NOT NULL, password Text NOT NULL)`;
const createVideosQuery = `CREATE TABLE videos (id INTEGER PRIMARY KEY AUTOINCREMENT, name Text NOT NULL, path Text NOT NULL)`;

module.exports = {
  port,
  domain,
  dbname,
  secret,
  saltRounds,
  algorithm,
  createUsersQuery,
  createVideosQuery
};
