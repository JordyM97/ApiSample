const express = require("express");
const app = express();
const db = require("./models/db.js")
app.use(express.json())
app.get("/", (req, res) => {
    res.json({ message: "Welcome to the application." });
  });
  app.get("/*", (req, res) => {
    res.json({ message: "No more endpoints defined." });
  });
require("./routes/transaction")(app);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
