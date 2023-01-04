import mysql from "mysql2";

const db = mysql.createConnection({
  host: "localhost",
  // MySQL username,
  user: "root",
  // MySQL password
  password: "password",
  database: "employee_list",
});

export default db;
