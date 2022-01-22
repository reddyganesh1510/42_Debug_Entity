const express = require("express");

const router = express.Router();
router.use("/api/admin", require("./api/admin"));
// router.use("/xcb/api/document", require("./api/document"));
router.use("/api/user", require("./api/user"));

module.exports = router;
