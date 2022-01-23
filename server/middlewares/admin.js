const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

module.exports = async (req, res, next) => {
  const respObj = { msg: "Admin auth request", success: false };
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({
      ...respObj,
      errors: [{ msg: "Authentication token not found" }],
    });
  }

  try {
    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decodedPayload);
    req.admin = decodedPayload.admin;
    let admin = await Admin.findById(decodedPayload.admin.id);
    if (!admin) {
      return res.status(404).json({
        ...respObj,
        errors: [{ msg: "Admin not found" }],
      });
    }
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      ...respObj,
      errors: [{ msg: "Session expired, please login again" }],
    });
  }
};
