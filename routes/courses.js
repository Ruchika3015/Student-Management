const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// Get all courses
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find();
        res.render('courses', { courses });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Search courses by name
router.get('/search', async (req, res) => {
  const { name } = req.query;
  try {
      const courses = await Course.find({ name: new RegExp(name, 'i') });
      res.render('courses', { courses });
  } catch (err) {
      res.status(500).send('Server Error');
  }
});


// Add a new course
router.post('/add', async (req, res) => {
    try {
        await Course.create(req.body);
        res.redirect('/courses');
    } catch (err) {
        res.status(400).send('Failed to add course');
    }
});

// Delete a course
router.delete('/delete/:id', async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) {
            return res.status(404).send('Course not found');
        }
        res.status(200).send('Course deleted successfully');
    } catch (err) {
        res.status(500).send('Server Error');
    }
});


module.exports = router;
