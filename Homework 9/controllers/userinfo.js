const User = require("../models/user");

async function view(req, res, next) {
  const { username } = req.query;
  let user = {};
  let hasSession = false;

  if (!username) {
    return next();
  }

  try {
    if (!req.session.user_id) {
      user = await User.findOne({ username });
    } else {
      hasSession = true;
      user = await User.findById(req.session.user_id);
    }
  } catch (err) {}

  const render = {
    hasFound: user !== null,
    hasSession,
    error: false
  };

  if (user !== null) {
    render.username = user.username;
    render.stuId = user.stuId;
    render.phone = user.phone;
    render.email = user.email;
  }

  if (hasSession && username !== user.username) {
    render.error = true;
  }

  res.render("userinfo", render);
}

module.exports = { view };
