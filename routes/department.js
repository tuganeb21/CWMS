const express = require('express');
const router = express.Router();
const Department = require('../models/Department');

const seed = [
  { departmentCode: 'CW', departmentName: 'Carwash', grossSalary: 300000 },
  { departmentCode: 'ST', departmentName: 'Stock', grossSalary: 200000 },
  { departmentCode: 'MC', departmentName: 'Mechanic', grossSalary: 450000 },
  { departmentCode: 'ADMS', departmentName: 'Administration Staff', grossSalary: 600000 }
];

router.get('/seed', async (req, res) => {
  await Department.deleteMany({});
  await Department.insertMany(seed);
  res.json({ message: 'Departments seeded' });
});

router.get('/', async (req, res) => {
  const depts = await Department.find();
  res.json(depts);
});

router.post('/', async (req, res) => {
  const dept = new Department(req.body);
  await dept.save();
  res.status(201).json(dept);
});

module.exports = router;