const User = require("../models/user");

async function login(params) {
  const { username, password } = params;
  let user;

  try {
    user = await User.findOne({ username });
  } catch (err) {
    throw Error("FindOne Error");
  }

  if (user === null) {
    throw Error("User Not Found");
  }

  if (user.password !== password) {
    throw Error("Wrong Password");
  }

  return user;
}

module.exports = login;
