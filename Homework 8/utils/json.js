function json(req, res, next) {
  let data = "";

  req.on("data", function(chunk) {
    data += chunk;
  });

  req.on("end", function() {
    try {
      req.body = JSON.parse(data);
    } catch (err) {
      res.statusCode = 500;
      res.end("JSON Format Error");
      return;
    }

    next();
  });
}

module.exports = json;
