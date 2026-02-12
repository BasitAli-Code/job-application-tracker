const express = require("express");
const router = express.Router();
const { registerUser, login } = require("../controllers/userController");

router.post("/", registerUser);
router.get("/test", (req, res) => res.send("Backend is alive!"));
router.post("/login", login);

module.exports = router;
