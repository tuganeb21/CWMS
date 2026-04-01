const express = require('express');
const router = express.Router();
const Salary = require('../models/Salary');
const Employee = require('../models/Employee');

// GET ALL SALARIES (for Salary Management page)
router.get('/', async (req, res) => {
  try {
    const salaries = await Salary.find()
      .populate({
        path: 'employee',
        populate: { path: 'department' }
      })
      .sort({ month: -1 });

    res.json(salaries);
  } catch (err) {
    console.error("Error fetching salaries:", err);
    res.status(500).json({ error: err.message });
  }
});

// ADD NEW SALARY
router.post('/', async (req, res) => {
  try {
    const { employee, month, grossSalary, totalDeduction } = req.body;

    if (!employee || !month || !grossSalary) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const netSalary = grossSalary - (totalDeduction || 0);

    const salary = new Salary({
      employee,
      month,
      grossSalary,
      totalDeduction: totalDeduction || 0,
      netSalary
    });

    await salary.save();
    res.status(201).json(salary);
  } catch (err) {
    console.error("Error adding salary:", err);
    res.status(400).json({ error: err.message });
  }
});

// DELETE SALARY
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Salary.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ error: 'Salary record not found' });
    }

    res.json({ message: 'Salary deleted successfully' });
  } catch (err) {
    console.error("Error deleting salary:", err);
    res.status(500).json({ error: err.message });
  }
});

// GENERATE MONTHLY PAYROLL REPORT
router.get('/report', async (req, res) => {
  try {
    const { month } = req.query; // e.g., ?month=2025-11

    const match = month ? { month } : {};

    const report = await Salary.aggregate([
      { $match: match },
      {
        $lookup: {
          from: 'employees',
          localField: 'employee',
          foreignField: '_id',
          as: 'emp'
        }
      },
      { $unwind: '$emp' },
      {
        $lookup: {
          from: 'departments',
          localField: 'emp.department',
          foreignField: '_id',
          as: 'dept'
        }
      },
      { $unwind: '$dept' },
      {
        $project: {
          firstName: '$emp.firstName',
          lastName: '$emp.lastName',
          position: '$emp.position',
          department: '$dept.departmentName',
          netSalary: '$netSalary'
        }
      },
      { $sort: { lastName: 1 } }
    ]);

    res.json(report);
  } catch (err) {
    console.error("Error generating report:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;