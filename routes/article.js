const express = require("express");
const Sequelize = require("sequelize");
const Article = require("../models/Article");
const router = express.Router();
const Op = Sequelize.Op;

router.get("", (req, res) => {
  if(req.user.isAdmin == 0 || req.user.isAdmin === false){
    const criteria = req.query;
    Article.findAll({
      attributes:['title','content','tags','authorld','createdAt','updatedAt'],
      where: criteria,
    }).then((users) => res.json(users)
    )
  }
  else{
    const criteria = req.query;
    Article.findAll({
    where: criteria,
    paranoid: false,
    attributes:['title','content','tags','authorld','createdAt','updatedAt']
    }).then((users) => res.json(users)
    )
  }
});

router.post("", (req, res) => {
  Article.create({title:req.body.title,content:req.body.content, tags: req.body.tags ,authorld: req.user.lastname.concat(' ',req.user.firstname)}).then((user) => res.status(201).json({
    title: user.title,
    content: user.content,
    tags: user.tags,
    authorld: user.authorld,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
    }));
});

router.get("/:t", (req, res) => {
  Article.findAll({where: {[Op.or]: [{tags: req.params.t}, {title: req.params.t}]},attributes:['title','content','tags','authorld','createdAt','updatedAt']}).then((user) => {
    if (!user) res.sendStatus(404);
    else res.json(user);
  });
});



router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if(req.user.isAdmin == 0 || req.user.isAdmin === false){
    Article.findOne({where: {id: id}}).then((user) =>{
      if(!user) res.sendStatus(404);
      else{
        const n = req.user.lastname.concat(' ',req.user.firstname);
        if( n == user.authorld){
          Article.destroy({
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
    }
    }); 
  }
  else{
    Article.destroy({
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
          Article.update(req.body, {
            where: {
              id: id,
            }
            }).then(([nbUpdated]) => {
            if (!nbUpdated) res.sendStatus(404);
            else Article.findOne({where: {
              id: id,
            },
            attributes:['title','content','tags','authorld','createdAt','updatedAt']}).then((user) => res.json(user));
          });
        }
        else{
          res.sendStatus(401);
        }
      }
    })
  }
  else{
    Article.update(req.body, {
      where: {
        id: id,
      }
      }).then(([nbUpdated]) => {
      if (!nbUpdated) res.sendStatus(404);
      else Article.findOne({where: {
        id: id,
      },
      attributes:['title','content','tags','authorld','createdAt','updatedAt']}).then((user) => res.json(user));
    });
  }
});

module.exports = router;
