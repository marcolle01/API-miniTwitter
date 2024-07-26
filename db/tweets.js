const { getConnection } = require("./db");
const { generateError } = require("../helpers");

const getAllTweets = async () => {
  let connection;

  try {
    connection = await getConnection();
    const [result] = await connection.query(
      "SELECT * FROM tweets ORDER BY created_at DESC"
    );
    return result;
  } finally {
    if (connection) connection.release();
  }
};

const getSingleTweet = async (id) => {
  let connection;

  try {
    connection = await getConnection();
    const [result] = await connection.query(
      `SELECT * FROM tweets WHERE id = ?`,
      [id]
    );

    if (result.length === 0) {
      throw generateError(`Tweet with id ${id} not found`, 404);
    }
    return result[0];
  } finally {
    if (connection) connection.release();
  }
};

const createTweet = async (userId, text, image = "") => {
  let connection;

  try {
    connection = await getConnection();

    const [result] = await connection.query(
      "INSERT INTO tweets(user_Id, text, image) VALUES(?, ?, ?)",
      [userId, text, image]
    );

    return result.insertId;
  } finally {
    if (connection) connection.release();
  }
};

const deleteTweetById = async (id) => {
  let connection;

  try {
    connection = await getConnection();
    await connection.query("DELETE FROM tweets WHERE id = ?", [id]);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = { createTweet, getAllTweets, getSingleTweet, deleteTweetById };
