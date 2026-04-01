import { useState, useEffect } from 'react';
import axios from 'axios';

export default function EmployeeForm() {
  const [form, setForm] = useState({
    employeeNumber: '', firstName: '', lastName: '', position: '',
    address: '', telephone: '', gender: 'Male', hiredDate: '', department: ''
  });
  const [depts, setDepts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    axios.get('http://localhost:5000/api/department', { withCredentials: true })
      .then(r => setDepts(r.data));
    loadEmployees();
  }, []);

  const loadEmployees = () => {
    axios.get('http://localhost:5000/api/employee', { withCredentials: true })
      .then(r => setEmployees(r.data))
      .catch(() => setEmployees([]));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/employee', form, { withCredentials: true })
      .then(() => {
        alert('Employee added');
        setForm({ ...form, employeeNumber: '', firstName: '', lastName: '', position: '', address: '', telephone: '', hiredDate: '', department: '' });
        loadEmployees();
      })
      .catch(err => alert(err.response?.data?.error || 'Error'));
  };

  const startEdit = (emp) => {
    setEditing(emp._id);
    setEditForm({ ...emp });
  };

  const cancelEdit = () => {
    setEditing(null);
    setEditForm({});
  };

  const saveEdit = async () => {
    await axios.put(`http://localhost:5000/api/employee/${editing}`, editForm, { withCredentials: true });
    cancelEdit();
    loadEmployees();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this employee?')) {
      await axios.delete(`http://localhost:5000/api/employee/${id}`, { withCredentials: true });
      loadEmployees();
    }
  };

  const fmt = (n) => n?.toLocaleString() || '-';

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Add Employee</h2>

      {/* ---------- ADD FORM ---------- */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
        <input placeholder="Employee Number" className="p-2 border rounded" required
          onChange={e => setForm({ ...form, employeeNumber: e.target.value })} />
        <input placeholder="First Name" className="p-2 border rounded" required
          onChange={e => setForm({ ...form, firstName: e.target.value })} />
        <input placeholder="Last Name" className="p-2 border rounded" required
          onChange={e => setForm({ ...form, lastName: e.target.value })} />
        <input placeholder="Position" className="p-2 border rounded" required
          onChange={e => setForm({ ...form, position: e.target.value })} />
        <input placeholder="Address" className="p-2 border rounded" required
          onChange={e => setForm({ ...form, address: e.target.value })} />
        <input placeholder="Telephone" className="p-2 border rounded" required
          onChange={e => setForm({ ...form, telephone: e.target.value })} />
        <select className="p-2 border rounded" required
          onChange={e => setForm({ ...form, gender: e.target.value })}>
          <option>Male</option><option>Female</option><option>Other</option>
        </select>
        <input type="date" className="p-2 border rounded" required
          onChange={e => setForm({ ...form, hiredDate: e.target.value })} />
        <select className="md:col-span-2 p-2 border rounded" required
          onChange={e => setForm({ ...form, department: e.target.value })}>
          <option value="">Select Department</option>
          {depts.map(d => <option key={d._id} value={d._id}>{d.departmentName}</option>)}
        </select>
        <button type="submit"
          className="md:col-span-2 bg-green-600 hover:bg-green-700 text-white p-2 rounded transition">
          Add Employee
        </button>
      </form>

      {/* ---------- EMPLOYEE LIST ---------- */}
      <h3 className="text-lg font-semibold mb-3">Employee List</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">No.</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Position</th>
              <th className="border p-2">Deptment</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Gross Salary</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(e => (
              <tr key={e._id} className="hover:bg-gray-50">
                <td className="border p-2">{e.employeeNumber}</td>
                <td className="border p-2">{e.firstName} {e.lastName}</td>
                <td className="border p-2">{e.position}</td>
                <td className="border p-2">{e.department?.departmentName || '—'}</td>
                <td className="border p-2">{e.telephone}</td>
                <td className="border p-2">{fmt(e.department?.grossSalary)} RWF</td>
                <td className="border p-2 text-xs">
                  {editing === e._id ? (
                    <>
                      <button onClick={saveEdit}
                        className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded mr-1">
                        Save
                      </button>
                      <button onClick={cancelEdit}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded">
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(e)}
                        className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded mr-1">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(e._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded">
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---------- EDIT FORM (inline) ---------- */}
      {editing && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h4 className="font-medium mb-2">Edit Employee</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input placeholder="Employee Number" className="p-2 border rounded"
              value={editForm.employeeNumber || ''} onChange={v => setEditForm({ ...editForm, employeeNumber: v.target.value })} />
            <input placeholder="First Name" className="p-2 border rounded"
              value={editForm.firstName || ''} onChange={v => setEditForm({ ...editForm, firstName: v.target.value })} />
            <input placeholder="Last Name" className="p-2 border rounded"
              value={editForm.lastName || ''} onChange={v => setEditForm({ ...editForm, lastName: v.target.value })} />
            <input placeholder="Position" className="p-2 border rounded"
              value={editForm.position || ''} onChange={v => setEditForm({ ...editForm, position: v.target.value })} />
            <input placeholder="Address" className="p-2 border rounded"
              value={editForm.address || ''} onChange={v => setEditForm({ ...editForm, address: v.target.value })} />
            <input placeholder="Telephone" className="p-2 border rounded"
              value={editForm.telephone || ''} onChange={v => setEditForm({ ...editForm, telephone: v.target.value })} />
            <select className="p-2 border rounded"
              value={editForm.gender || ''} onChange={v => setEditForm({ ...editForm, gender: v.target.value })}>
              <option>Male</option><option>Female</option><option>Other</option>
            </select>
            <input type="date" className="p-2 border rounded"
              value={editForm.hiredDate?.slice(0,10) || ''} onChange={v => setEditForm({ ...editForm, hiredDate: v.target.value })} />
            <select className="md:col-span-2 p-2 border rounded"
              value={editForm.department || ''} onChange={v => setEditForm({ ...editForm, department: v.target.value })}>
              <option value="">Select Department</option>
              {depts.map(d => <option key={d._id} value={d._id}>{d.departmentName}</option>)}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}