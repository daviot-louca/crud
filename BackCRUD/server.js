require("dotenv").config({ path: "./.env" });

console.log("ENV TEST:", process.env.HOST);

const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");

db.sequelize.sync()
  .then(() => {
    console.log("DB synchronisée");
  })
  .catch(err => {
    console.error("Erreur sync :", err);
  });

// route test
app.get("/", (req, res) => {
  res.json({ message: "Connecté sur le serveur" });
});

require("./app/routes/tutorial.routes")(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

