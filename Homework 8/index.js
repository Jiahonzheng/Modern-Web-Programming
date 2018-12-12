const http = require("http");
const url = require("url");
const path = require("path");
const fs = require("fs");

const html = `
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <title>环形按钮</title>
    <meta charset="utf-8" />
    <link rel="icon" sizes="196x196" href="/S1/assets/images/favicon.png" />
    <style>
      body {
        background: #2d343d;
      }

      .main {
        bottom: 0;
        height: 350px;
        left: 0;
        margin: auto;
        position: absolute;
        right: 0;
        top: 0;
        width: 300px;
      }

      div {
        display: block;
        margin-top: 10px;
        margin-bottom: 10px;
        text-align: center;
      }

      button {
        background: #f0776c;
        border: none;
        cursor: pointer;
        height: 50px;
        width: 300px;
        font-family: "Arial";
        font-size: 22px;
        color: #ffffff;
      }
    </style>
  </head>

  <body>
    <div class="main">
      <div>
        <a href="S1/index.html"><button>S1 - 人工交互</button></a>
      </div>
      <div>
        <a href="S2/index.html"><button>S2 - 仿真机器人，顺序</button></a>
      </div>
      <div>
        <a href="S3/index.html"><button>S3 - 仿真机器人，并行</button></a>
      </div>
      <div>
        <a href="S4/index.html"><button>S4 - 仿真机器人，随机</button></a>
      </div>
      <div>
        <a href="S5/index.html"><button>S5 - 仿真机器人，独立行为</button></a>
      </div>
    </div>
  </body>
</html>
`;

const allowedOrigins = ["http://localhost:3000", "http://127.0.0.1:3000"];
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

  if (pathname === "/api" && req.mime === undefined) {
    cors(req, res, handleAjax);
    return;
  }

  handleStatic(req, res);
});

server.listen(port, function() {
  console.log(`server is listening on: 0.0.0.0:${port}`);
});

function cors(req, res, next) {
  if (allowedOrigins.includes(req.headers.origin)) {
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
    res.setHeader("Access-Control-Allow-Methods", "GET");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }
  next(req, res);
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
      res.writeHead(200, {
        "Content-Type": "text/html"
      });
      res.end(html);
      return;
    }

    res.writeHead(200, {
      "Content-Type": mime,
      "Content-Length": data.length
    });
    res.end(data);
  });
}

function random(range) {
  return Math.round(Math.random() * range);
}
