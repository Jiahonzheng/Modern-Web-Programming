const db = require("../utils/db");
const render = require("../utils/render");

function userinfo(req, res) {
  const {username} = req.body;

  if (!username) {
    return res.json({code: 400, msg: "Username cannot be empty"});
  }

  if (!db.query(username)) {
    return res.json({code: 400, msg: "Username doesn't exist"});
  }

  res.json({code: 200});
}

module.exports = userinfo;
