const express = require('express');
const createError = require('http-errors');
const data = require('../data.json');

const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('courses', { courses: data.courses });
});

router.get('/:courseId', function (req, res, next) {
  const { courseId } = req.params;
  const course = data.courses.find(({ id }) => id === courseId);
  if (!course) {
    next(createError(404));
  }

  const lessons = data.lessons
    .filter(lesson => lesson.courseId === courseId)
    .map(({ id, title, description }) => ({ id, title, description }));
  
  const hasAccess = req.user &&
    (req.user.id === course.authorId || course.members.includes(req.user.id));
  
  res.render('course', { course, lessons, hasAccess });
});

router.get('/:courseId/lessons/:lessonId', function (req, res, next) {
  if (!req.user) {
    next(createError(401));
  }

  const { courseId, lessonId } = req.params;
  const course = data.courses.find(({ id }) => id === courseId);
  if (!course) {
    next(createError(404));
  }
  if (course.authorId !== req.user.id && !course.members.includes(req.user.id)) {
    next(createError(401)); 
  }

  const lesson = data.lessons.find(({ id }) => id === lessonId);
  if (!lesson) {
    next(createError(404));
  }

  const comments = data.comments.filter(comment => comment.lessonId === lessonId);

  res.render('lesson', { course, lesson, comments });
});

module.exports = router;
