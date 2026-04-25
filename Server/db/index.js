import pg from "pg";
import 'dotenv/config'

const db = new pg.Pool();

db.connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => console.error("Connection error", err.stack));

export default db;