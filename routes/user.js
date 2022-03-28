const express = require("express");
const verifyJWT = require("../middlewares/verifyJWT");
const User = require("../models/User");
const Article = require("../models/Article");
const router = express.Router();


router.get("", verifyJWT ,(req, res) => {
  if(req.user.isAdmin == 0 || req.user.isAdmin === false){
    User.findOne({where: {id:req.user.id},attributes:['firstname','lastname','email','createdAt','updatedAt', 'isAdmin']}).then((user) => {
      if (!user) res.sendStatus(404);
      else res.json(user);
    });
  }
  else{
  const criteria = req.query;
  User.findAll({
    attributes:['firstname','lastname','email','createdAt','updatedAt', 'isAdmin']
    ,
    where: criteria,
  }).then((users) =>
  res.json({ users }));
  }
});

router.post("", (req, res) => {
  User.create(req.body).then((user) => res.status(201).json({
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    isAdmin: user.isAdmin}));
});


router.get("/:id",verifyJWT, (req, res) => {
  if(req.user.isAdmin == 0 || req.user.isAdmin === false){
    const id = req.user.id;
    if(id == req.params.id){
      User.findOne({where: {id:id},attributes:['firstname','lastname','email','createdAt','updatedAt', 'isAdmin']}).then((user) => {
        if (!user) res.sendStatus(404);
        else res.json(user);
      });
    }
    else{
      res.sendStatus(401);
    }
  }
  else{
    const id = parseInt(req.params.id);
    User.findOne({where: {id: id},attributes:['firstname','lastname','email','createdAt','updatedAt', 'isAdmin']}).then((user) => {
    if (!user) res.sendStatus(404);
    else res.json(user);
  });
  }
});


router.delete("/:id",verifyJWT, (req, res) => {
  if(req.user.isAdmin == 0 || req.user.isAdmin === false){
    const id = req.user.id;
    if(id == req.params.id){
      User.destroy({
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
  else{
    const id = parseInt(req.params.id);
    User.destroy({
      where: {
        id: id,
      },
    }).then((nbDeleted) => {
      if (!nbDeleted) res.sendStatus(404);
      else res.sendStatus(204);
    });
  }
});

router.put("/:id",verifyJWT, (req, res) => {
  if(req.user.isAdmin == 0 || req.user.isAdmin === false){
    const id = req.user.id;
    if(id == req.params.id && !req.body.isAdmin){
      User.update(req.body, {
        where: {
          id: id,
        },
      }).then(([nbUpdated]) => {
        if (!nbUpdated) res.sendStatus(404);
        else User.findOne({where: {id:req.user.id},attributes:['firstname','lastname','email','createdAt','updatedAt', 'isAdmin']}).then((user) => res.json(user));
      });
    }
    else{
      res.sendStatus(401);
    }
  }
  else{
  const id = parseInt(req.params.id);
  User.update(req.body, {
    where: {
      id: id,
    },
  }).then(([nbUpdated]) => {
    if (!nbUpdated) res.sendStatus(404);
    else User.findOne({where: {id:req.user.id},attributes:['firstname','lastname','email','createdAt','updatedAt', 'isAdmin']}).then((user) => res.json(user));
  });
  }
});





module.exports = router;
