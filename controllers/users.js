const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const { generateError } = require("../helpers");
const { createUser, getUserById, getUserByEmail } = require("../db/users");

const newUserController = async (req, res, next) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(4).required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      throw generateError(error.details[0].message, 400);
    }

    const { email, password } = req.body;
    console.log("Email:", email);
    console.log("Password:", password);

    const userId = await createUser(email, password);

    res.status(201).send({
      status: "ok",
      message: `User created with id: ${userId}`,
    });
  } catch (error) {
    next(error);
  }
};

const getUserController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);

    res.send({
      status: "ok",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw generateError("Email and password are required", 400);
    }

    const user = await getUserByEmail(email);

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      throw generateError("Invalid password", 401);
    }

    const payLoad = {
      id: user.id,
    };

    const token = jwt.sign(payLoad, process.env.SECRET, {
      expiresIn: "30d",
    });

    res.send({
      status: "ok",
      data: token,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { newUserController, getUserController, loginController };
