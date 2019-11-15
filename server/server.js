const express = require("express");
const fs = require("fs");
const auth = require("./helpers/auth");
const db = require("./helpers/db");
const config = require("./config");
const app = express();

app.get("/", (req, res) => res.send("Home"));

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
    .then(data => {
      res.send(data);
    })
    .catch(err => console.error(err));
});

app.get("/initializedb", auth.isAuth, (req, res) => {
  db.createTables();
  res.send("Database created.");
});

app.listen(config.port, () =>
  console.log(`Homeflix listening on port: ${config.port}`)
);
