const User = require("../models/user");

const regexUsername = /^[a-zA-Z]\w{5,17}$/;
const regexPassword = /^[a-zA-Z0-9_\-]{6,12}$/;
const regexStuId = /^[1-9]\d{7}$/;
const regexPhone = /^[1-9]\d{10}$/;
const regexEmail = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

async function register(params) {
  const { username, password, confirm, stuId, phone, email } = params;
  let user;

  if (!regexUsername.test(username)) {
    throw Error("Invalid Username");
  }

  if (!regexPassword.test(password)) {
    throw Error("Invalid Password");
  }

  if (password !== confirm) {
    throw Error("Invalid Confirm");
  }

  if (!regexStuId.test(stuId)) {
    throw Error("Invalid StuID");
  }

  if (!regexPhone.test(phone)) {
    throw Error("Invalid Phone");
  }

  if (!regexEmail.test(email)) {
    throw Error("Invalid Email");
  }

  try {
    user = await User.create({ username, password, stuId, phone, email });
  } catch (err) {
    throw Error("Create Error");
  }

  return user;
}

module.exports = register;
