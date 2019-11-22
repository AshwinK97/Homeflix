const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const express = require("express");
const fs = require("fs");
const session = require("express-session");

const auth = require("./helpers/auth");
const db = require("./helpers/db");
const sync = require("./helpers/sync");
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

app.post("/login", (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).send("Invalid username or password.");
  }

  db.getUser(req.body.username)
    .then(data => {
      bcrypt.compare(req.body.password, data.password)
        .then(isSuccess => {
          if (!isSuccess) {
            return res.status(400).send("Invalid username or password.");
          } else {
            return res.status(200).send("Successfully logged in.");
          }
        });
    })
    .catch(err => {
      return res.status(400).send("Invalid username or password.");
    });
});

app.get("/signup", (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.send("Invalid username or password.");
  }

  // Encrypt password before storing into DB
  bcrypt.hash(req.body.password, config.saltRounds).then(hash => {
    // Store hash in your password DB.
    db.addUser(req.body.username, hash)
      .then(isSuccess => {
        if (isSuccess) {
          console.log(`New user: ${req.body.username} created successfully.`);
          res.sendStatus(204);
        } else {
          console.log(err);
          res.status(400).send("Username already exists.");
        }
      })
      .catch(err => {
        console.log(err);
        return res.status(500).send("Server Issue");
      });
  });
});

app.get("/video/:id", auth.isAuth, (req, res) => {
  console.log(req.params);
  db.getVideoPath(req.params.id) 
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

app.post("/addSync", (req, res) => {
  // Add try catch
  const user = req.body.user;
  const title = req.body.title;
  sync.syncTable.insert({"user": user, "title": title, "time": 0});

  res.sendStatus(204);
});

app.get("*", (req, res) => {
  res.status(404).send("Error 404: url not found");
});

server = app.listen(config.port, () =>
  console.log(`Listening on port: ${config.port}`)
);

const io = require("socket.io").listen(server);

io.on("connection", function(socket) {
  // console.log(socket.id);
  socket.on("SEND_MESSAGE", function(data) {
    io.emit("MESSAGE", data);
  });

  socket.on("SYNC_VIDEO", function(data) {
    // console.log(data);
    let row = sync.syncTable({user: data.user, title: data.video})
    row.update({time: data.time});

    console.log(row.first());
    // Do something with data here, format: {user: String, video: String, time: Math.Floor(number)}
    // Emit time data back to String value of "SYNC_"user + "_" + video
  })
});
