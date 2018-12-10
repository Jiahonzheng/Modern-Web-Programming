const fs = require("fs");
const path = require("path");

const mime = {
  ".js": "text/javascript",
  ".css": "text/css",
  ".html": "text/html",
  ".htm": "text/htm",
  ".ico": "image/x-icon",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".doc": "application/msword",
  ".pdf": "application/pdf",
  ".json": "application/json",
  ".wav": "audio/wav",
  ".mp3": "audio/mp3"
};

function static(req, res, next) {
  const {url} = req;
  let pathname = "";

  if (url.indexOf("?") !== -1) {
    next();
    return;
  }

  if (url.indexOf("..") != -1) {
    res.statusCode = 400;
    res.end("Invalid Path");
    return;
  }

  pathname = path.resolve(
    __dirname,
    "../public" + (url === "/" ? "/login.html" : url)
  );

  const ext = path.extname(pathname);

  fs.exists(pathname, function(exist) {
    if (!exist) {
      next();
      return;
    }

    if (fs.statSync(pathname).isDirectory()) {
      res.statusCode = 403;
      res.end("Forbidden");
      return;
    }

    fs.readFile(pathname, function(err, data) {
      if (err) {
        res.statusCode = 500;
        res.end("Read File Error");
        return;
      }

      res.statusCode = 200;
      res.setHeader("Content-Type", mime[ext] || "text/plain");
      res.end(data);
    });
  });
}

module.exports = static;
