const express = require("express");
const Sequelize = require("sequelize");
const Article = require("../models/Article");
const Comment = require("../models/Comment");
const router = express.Router();
const Op = Sequelize.Op;

router.get("", (req, res) => {
  if(req.user.isAdmin == 0 || req.user.isAdmin === false){
    const criteria = req.query;
    Comment.findAll({
      attributes:['content','authorld','articleld','createdAt','updatedAt'],
      where: criteria,
    }).then((users) => res.json(users)
    )
  }
  else{
    const criteria = req.query;
        Comment.findAll({
    where: criteria,
    paranoid: false,
    attributes:['content','authorld','articleld','createdAt','updatedAt']
    }).then((users) => res.json(users)
    )
  }
});

router.post("", (req, res) => {
    Article.findOne({where: {title: req.body.articleld}}).then((user) =>{
        if(!user) res.sendStatus(404);
        Comment.create({content:req.body.content, articleld: user.title ,authorld: req.user.lastname.concat(' ',req.user.firstname)}).then((user) => res.status(201).json({
          content: user.content,
          authorld: user.authorld,
          articleld: user.articleld,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
          }));
    })
});

router.get("/:t", (req, res) => {
  Comment.findAll({where: {[Op.or]: [{authorld: req.params.t}, {articleld: req.params.t}]},attributes:['content','authorld','articleld','createdAt','updatedAt']}).then((user) => {
    if (!user) res.sendStatus(404);
    else res.json(user);
  });
});



router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if(req.user.isAdmin == 0 || req.user.isAdmin === false){
    Comment.findOne({where: {id: id}}).then((user) =>{
      const n = req.user.lastname.concat(' ',req.user.firstname);
      if( n == user.authorld){
        Comment.destroy({
          where: {
            id: id,
          },
        }).then((nbDeleted) => {
          if (!nbDeleted) res.sendStatus(404);
          else res.sendStatus(204);
        });
      }
      else{
        res.sendStatus(401);
      }
    });
  }
  else{
    Comment.destroy({
      where: {
        id: id,
      },
    }).then((nbDeleted) => {
      if (!nbDeleted) res.sendStatus(404);
      else res.sendStatus(204);
    });
  }
});


router.put("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if(req.user.isAdmin == 0 || req.user.isAdmin === false){
    Article.findOne({where: {id: id}}).then((user) =>{
      if(!user) res.sendStatus(404);
      else{
        const n = req.user.lastname.concat(' ',req.user.firstname);
        if( n == user.authorld){
          Comment.update(req.body, {
            where: {
              id: id,
            }
            }).then(([nbUpdated]) => {
            if (!nbUpdated) res.sendStatus(404);
            else Article.findOne({where: {
              id: id,
            },
            attributes:['content','authorld','articleld','createdAt','updatedAt']}).then((user) => res.json(user));
          });
        }
        else{
          res.sendStatus(401);
        }
      }
    })
  }
  else{
    Comment.update(req.body, {
      where: {
        id: id,
      }
      }).then(([nbUpdated]) => {
      if (!nbUpdated) res.sendStatus(404);
      else Article.findOne({where: {
        id: id,
      },
      attributes:['content','authorld','articleld','createdAt','updatedAt']}).then((user) => res.json(user));
    });
  }
});

module.exports = router;
