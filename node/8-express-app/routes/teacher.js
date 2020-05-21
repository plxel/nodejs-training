const express = require('express');
const createError = require('http-errors');
const data = require('../data.json');

const router = express.Router();

router.get('/', function (req, res, next) {
  if (!req.user) {
    next(createError(401));
  }

  res.render('teacher/index', {
    courses: data.courses.filter(({ authorId }) => authorId === req.user.id),
  });
});

router.get('/courses/:courseId', function (req, res, next) {
  if (!req.user) {
    next(createError(401));
  }

  const course = data.courses.find(({ id }) => id === req.params.courseId);
  if (!course || course.authorId !== req.user.id) {
    next(createError(404));
  }

  res.render('teacher/edit_course', { course });
});

module.exports = router;
