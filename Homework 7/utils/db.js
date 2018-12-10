const fs = require("fs");
const path = require("path");

let users = {};
let pathname = "";

function load(name) {
  pathname = path.resolve(process.cwd() + name);
  fs.readFile(pathname, function(err, data) {
    if (err) return;

    try {
      users = JSON.parse(data);
    } catch (err) {
      users = {};
    }
  });
}

function insert({username, stuId, phone, email}) {
  for (let key in users) {
    const user = users[key];

    if (user.username === username) throw "username";
    if (user.stuId === stuId) throw "stuId";
    if (user.phone === phone) throw "phone";
    if (user.email === email) throw "email";
  }

  users[username] = {username, stuId, phone, email};
  fs.writeFile(pathname, JSON.stringify(users), function(err) {
    if (err) throw err;
  });
}

function query(username) {
  return users[username];
}

module.exports = {
  load,
  insert,
  query
};
