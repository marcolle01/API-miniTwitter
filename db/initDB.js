require("dotenv").config();
const { getConnection } = require("./db");

async function main() {
  let connection;
  try {
    connection = await getConnection();

    console.log("Dropping tables...");

    await connection.query(`DROP TABLE IF EXISTS tweets`);
    await connection.query(`DROP TABLE IF EXISTS users`);

    console.log("Creating tables...");

    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(100) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await connection.query(`
      CREATE TABLE IF NOT EXISTS tweets (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        text VARCHAR(255) NOT NULL,
        image VARCHAR(100),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `);
  } catch (error) {
    console.error(error);
  } finally {
    if (connection) connection.release();
    process.exit();
  }
}

main();
