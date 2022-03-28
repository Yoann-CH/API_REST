const req = require("express/lib/request");
const { Model, DataTypes } = require("sequelize");
const connection = require("../lib/db");

class Comment extends Model {}

Comment.init(
  {
    content: {
        type:DataTypes.STRING,
        allowNull:false
    } ,
    authorld:{
        type:DataTypes.STRING,
        allowNull:false
    },
    articleld: {
        type: DataTypes.STRING,
        allowNull:false
    },
    createdAt: {
        type:DataTypes.DATE,
        allowNull:false
    },
    updatedAt: {
        type:DataTypes.DATE,
        allowNull:false
    },
    deletedAt: {
        type:DataTypes.DATE,
    }
  },
  {
    sequelize: connection,
    paranoid :true,
    modelName: "Comment",
  }
);

connection.sync().then(() => {
  console.log("Database synced");
});

module.exports = Comment;