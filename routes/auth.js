const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// =========================
// STUDENT REGISTER PAGE
// =========================
router.get("/student-register", (req, res) => {
    res.render("studentRegister");   // Make studentRegister.ejs
});

// =========================
// STUDENT REGISTER SUBMIT
// =========================
router.post("/student-register", async (req, res) => {
    const { name, rollno, password, age, contact, enrollmentYear } = req.body;

    try {
        const exists = await Student.findOne({ rollno });
        if (exists) {
            return res.send("Student already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newStudent = new Student({
            name,
            rollno,
            password: hashedPassword,
            age,
            contact,
            enrollmentYear
        });

        await newStudent.save();

        res.send("Student Registered Successfully! Now Login.");

    } catch (err) {
        console.log(err);
        res.send("Server Error");
    }
});

// =========================
// STUDENT LOGIN
// =========================
router.post('/student-login', async (req, res) => {
    const { rollno, password } = req.body;

    try {
        const student = await Student.findOne({ rollno });

        if (!student) {
            return res.send("Invalid student credentials");
        }

        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) {
            return res.send("Invalid student credentials");
        }

        const token = jwt.sign(
            { id: student._id, role: "student" },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.cookie("token", token, { httpOnly: true });
        res.redirect("/student/dashboard");

    } catch (err) {
        console.log(err);
        res.send("Server error");
    }
});

// =========================
// ADMIN LOGIN PAGE
// =========================
router.get('/login', (req, res) => {
    res.render('login');
});

// =========================
// ADMIN LOGIN SUBMIT
// =========================
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.render('login', { error: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.render('login', { error: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true });

        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.render('login', { error: 'An error occurred. Please try again.' });
    }
});

// =========================
// ADMIN SIGNUP PAGE
// =========================
router.get('/admin/signup', (req, res) => {
    res.render('signup');  
});

// =========================
// ADMIN SIGNUP SUBMIT
// =========================
router.post('/admin/signup', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.render('signup', { error: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = new Admin({ name, email, password: hashedPassword });
        await newAdmin.save();

        const token = jwt.sign({ id: newAdmin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true });

        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.render('signup', { error: 'An error occurred. Please try again.' });
    }
});

// =========================
// LOGOUT
// =========================
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
});

module.exports = router;
