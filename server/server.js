const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const express = require("express");
const fs = require("fs");
const session = require("express-session");

const auth = require("./helpers/auth");
const db = require("./helpers/db");
const config = require("./config");

const app = express();
app.use(
  session({
    secret: config.secret,
    resave: true,
    saveUninitialized: true
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", config.domain);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/login", (req, res) => {
  if (!req.body.username || !req.body.password)
    return res.send("Invalid username or password.");
  db.getUser(req.body.username)
    .then(data => {
      bcrypt.compare(req.body.password, data.password).then(isSuccess => {
        if (!isSuccess) return res.send("Invalid username or password.");
        return res.send("Successfully logged in.");
      });
    })
    .catch(err => {
      return res.send("Invalid username or password.");
    });
});

app.get("/signup", (req, res) => {
  if (!req.body.username || !req.body.password)
    return res.send("Invalid username or password.");
  db.addUser(req.body.username, req.body.password)
    .then(isSuccess => {})
    .catch(err => {
      return console.log(err);
    });
});

app.get("/video", auth.isAuth, (req, res) => {
  db.getVideoPath(2) // should be req.body.videoid
    .then(data => {
      const path = data.path;
      const stat = fs.statSync(path);
      const fileSize = stat.size;
      const range = req.headers.range;
      if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = end - start + 1;
        const file = fs.createReadStream(path, { start, end });
        const head = {
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunksize,
          "Content-Type": "video/mp4"
        };
        res.writeHead(206, head);
        file.pipe(res);
      } else {
        const head = {
          "Content-Length": fileSize,
          "Content-Type": "video/mp4"
        };
        res.writeHead(200, head);
        fs.createReadStream(path).pipe(res);
      }
    })
    .catch(err => console.error(err));
});

app.get("/videos", auth.isAuth, (req, res) => {
  db.getAllVideos()
    .then(data => res.send(data))
    .catch(err => console.error(err));
});

app.get("/initializedb", auth.isAuth, (req, res) => {
  db.createTables();
  res.send("Database created.");
});

app.get("*", (req, res) => {
  res.status(404).send("Error 404: url not found");
});

app.listen(config.port, () => console.log(`Listening on port: ${config.port}`));
