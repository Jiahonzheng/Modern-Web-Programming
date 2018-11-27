const db = require("../utils/db");

const regexUsername = /^[a-zA-Z]\w{5,17}$/;
const regexStuId = /^[1-9]\d{7}$/;
const regexPhone = /^[1-9]\d{10}$/;
const regexEmail = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

function register(req, res) {
  const {username, stuId, phone, email} = req.body;

  if (!username || !stuId || !phone || !email) {
    return res.json({code: 400, msg: "Empty Arguments"});
  }

  if (!regexUsername.test(username)) {
    return res.json({code: 400, field: "username", msg: "Username is invalid"});
  }

  if (!regexStuId.test(stuId)) {
    return res.json({code: 400, field: "stuId", msg: "Student ID is invalid"});
  }

  if (!regexPhone.test(phone)) {
    return res.json({code: 400, field: "phone", msg: "Phone is invalid"});
  }

  if (!regexEmail.test(email)) {
    return res.json({code: 400, field: "email", msg: "Email is invalid"});
  }

  try {
    db.insert({username, stuId, phone, email});
    res.json({code: 200});
  } catch (err) {
    if (typeof err === "string") {
      res.json({code: 400, field: err, msg: `Field ${err} conflicts`});
      return;
    }

    res.json({code: 400, msg: "Database Insert Error"});
  }
}

module.exports = register;
