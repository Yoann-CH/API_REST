const { Model, DataTypes } = require("sequelize");
const connection = require("../lib/db");
const bcrypt = require("bcryptjs");

class User extends Model {}

User.init(
  {
    lastname: { type : DataTypes.STRING, allowNull: false },
    firstname: { type : DataTypes.STRING, allowNull: false },
    email: { type : DataTypes.STRING, allowNull: false, isEmail: true },
    password: { type : DataTypes.STRING, allowNull: false },
    createdAt: { type : DataTypes.DATE, allowNull: false },
    updatedAt: { type : DataTypes.DATE, allowNull: false },
    isAdmin: { type : DataTypes.TINYINT(1) , allowNull: false, defaultValue: false },
  },
  {
    sequelize: connection,
    modelName: "User",
  }
);

function encodePassword(user) {
  user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
}

User.addHook("beforeCreate", encodePassword);
User.addHook("beforeUpdate", encodePassword);

module.exports = User;
