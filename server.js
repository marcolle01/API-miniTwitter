require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const jwt = require("jsonwebtoken");
const fileUpload = require("express-fileupload");

const {
  newUserController,
  getUserController,
  loginController,
} = require("./controllers/users.js");

const {
  getTweetsController,
  newTweetController,
  getSingleTweetController,
  deleteTweetController,
} = require("./controllers/tweets.js");

const { authUser } = require("./middlewares/auth.js");

const app = express();

app.use(fileUpload());
app.use(express.json());
app.use(morgan("dev"));
app.use("/uploads", express.static("./uploads"));

//Routes User
app.post("/user", newUserController);
app.get("/user/:id", getUserController);
app.post("/login", loginController);

//Routes Tweets
app.get("/", getTweetsController);
app.post("/", authUser, newTweetController);
app.get("/tweet/:id", getSingleTweetController);
app.delete("/tweet/:id", authUser, deleteTweetController);

//Middleware de 404
app.use((req, res) => {
  res.status(404).send({
    status: "error",
    message: "Not found",
  });
});

//Middleware de errores

app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.httpStatus || 500).send({
    status: "error",
    message: error.message,
  });
});

//Lanzar el servidor
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
