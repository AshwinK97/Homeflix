const createUsersQuery = `CREATE TABLE users 
  (id INTEGER PRIMARY KEY, name Text NOT NULL, pass Text NOT NULL)`;
const createVideosQuery = `CREATE TABLE videos
  (id INTEGER PRIMARY KEY, name Text NOT NULL, path Text NOT NULL)`;
const createUserVideoQuery = `CREATE TABLE user_video
  ()`;

module.exports = {
  connectionLimit: 100,
  host: config.db_host,
  port: config.db_port,
  user: config.db_user,
  password: config.db_pass,
  database: config.db_name
};
