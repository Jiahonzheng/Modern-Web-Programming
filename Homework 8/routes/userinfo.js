const db = require("../utils/db");
const render = require("../utils/render");

function userinfo(req, res) {
  const {
    query: {username}
  } = req;

  if (!username) {
    res.json({code: 400, msg: "username cannot be empty"});
    return;
  }

  const userinfo = db.query(username);

  if (!userinfo) {
    res.statusCode = 301;
    res.setHeader("Location", "/register.html");
    res.end("");
    return;
  }

  render("/template/userinfo.html", userinfo, function(err, html) {
    if (err) {
      res.statusCode = 500;
      res.end("Unable to Render");
      return;
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.end(html);
  });
}

module.exports = userinfo;
