const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {

  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
  .then( () => { res.status(201).json({message : 'Sauce create !' }); })
  .catch( (error) => {res.status(400).json({ error }); })
};

exports.getSauces = (req, res, next) => {

  Sauce.find()
  .then( (sauces) => { res.status(200).json(sauces); })
  .catch( (error) => { res.status(400).json({ error }); })
};
 
exports.getSauceById = (req, res, next) => {

  Sauce.findOne({ _id: req.params.id})
  .then((sauce) => {res.status(200).json(sauce);})
  .catch( (error) => { res.status(404).json({ error }); })
};

exports.modifySauce = (req, res, next) => {

  const sauceObject = req.file ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modified !'}))
    .catch(error => res.status(400).json({ error }))
};

exports.deleteSauce = (req, res, next) => {

  Sauce.findOne({ _id: req.params.id })
  .then(sauce => {
    const filename = sauce.imageUrl.split('/images/')[1];
    fs.unlink(`images/${filename}`, () => {
      Sauce.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Sauce deleted!'}))
      .catch(error => res.status(400).json({ error }));
    });
  })
  .catch(error => res.status(500).json({ error }));
};

exports.countLikeSauce = (req, res, next) => {

  if (req.body.like === 1) {
    Sauce.updateOne({ _id: req.params.id }, 
    {
      $inc: {likes: 1} ,
      $push: {usersLiked: req.body.userId}
    })
    .then (() => {res.status(201).json({ message: 'Sauce liked !'});})
    .catch(error => res.status(400).json({ error }));
  } 
  if (req.body.like === -1) {
    Sauce.updateOne({ _id: req.params.id }, 
    {
      $inc: {dislikes: 1} ,
      $push: {usersDisliked: req.body.userId}
    })
    .then (() => {res.status(201).json({ message: 'Sauce disliked !'});})
    .catch(error => res.status(400).json({ error }));
  }
  if (req.body.like === 0) {
    Sauce.findOne({ _id: req.params.id})
    .then(sauce => {
      if (sauce.usersLiked.includes(req.body.userId)) {
        Sauce.updateOne({_id: req.params.id}, 
          {
            $inc: {likes: -1},
            $pull: {usersLiked: req.body.userId},
          })
          .then((sauce) => {res.status(201).json({ message: 'like -1'})}) 
          .catch(error => res.status(400).json({ error }))
      } 
      if (sauce.usersDisliked.includes(req.body.userId)) {
        Sauce.updateOne({_id: req.params.id}, 
          {
            $inc: {dislikes: -1},
            $pull: {usersDisliked: req.body.userId}
          })
          .then((sauce) => {res.status(201).json({ message: 'dislike -1'})}) 
          .catch(error => res.status(400).json({ error }))
      }
    })
    .catch(error => res.status(400).json({ error }));
  }
};
