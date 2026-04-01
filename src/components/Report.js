import { useState } from 'react';
import axios from 'axios';

export default function Report() {
  const [report, setReport] = useState([]);
  const [month, setMonth] = useState('');
  const [loading, setLoading] = useState(false);

  const fetch = () => {
    setLoading(true);
    axios.get(`http://localhost:5000/api/salary/report${month ? '?month=' + month : ''}`, { withCredentials: true })
      .then(r => setReport(r.data))
      .finally(() => setLoading(false));
  };

  const fmt = (n) => n?.toLocaleString() || '-';

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-green-700">Monthly Payroll Report</h2>
      <div className="flex gap-3 mb-6">
        <input type="month" className="p-2 border rounded flex-1" value={month}
          onChange={e => setMonth(e.target.value)} />
        <button onClick={fetch}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded transition">
          View Report
        </button>
      </div>

      {loading ? <p>Loading…</p> :
        report.length === 0 ? <p className="text-gray-600">No data</p> :
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border text-sm">
              <thead className="bg-green-50">
                <tr>
                  <th className="border p-2">First Name</th>
                  <th className="border p-2">Last Name</th>
                  <th className="border p-2">Position</th>
                  <th className="border p-2">Department</th>
                  <th className="border p-2">Net Salary</th>
                </tr>
              </thead>
              <tbody>
                {report.map((r, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="border p-2">{r.firstName}</td>
                    <td className="border p-2">{r.lastName}</td>
                    <td className="border p-2">{r.position}</td>
                    <td className="border p-2">{r.department}</td>
                    <td className="border p-2">{fmt(r.netSalary)} RWF</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      }
    </div>
  );
}