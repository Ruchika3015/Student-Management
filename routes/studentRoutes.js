const express = require("express");
const Student = require("../models/Student");
const router = express.Router();

// Student Dashboard
router.get("/dashboard", async (req, res) => {
    const student = await Student.findById(req.user.id);
    res.render("student/dashboard", { student });
});

// View Profile
router.get("/profile", async (req, res) => {
    const student = await Student.findById(req.user.id);
    res.render("student/viewProfile", { student });
});

// Edit Profile Page
router.get("/edit-profile", async (req, res) => {
    const student = await Student.findById(req.user.id);
    res.render("student/editProfile", { student });
});

// Update Profile
router.post("/update-profile", async (req, res) => {
    await Student.findByIdAndUpdate(req.user.id, req.body);
    res.redirect("/student/profile");
});

module.exports = router;
