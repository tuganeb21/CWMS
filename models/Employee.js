const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  employeeNumber: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  position: { type: String, required: true },
  address: { type: String, required: true },
  telephone: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  hiredDate: { type: Date, required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true }
});

module.exports = mongoose.model('Employee', EmployeeSchema);