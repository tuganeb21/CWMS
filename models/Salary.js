const mongoose = require('mongoose');

const SalarySchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  month: { type: String, required: true },
  grossSalary: { type: Number, required: true },
  totalDeduction: { type: Number, required: true },
  netSalary: { type: Number, required: true }
});

module.exports = mongoose.model('Salary', SalarySchema);