const fs = require("fs");

const tagOpen = "<%=";
const tagClose = "%>";

let templates = {};

function replace(template, content = {}) {
  let rendered = template;

  for (let key in content) {
    let token = tagOpen + key + tagClose;
    rendered = rendered.replace(token, content[key]);
  }

  return rendered;
}

function render(filename, content, callback) {
  if (templates[filename])
    return callback(null, replace(templates[filename], content));

  fs.readFile(process.cwd() + filename, function(err, data) {
    if (err) return callback(err);

    templates[filename] = data.toString();
    callback(null, replace(templates[filename], content));
  });
}

module.exports = render;
