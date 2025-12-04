const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

// Get all students or search by name
router.get('/', async (req, res) => {
    try {
        const search = req.query.search || '';
        let students = [];

        if (search) {
            // Search by student name (case-insensitive)
            students = await Student.find({ name: { $regex: search, $options: 'i' } });
        } else {
            students = await Student.find();
        }

        res.render('students', { students, search });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Search by course name
router.get('/searchByCourse', async (req, res) => {
    try {
        const courseName = req.query.course || '';
        let students = [];

        if (courseName) {
            // Find course by name
            const course = await Course.findOne({ name: { $regex: courseName, $options: 'i' } });
            if (course) {
                // Find enrollments for that course
                const enrollments = await Enrollment.find({ courseId: course._id }).populate('studentId');
                students = enrollments.map(enrollment => enrollment.studentId);
            }
        }

        res.render('students', { students, search: courseName });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Show add student form
router.get('/add', (req, res) => {
    res.render('addStudent');  // Render add student form
});

// Handle form submission to add a new student
router.post('/add', async (req, res) => {
    try {
        const { name, age, contact, enrollmentYear } = req.body;
        await Student.create({ name, age, contact, enrollmentYear });
        res.redirect('/students');
    } catch (err) {
        res.status(400).send('Failed to add student');
    }
});

// Show edit student form
router.get('/edit/:id', async (req, res) => {
  try {
      const student = await Student.findById(req.params.id);
      if (!student) return res.status(404).send('Student not found');
      res.render('editStudent', { student });
  } catch (err) {
      res.status(500).send('Server Error');
  }
});

// Handle form submission to update student details
router.post('/edit/:id', async (req, res) => {
  try {
      const { name, age, contact, enrollmentYear } = req.body;
      await Student.findByIdAndUpdate(req.params.id, { name, age, contact, enrollmentYear });
      res.redirect('/students');
  } catch (err) {
      res.status(400).send('Failed to update student');
  }
});

// Delete a student
router.post('/delete/:id', async (req, res) => {
  try {
      await Student.findByIdAndDelete(req.params.id);
      res.redirect('/students');
  } catch (err) {
      res.status(500).send('Failed to delete student');
  }
});


// View student details and their enrolled courses
router.get('/details/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).send('Student not found');

        const enrollments = await Enrollment.find({ studentId: student._id }).populate('courseId');
        const courses = enrollments.map(enrollment => enrollment.courseId);
        
        res.render('studentDetails', { student, courses });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});


module.exports = router;
