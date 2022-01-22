const express = require("express");

const router = express.Router();
router.use("/xcb/api/auth", require("./routes/api/auth"));
router.use("/xcb/api/admin", require("./routes/api/admin"));
router.use("/xcb/api/document", require("./routes/api/document"));
router.use("/xcb/api/user", require("./routes/api/user"));

module.exports = router;
