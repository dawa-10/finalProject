const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Models/user");
require("dotenv").config();
const { JWT_SECRET } = process.env;

exports.createUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: `User created: ${username}` });
  } catch (error) {
    next(error);
  }
};


exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "Username not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign({ id: user._id }, JWT_SECRET);
      return res.status(200).json({ message: "User authenticated", token });
    } else {
      return res.status(401).json({ message: "Incorrect username or password" });
    }
  } catch (error) {
    next(error);
  }
};
