const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subjectController');

// GET /api/subjects
router.get('/', subjectController.getSubjects);

// GET /api/topics/:subjectId
router.get('/topics/:subjectId', subjectController.getTopicsBySubject);

module.exports = router;
