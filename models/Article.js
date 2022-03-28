const req = require("express/lib/request");
const { Model, DataTypes } = require("sequelize");
const connection = require("../lib/db");

class Article extends Model {}

Article.init(
  {
    title: {
        type:DataTypes.STRING,
        allowNull:false
    } ,
    content:{
        type:DataTypes.STRING,
        allowNull:false
    },
    tags: {
        type: DataTypes.STRING,
        validate: {
          is: /^[a-z]+(-[a-z]+)*$/,
        }
    },
    authorld: {
        type:DataTypes.STRING,
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
    modelName: "Article",
  }
);

connection.sync().then(() => {
  console.log("Database synced");
});

module.exports = Article;