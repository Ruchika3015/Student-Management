// const mongoose = require('mongoose');

// const studentSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   age: { type: Number, required: true },
//   contact: { type: String, required: true },
//   enrollmentYear: { type: Number, required: true },
// });

// module.exports = mongoose.model('Student', studentSchema);



// const mongoose = require('mongoose');

// const studentSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   rollno: { type: String, required: true, unique: true },
//   password: { type: String, required: true }, 
//   age: { type: Number, required: true },
//   contact: { type: String, required: true },
//   enrollmentYear: { type: Number, required: true },
// });

// module.exports = mongoose.model('Student', studentSchema);

const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollno: { type: String, required: true, unique: true },
  password: { type: String, required: true },   // ← required for login
  age: { type: Number, required: true },
  contact: { type: String, required: true },
  enrollmentYear: { type: Number, required: true }
});

module.exports = mongoose.model('Student', studentSchema);
