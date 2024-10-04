const createUser = async (db, userData) => {
  const User = require('../models/userModel')(db);
  const newUser = new User(userData);
  await newUser.save();
  return newUser;
};

const getUser = async (db, userId) => {
  const User = require('../models/userModel')(db);
  return User.findById(userId);
};

module.exports = {
  createUser,
  getUser,
};
