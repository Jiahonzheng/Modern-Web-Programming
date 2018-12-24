function needAPI(req, res, next) {
  if (!req.session.user_id) {
    return res.json({ code: 400, msg: "Authentication Error" });
  }

  next();
}

function needView(req, res, next) {
  if (!req.session.user_id) {
    return res.redirect("/");
  }

  next();
}

function blockAPI(req, res, next) {
  if (req.session.user_id) {
    return res.json({ code: 400, msg: "Have Logged In" });
  }

  next();
}

function blockView(req, res, next) {
  if (req.session.user_id) {
    return res.redirect(`/?username=${req.session.username}`);
  }

  next();
}

module.exports = {
  needAPI,
  needView,
  blockAPI,
  blockView
};
