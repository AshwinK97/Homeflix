const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const express = require("express");
const encrypt = require("file-encrypt");
const fileUpload = require("express-fileupload");
const ip = require("ip");
const session = require("express-session");
const fs = require("fs");
const thumbler = require("thumbler");

const auth = require("./helpers/auth");
const db = require("./helpers/db");
const sync = require("./helpers/sync");
const config = require("./config");
const math = require("./helpers/math");

const app = express();

app.use(express.static("thumbnails"));
app.use(fileUpload());
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

app.post("/addUserHandle", (req, res) => {
  if(!req.body.username) {
    return res.status(404).send("No Username sent");
  }

  const username = req.body.username;
  const id = math.getRandomInt(1000000, 9999999);

  const result = sync.userTable.insert({
    user: username
  });
  
  console.log(`User ${username} has been added`);

  if(result.count() > 0) {
    return res.sendStatus(204);
  } else {
    return res.sendStatus(500);
  }
})

app.post("/isUserHandle", (req, res) => {
  if(!req.body.username) {
    return res.status(404).send("No Username sent");
  }

  const username = req.body.username;

  console.log("Retrieving User: " + username);

  const result = sync
  .userTable({ user: username })

  return res.sendStatus(204);
})

app.post("/login", (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).send("Invalid username or password.");
  }

  db.getUser(req.body.username)
    .then(data => {
      bcrypt.compare(req.body.password, data.password).then(isSuccess => {
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

app.post("/signup", (req, res) => {
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

app.post("/upload", auth.isAuth, (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded");
  }

  const video = req.files.video;
  let fullname = video.name.replace(/ /g, "_");
  let name =
    fullname.substring(0, video.name.lastIndexOf(".")) +
    "_" +
    math.getRandomInt(1, 99999);
  let extension = fullname.substring(video.name.lastIndexOf("."), name.length);

  video.mv(`./staging/${name + extension}`, err => {
    if (err) return res.status(500).send(err);
    thumbler(
      {
        type: "video",
        input: `./staging/${name + extension}`,
        output: `./thumbnails/${name}.jpeg`,
        size: "640x480"
      },
      (err, path) => {
        if (err) return console.error(err);

        // encrypt video, delete unencrypted one
        encrypt.encryptFile(
          `./staging/${name + extension}`,
          `./videos/${name + extension}`,
          config.secret,
          err => {
            if (err) return console.error(err);
            console.log("encryption success");
            db.addVideo(name, `./videos/${name + extension}`);
            fs.unlink(`./staging/${name + extension}`, err => {
              if (err) console.error(err);
              console.log("file removed from staging");
              res.sendStatus(204);
            });
          }
        );
        
        return console.log(`thumbnail stored at ${path}`);
      }
    );
  });
});

app.get("/video/:id", auth.isAuth, (req, res) => {
  db.getVideoPath(req.params.id)
    .then(data => {
      const path = data.path.replace("videos", "staging");
      encrypt.decryptFile(`${data.path}`, `${path}`, config.secret, err => {
        if (err) return console.error(err);
        console.log("decryption success");

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
        fs.unlink(path, err => {
          if (err) console.error(err);
          console.log("file removed from staging");
        });
      });
    })
    .catch(err => console.error(err));
});

app.get("/videos", auth.isAuth, (req, res) => {
  db.getAllVideos()
    .then(data => res.send(data))
    .catch(err => console.error(err));
});

app.get("/activeVideos", auth.isAuth, (req, res) => {
  data = sync.syncTable().get();
  res.send(data);
});

app.get("/getip", auth.isAuth, (req, res) => {
  res.send(ip.address());
});

app.get("/initializedb", auth.isAuth, (req, res) => {
  db.createTables();
  res.send("Database created.");
});

app.post("/addSync", (req, res) => {
  // Add try catch
  const user = req.body.user;
  const title = req.body.title;
  const videoid = req.body.id;
  sync.syncTable.insert({
    user: user,
    title: title,
    videoid: videoid,
    time: 0
  });

  res.sendStatus(204);
});

app.post("/removeSync", (req, res) => {
  const result = sync
    .syncTable({ user: req.body.user, videoid: req.body.id })
    .remove();
  if (result > 0) {
    res.sendStatus(204);
  } else {
    res.status(400).send("data incompatible");
  }
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
    io.emit("MESSAGE_" + data.chatId, data);
  });

  socket.on("SYNC_VIDEO", function(data) {
    console.log(
      "Capturing time from: " +
        data.user +
        " watching " +
        data.video +
        "... time = " +
        data.time
    );
    let row = sync.syncTable({ user: data.user, videoid: data.id });
    row.update({ time: data.time });

    io.emit("SYNC_VIDEO_TIME_" + data.user + "_" + data.id, data.time);
    // Do something with data here, format: {user: String, video: String, time: Math.Floor(number)}
    // Emit time data back to String value of "SYNC_"user + "_" + video
  });
});
