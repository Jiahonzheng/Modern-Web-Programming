const http = require("http");
const url = require("url");
const path = require("path");
const fs = require("fs");

const mime = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".jpg": "image/jpeg",
  ".gif": "image/gif",
  ".png": "image/png"
};
const port = 3000;

const server = http.createServer(function(req, res) {
  const { pathname } = url.parse(req.url, true);

  req.pathname = pathname;
  req.mime = mime[path.extname(pathname)];

  if (req.mime === undefined) {
    handleAjax(req, res);
    return;
  }

  handleStatic(req, res);
});

server.listen(port, function() {
  console.log(`server is listening on: 0.0.0.0:${port}`);
});

function random(range) {
  return Math.round(Math.random() * range);
}

function handleAjax(req, res) {
  setTimeout(function() {
    res.writeHead(200);
    res.end("" + 1 + random(9));
  }, 500 + random(500));
}

function handleStatic(req, res) {
  const { pathname, mime } = req;
  const filePath = __dirname + pathname;

  if (!fs.existsSync(filePath)) {
    res.writeHead(500);
    res.end();
    return;
  }

  fs.readFile(filePath, function(err, data) {
    if (err) {
      res.writeHead(500);
      res.end();
      return;
    }

    res.writeHead(200, {
      "Content-Type": mime,
      "Content-Length": data.length
    });
    res.end(data);
  });
}
