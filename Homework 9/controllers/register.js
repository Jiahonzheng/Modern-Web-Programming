const path = require("path");
const register = require("../services/register");

async function api(req, res) {
  const { username, password, confirm, stuId, phone, email } = req.body;
  let user = {};

  if (!username || !password || !confirm || !stuId || !phone || !email) {
    return res.json({ code: 400, msg: "Arguments cannot be empty" });
  }

  try {
    user = await register({ username, password, confirm, stuId, phone, email });
  } catch (err) {
    return res.json({ code: 400, msg: err.message });
  }

  req.session.user_id = user._id;
  req.session.username = username;
  res.json({ code: 200 });
}

async function view(req, res) {
  res.sendFile(path.resolve(__dirname, "../public/register.html"));
}

module.exports = {
  api,
  view
};
