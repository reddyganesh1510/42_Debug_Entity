require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const app = express();

const connectDB = require("./config/db");
connectDB();

app.use(cors());

// Body Parser
app.use(express.json({ extended: false }));

// Make storage files publically accesible
app.use("/documents/docstore", express.static(path.resolve("./docstore")));

// API Test Route
app.get("/documents", (req, res, next) => res.send("Documents API running"));

//REST Endpoints
app.use("/documents", require("./routes"));

// Server Listen
const PORT = process.env.PORT || 8006;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}!`);
});
