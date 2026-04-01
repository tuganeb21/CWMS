const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
  departmentCode: { type: String, required: true, unique: true },
  departmentName: { type: String, required: true },
  grossSalary: { type: Number, required: true }
});

module.exports = mongoose.model('Department', DepartmentSchema);