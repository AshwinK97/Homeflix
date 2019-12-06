const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const encrypt = require("file-encrypt");
const express = require("express");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const ip = require("ip");
const perf = require("execution-time")(console.log);
const session = require("express-session");
const thumbler = require("thumbler");

// import config and helpers
const config = require("./config");
const auth = require("./helpers/auth");
const db = require("./helpers/db");
const math = require("./helpers/math");
const sync = require("./helpers/sync");

// initialize app
const app = express();
// serve thumbnails as static files from folder
app.use(express.static("thumbnails"));
// express-fileupload default config
app.use(fileUpload());
// express-session config
app.use(
  session({
    secret: config.secret,
    resave: true,
    saveUninitialized: true
  })
);
// enable body parser for json requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// allow requests from selected domains
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", config.domain);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/**
 * temporary route used to generate and add new user id.
 * user id will be used to keep track of currently watched video and
 * watch time for syncing with other users
 */
app.post("/addUserHandle", (req, res) => {
  if (!req.body.username) {
    return res.status(404).send("No Username sent");
  }
  const username = req.body.username;
  const id = math.getRandomInt(1000000, 9999999);
  const result = sync.userTable.insert({ user: username });
  console.log(`User ${username} has been added`);
  if (result.count() > 0) {
    return res.sendStatus(204);
  } else {
    return res.sendStatus(500);
  }
});

/**
 * Checks username from request against list of registered users.
 * If user exists, allow them to continue request.
 */
app.post("/isUserHandle", (req, res) => {
  if (!req.body.username) {
    return res.status(404).send("No Username sent");
  }
  const username = req.body.username;
  console.log("Retrieving User: " + username);
  const result = sync.userTable({ user: username });
  return res.sendStatus(204);
});

/**
 * Checks if username and password are sent in request.
 * check if user exists in database, if entry is found,
 * use bcrypt to compare sent password with hashed password in db.
 */
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

/**
 * Checks if username and password are sent in request.
 * hash password using bcrypt salted hashing, add user to database
 * with hashed password. If user cannot be added, return error user already exists.
 */
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

/**
 * Checks if file was uploaded as part of request.
 * Gets fullname, and the name + extension of the file.
 * Moves the file to the staging folder, generates a
 * thumbnail with the same name in jpeg format. Encrypts the
 * video file and saves it under video storage, wipes the staging folder.
 */
app.post("/upload", auth.isAuth, (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded");
  }
  const video = req.files.video;
  let fullname = video.name.replace(/ /g, "_");
  let name = fullname.substring(0, video.name.lastIndexOf(".")) + "_" + math.getRandomInt(1, 99999);
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
        perf.start();
        encrypt.encryptFile(`./staging/${name + extension}`, `./videos/${name + extension}`, config.secret, err => {
          if (err) return console.error(err);
          console.log("encryption time: ");
          perf.stop();
          console.log("encryption success");
          db.addVideo(name, `./videos/${name + extension}`);
          fs.unlink(`./staging/${name + extension}`, err => {
            if (err) console.error(err);
            console.log("file removed from staging");
            res.sendStatus(204);
          });
        });
        return console.log(`thumbnail stored at ${path}`);
      }
    );
  });
});

/**
 * looks up video path based on requested id. Reads from path and
 * decrypts file, storing it to the staging folder. Once decryption
 * is sucessful, gets data on the decrypted file. If the user has
 * requested a range, extract the bytes from the requested range of the
 * video and return the video data to the client. If a range was not
 * requested, send just the size and format of the video to the client.
 * Delete the video fromt he staging folder once complete.
 */
app.get("/video/:id", auth.isAuth, (req, res) => {
  db.getVideoPath(req.params.id)
    .then(data => {
      const path = data.path.replace("videos", "staging");
      perf.start();
      encrypt.decryptFile(`${data.path}`, `${path}`, config.secret, err => {
        if (err) return console.error(err);
        console.log("Decryption time: ");
        perf.stop();
        console.log("decryption success");
        perf.start();
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
          console.log("Streaming time: ");
          perf.stop();
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

/**
 * Retrieves all videos available in the database.
 * Returns a json object with id, name & path of each video.
 */
app.get("/videos", auth.isAuth, (req, res) => {
  perf.start();
  db.getAllVideos()
    .then(data => {
      console.log("Retrieving video data from database time: ");
      perf.stop();
      res.send(data);
    })
    .catch(err => console.error(err));
});

/**
 * Retrieves all currently watched videos from sync table.
 */
app.get("/activeVideos", auth.isAuth, (req, res) => {
  perf.start();
  data = sync.syncTable().get();
  console.log("Retrieving active videos time: ");
  perf.stop();
  res.send(data);
});

/**
 * Retrieves server's ip address. Is used by client to store server
 * domain during testing, since we don't use a dns forward.
 */
app.get("/getip", auth.isAuth, (req, res) => {
  res.send(ip.address());
});

/**
 * Used during testing to initialize the database. Will create the required
 * tables with empty rows. Will also create an admin user.
 */
app.get("/initializedb", auth.isAuth, (req, res) => {
  db.createTables();
  res.send("Database created.");
});

/**
 * Called by client when a user starts watching a video.
 * Will store the user, video name and video id so this data
 * can be pulled by the client homepage with /activevideos
 */
app.post("/addSync", (req, res) => {
  perf.start();
  const user = req.body.user;
  const title = req.body.title;
  const videoid = req.body.id;
  sync.syncTable.insert({
    user: user,
    title: title,
    videoid: videoid,
    time: 0
  });

  console.log("Add watching now time: ");
  perf.stop();
  res.sendStatus(204);
});

/**
 * Called by client when a user stops watching a video.
 * Will look up an entry in the sync table based on user and videoid.
 * Removes the entry so when client loads homepage and calls /activevideos,
 * it no longer shows up under the watching now section
 */
app.post("/removeSync", (req, res) => {
  perf.start();
  const result = sync.syncTable({ user: req.body.user, videoid: req.body.id }).remove();
  if (result > 0) {
    console.log("Remove watching now time: ");
    perf.stop();
    res.sendStatus(204);
  } else {
    res.status(400).send("data incompatible");
  }
});

/**
 * Send 404 status when unknown route is requested
 */
app.get("*", (req, res) => {
  res.status(404).send("Error 404: url not found");
});

// start server, listen on configured port
server = app.listen(config.port, () => console.log(`Listening on port: ${config.port}`));

/**
 * Called when server starts. Open a websocket to connect to client.
 * Will capture data from user (time, videoid, userid) and store in sync table.
 * This data is then used to keep other users synchronized when they are
 * sync streaming a video.
 */
const io = require("socket.io").listen(server);
io.on("connection", function(socket) {
  socket.on("SEND_MESSAGE", function(data) {
    io.emit("MESSAGE_" + data.chatId, data);
  });

  socket.on("SYNC_VIDEO", function(data) {
    // console.log("Capturing time from: " + data.user + " watching " + data.video + "... time = " + data.time);
    let row = sync.syncTable({ user: data.user, videoid: data.id });
    row.update({ time: data.time });
    io.emit("SYNC_VIDEO_TIME_" + data.user + "_" + data.id, data.time);
  });
});
