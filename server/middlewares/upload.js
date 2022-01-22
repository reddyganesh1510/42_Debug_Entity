const path = require("path");
const multer = require("multer");

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let fileUploadPath = path.join(__dirname, "../docstore");
    cb(null, fileUploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    var ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

let upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    let allowedExt = [".jpeg", ".jpg", ".png"];
    if (allowedExt.indexOf(ext.toLowerCase()) === -1) {
      return callback(
        new Error("Only file type: .jpeg, .jpg, .png is allowed"),
        false
      );
    }
    callback(null, true);
  },
  limits: {
    fileSize: 1024 * 1024 * 1, // Maximum allowed size of each file is 1 mb
    files: 1, // Allow Maximum 1 files
  },
}).array("document", 1);

module.exports = upload;
