require("dotenv").config();

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  "postgresql://postgres:ZzVsTm1ldBwt0GHV@db.qvbaswocahiqwalreiat.supabase.co:5432/postgres"
  // process.env.DB_NAME,
  // process.env.DB_USERNAME,
  // process.env.DB_PASSWORD,
  // {
  //   host: process.env.DB_HOST,
  //   dialect: "postgres",
  //   port: process.env.DB_PORT,
  //   sync: true
  // }
);

sequelize
  .authenticate()
  .then(() => console.log("Connected to database!"))
  .catch((err) => console.error("Connection error", err.stack));

module.exports = sequelize;
