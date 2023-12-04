const Joi = require("joi");
const bcrypt = require("bcryptjs")
const { User } = require("../models/User.model");
const { generateToken } = require("../utils/jwt");
const asyncWrap = require("./../utils/asyncwrapper");
const AppError = require("../utils/AppError");

const userJoiSchema = {
  login: Joi.object().keys({
    password: Joi.string(),
    email: Joi.string()
      .email({ tlds: { allow: ["com"] } })
      .error(() => Error("Email is not valid")),
  }),
  register: Joi.object().keys({
    password: Joi.string().max(20).required(),
    passwordConfirm: Joi.string().max(20).required(),
    email: Joi.string()
      .email({ tlds: { allow: ["com"] } })
      .error(() => Error("Email is not valid"))
      .required(),
    name: Joi.string().required(),
    date_created: Joi.date(),
  }),
};

exports.register =asyncWrap( async (req, res, next) => {
  const body = req.body;
  const validate = userJoiSchema.register.validate(body);

    if (validate.error) {
      return next(Error(401, validate.error.message));
    }
    if (await checkIfUserExists(body.email)) {
      throw new Error("Already in the sysytem");
    };

    const hash = await bcrypt.hash(body.password, 10);
    body.password = hash;

    const newUser = new User(body);
    await newUser.save();

    return res.status(201).send(`${newUser.name} added succesfully id: ${newUser._id}`);
});


const checkIfUserExists = async (email) => {
  const user = await User.findOne({ email });
  if (user) return user;
  return false;
};


exports.login = asyncWrap(async (req, res, next) => {
  const body = req.body;
  const validate = userJoiSchema.login.validate(body);
  if (validate.error) {
    return next(new AppError(401, validate.error.message));
  }
  const user = await checkIfUserExists(body.email);
  if (!user ||! await bcrypt.compare(body.password, user.password)) {
    return next(new AppError(401, "Password or email not valid"));
  }
  const token = generateToken(user);
  res.send({ token });
});

exports.getUserById = asyncWrap(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById({_id:id}).select("-password -passwordConfirm");
  if (!user) return next(new AppError(400, "user not exist"));
  res.status(200).json({
    status: "success",
    user,
  });
});
