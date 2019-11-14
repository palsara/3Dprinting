const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const usersSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    auto: true,
  },
  firstname: {
    type: String,
    unique: false,
    required: true,
  },
  lastname: {
    type: String,
    unique: false,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    unique: false,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  gender: {
    type: String,
    unique: false,
    required: false,
  },
  address: {
    type: String,
    unique: false,
    required: true,
  },
  pictureurl: {
    type: String,
    unique: false,
    required: false,
  },
  role: {
    type: String,
    unique: false,
    required: false,
    default: 'user',
  },
  cookie: {
    type: String,
    unique: true,
    required: false,
  },
  basket: {
    type: Schema.Types.ObjectId,
    ref: 'Baskets',
  },
});

const Users = mongoose.model('Users', usersSchema);

module.exports = Users;
