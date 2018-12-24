const path = require("path");
const login = require("../services/login");

async function api(req, res) {
  const { username, password } = req.body;
  let user = {};

  if (!username || !password) {
    return res.json({ code: 400, msg: "Empty Arguments" });
  }

  try {
    user = await login({ username, password });
  } catch (err) {
    return res.json({ code: 400, msg: err.message });
  }

  req.session.user_id = user._id.toString();
  req.session.username = user.username;
  res.json({ code: 200 });
}

async function view(req, res) {
  res.sendFile(path.resolve(__dirname, "../public/login.html"));
}

module.exports = {
  api,
  view
};
