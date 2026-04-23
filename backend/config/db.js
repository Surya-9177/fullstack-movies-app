const { Pool } = require("pg")

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "movies_app",
  password: "mahi",
  port: 5432,
})

module.exports = pool