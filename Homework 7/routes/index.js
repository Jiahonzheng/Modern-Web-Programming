const json = require("../utils/json");
const login = require("./login");
const register = require("./register");
const userinfo = require("./userinfo");

const routes = {GET: [], POST: [], PUT: [], DELETE: []};

routes.GET = [
  {
    url: "/",
    handles: [userinfo]
  }
];

routes.POST = [
  {
    url: "/api/login",
    handles: [json, login]
  },
  {
    url: "/api/register",
    handles: [json, register]
  }
];

module.exports = routes;
