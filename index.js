require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');

const adminAuth = require('./middleware/auth');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const studentRoutes = require('./routes/studentRoutes');
const studentsRoutes = require('./routes/students');
const coursesRoutes = require('./routes/courses');
const enrollmentsRoutes = require('./routes/enrollments');

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/student', studentRoutes);

app.use('/students', adminAuth, studentsRoutes);
app.use('/courses', adminAuth, coursesRoutes);
app.use('/enrollments', adminAuth, enrollmentsRoutes);

app.get('/', adminAuth, (req, res) => {
  res.render('admin');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



