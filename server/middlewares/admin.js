const Admin = require("../models/Admin");

module.exports = async (req, res, next) => {
  const respObj = { msg: "Admin auth request", success: false };
  try {
    const { email, id } = req.admin;

    //validate admin id
    let admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({
        ...respObj,
        errors: [{ msg: "Admin not found" }],
      });
    }

    next();
  } catch (err) {
    return res.status(401).json({
      ...respObj,
      errors: [{ msg: err.message }],
    });
  }
};
