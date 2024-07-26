const fs = require("fs");
const path = require("path");

const generateError = (message, statusCode) => {
  const error = new Error(message);
  error.httpStatus = statusCode;
  return error;
};

const createPathIfNotExists = async (dir) => {
  return new Promise((resolve, reject) => {
    fs.mkdir(dir, { recursive: true }, (err) => {
      if (err) {
        if (err.code === "EEXIST") {
          resolve(); // El directorio ya existe
        } else {
          reject(err); // Otro error
        }
      } else {
        resolve(); // Directorio creado
      }
    });
  });
};
module.exports = { generateError, createPathIfNotExists };
