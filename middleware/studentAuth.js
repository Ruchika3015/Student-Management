// const jwt = require('jsonwebtoken');

// module.exports = (req, res, next) => {
//     const token = req.cookies.studentToken;

//     if (!token) return res.redirect('/student/login');

//     try {
//         const verified = jwt.verify(token, process.env.JWT_SECRET);
//         req.student = verified;
//         next();
//     } catch (err) {
//         return res.redirect('/student/login');
//     }
// };






const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.cookies.token; 

    if (!token) {
        return res.redirect("/auth/student-login");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (decoded.role !== "student") {
            return res.redirect("/auth/student-login");
        }

        req.user = decoded; 
        next();

    } catch (err) {
        return res.redirect("/auth/student-login");
    }
};

