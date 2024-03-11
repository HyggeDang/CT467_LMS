const express = require("express");
const cors = require("cors");
const app = express();
const routers = require("./app/routes/lms.route");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Library Management System - Backend." });
});


app.use("/api/lms", routers)

app.use((req, res, next) => {
  res.status(404).send("Resource not found");
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal server error");
});

module.exports = app;
