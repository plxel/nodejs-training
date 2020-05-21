const express = require('express');

const router = express.Router();

router.get('/sign_in', function(req, res, next) {
  res.render('sign_in');
});

router.get('/sign_up', function(req, res, next) {
  res.render('sign_up');
});

module.exports = router;
