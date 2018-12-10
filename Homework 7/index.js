const http = require("http");
const {parse} = require("url");

const MIDDLEWARES = require("./middlewares");
const {PORT} = require("./config");
const {GET, POST, PUT, DELETE} = require("./routes");

const GET_LENGTH = GET.length;
const POST_LENGTH = POST.length;
const PUT_LENGTH = PUT.length;
const DELETE_LENGTH = DELETE.length;

require("./utils/db").load("/database/users.json");

function json(data = {}) {
  this.statusCode = 200;
  this.setHeader("Content-Type", "application/json");
  this.end(JSON.stringify(data));
}

http
  .createServer(async function(req, res) {
    const {method, url} = req;
    const info = parse(url, true);
    let shortUrl = info.pathname;
    let handles = null;
    let handleIndex = 0;
    let matched = false;

    req.query = info.query;
    res.json = json;

    switch (method) {
      case "GET":
        handles = GET;
        handleIndex = GET_LENGTH;
        break;
      case "POST":
        handles = POST;
        handleIndex = POST_LENGTH;
        break;
      case "PUT":
        handles = PUT;
        handleIndex = PUT_LENGTH;
        break;
      case "DELETE":
        handles = DELETE;
        handleIndex = DELETE_LENGTH;
        break;
    }

    try {
      await middleware(req, res, MIDDLEWARES);
    } catch (err) {
      res.statusCode = 500;
      res.end("Server Internal Error");
      return;
    }

    while (handleIndex--) {
      if (handles[handleIndex].url !== shortUrl) continue;

      matched = true;

      try {
        handle(req, res, handles[handleIndex].handles);
      } catch (err) {
        res.statusCode = 500;
        res.end("Server Internal Error");
        return;
      }

      break;
    }

    if (!matched) {
      res.statusCode = 404;
      res.end("Not Found");
    }
  })
  .listen(PORT);

function middleware(req, res, middlewares) {
  const {length} = middlewares;
  let i = 0;

  return new Promise(function(resolve, reject) {
    function next() {
      if (middlewares[++i]) return middlewares[i](req, res, next);

      resolve();
    }

    try {
      if (length) middlewares[0](req, res, next);
    } catch (err) {
      reject(err);
    }
  });
}

function handle(req, res, handles) {
  const {length} = handles;
  let i = 0;

  if (res.finished) return;

  function next() {
    if (i + 1 >= length) return;

    handles[++i](req, res, next);
  }

  if (length) handles[0](req, res, next);
}
