import { useState, useEffect } from 'react';
import axios from 'axios';

export default function SalaryForm() {
  const [salaries, setSalaries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ employee: '', month: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [s, e] = await Promise.all([
        axios.get('http://localhost:5000/api/salary', { withCredentials: true }),
        axios.get('http://localhost:5000/api/employee', { withCredentials: true })
      ]);
      setSalaries(s.data);
      setEmployees(e.data);
    } catch (err) {
      alert('Cannot connect to backend. Is it running on port 5000?');
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const emp = employees.find(x => x._id === form.employee);
    if (!emp?.department) return alert('Invalid employee');
    const gross = emp.department.grossSalary;
    const deduction = 0;
    const net = gross - deduction;

    await axios.post('http://localhost:5000/api/salary', {
      employee: form.employee,
      month: form.month,
      grossSalary: gross,
      totalDeduction: deduction,
      netSalary: net
    }, { withCredentials: true });
    setForm({ employee: '', month: '' });
    loadData();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this salary record?')) {
      await axios.delete(`http://localhost:5000/api/salary/${id}`, { withCredentials: true });
      loadData();
    }
  };

  const fmt = (n) => n?.toLocaleString() || '-';

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-green-700">Salary Management</h2>

      <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        <select
          className="p-2 border rounded"
          value={form.employee}
          onChange={e => setForm({ ...form, employee: e.target.value })}
          required
        >
          <option value="">Select Employee</option>
          {employees.map(e => (
            <option key={e._id} value={e._id}>
              {e.firstName} {e.lastName} ({e.department?.departmentName || '—'})
            </option>
          ))}
        </select>
        <input
          type="month"
          className="p-2 border rounded"
          value={form.month}
          onChange={e => setForm({ ...form, month: e.target.value })}
          required
        />
        <button
          type="submit"
          className="md:col-span-2 bg-green-600 hover:bg-green-700 text-white p-2 rounded transition"
        >
          Add Salary
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Employee</th>
              <th className="border p-2 text-left">Month</th>
              <th className="border p-2 text-left">Net Salary</th>
              <th className="border p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {salaries.map(s => (
              <tr key={s._id} className="hover:bg-gray-50">
                <td className="border p-2">{s.employee?.firstName} {s.employee?.lastName}</td>
                <td className="border p-2">{s.month}</td>
                <td className="border p-2">{fmt(s.netSalary)} RWF</td>
                <td className="border p-2 text-xs">
                  <button
                    onClick={() => handleDelete(s._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}