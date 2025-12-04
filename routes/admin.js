const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/auth');

router.get('/', adminAuth, (req, res) => {
    res.render('admin', { admin: req.admin });
});

module.exports = router;
