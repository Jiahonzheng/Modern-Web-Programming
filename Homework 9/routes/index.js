const Router = require("express");
const auth = require("../middlewares/auth");

const login = require("../controllers/login");
const logout = require("../controllers/logout");
const register = require("../controllers/register");
const userinfo = require("../controllers/userinfo");

const router = Router();
const api = Router();
const view = Router();

router.use("/", view);
router.use("/api/v1", api);

api.post("/register", auth.blockAPI, register.api);
api.post("/login", auth.blockAPI, login.api);
api.get("/logout", auth.needAPI, logout.api);

view.get("/", userinfo.view, auth.blockView, login.view);
view.get("/login", auth.blockView, login.view);
view.get("/regist", auth.blockView, register.view);
view.get("/userinfo", auth.needView, userinfo.view);

module.exports = router;
