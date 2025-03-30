import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "mysql-10aede29-lileekarimakerkoub-27c1.j.aivencloud.com",
  user: "avnadmin",
  password: "AVNS_vQNfesms0nYuwLGbPJ1",
  database: "defaultdb",
  port: 21901,
  ssl: {
    rejectUnauthorized: false,
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
