const express = require('express');

const app = express();

app.use((req, res, next) => {
  res.json({ message : 'requete good'});
  next();
});

module.exports = app;