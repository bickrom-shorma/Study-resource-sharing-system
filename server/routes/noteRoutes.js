const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public search & list routes
router.get('/search', noteController.searchNotes);
router.get('/', noteController.getNotes);
router.get('/download/:id', noteController.downloadNote);

// Protected user notes route (MUST be before /:id)
router.get('/my-notes', authMiddleware, noteController.getMyNotes);

// Public single note view route
router.get('/:id', noteController.getNoteById);

// Protected upload route (PDF file upload)
router.post('/', authMiddleware, upload.single('file'), noteController.uploadNote);

module.exports = router;
