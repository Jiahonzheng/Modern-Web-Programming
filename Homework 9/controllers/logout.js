function api(req, res) {
  req.session.destroy(() => {
    res.redirect("/");
  });
}

module.exports = { api };
