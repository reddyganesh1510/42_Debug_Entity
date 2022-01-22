const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  const respObj = { msg: "Authentication request", success: false };

  //Extract token from header
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({
      ...respObj,
      errors: [{ msg: "Authentication token not found" }],
    });
  }

  try {
    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedPayload.user;
    next();
  } catch (err) {
    return res.status(401).json({
      ...respObj,
      errors: [{ msg: "Session expired, please login again" }],
    });
  }
};
