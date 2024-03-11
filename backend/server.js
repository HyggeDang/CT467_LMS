const app = require("./app");

const pool = require("./database");

async function startServer() {
    pool.getConnection()
    .then((connection) => {
      console.log("Connected to the MySQL database.");
      connection.release();
    })
    .catch((err) => {
      console.error("Unable to connect to the database:", err);
    });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();
