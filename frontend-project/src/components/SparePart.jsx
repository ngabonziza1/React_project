import { useState, useEffect } from 'react';
import axios from 'axios';

function SparePart() {
    const [parts, setParts] = useState([]);
    const [form, setForm] = useState({ Name: '', Category: '', Quantity: '', UnitPrice: '' });

    const fetchParts = () => {
        axios.get('http://localhost:5000/api/spareparts').then(res => setParts(res.data));
    };

    useEffect(() => { fetchParts(); }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:5000/api/spareparts', form).then(() => {
            fetchParts();
            setForm({ Name: '', Category: '', Quantity: '', UnitPrice: '' });
        });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 h-fit">
                <h3 className="text-lg font-bold mb-4 text-slate-800 border-b pb-2">Add Spare Part</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 uppercase">Part Name</label>
                        <input type="text" className="w-full mt-1 p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={form.Name} onChange={e => setForm({...form, Name: e.target.value})} required />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 uppercase">Category</label>
                        <input type="text" className="w-full mt-1 p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={form.Category} onChange={e => setForm({...form, Category: e.target.value})} required />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 uppercase">Initial Quantity</label>
                        <input type="number" className="w-full mt-1 p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={form.Quantity} onChange={e => setForm({...form, Quantity: e.target.value})} required />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 uppercase">Unit Price (RWF)</label>
                        <input type="number" step="0.01" className="w-full mt-1 p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={form.UnitPrice} onChange={e => setForm({...form, UnitPrice: e.target.value})} required />
                    </div>
                    <button type="submit" className="w-full bg-emerald-600 text-white py-2 rounded font-bold hover:bg-emerald-700 shadow-sm transition">Save Part to Stock</button>
                </form>
            </div>
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-slate-200 overflow-x-auto">
                <h3 className="text-lg font-bold mb-4 text-slate-800 border-b pb-2">Master Spare Parts List</h3>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 text-xs uppercase font-bold">
                            <th className="p-3">ID</th><th className="p-3">Name</th><th className="p-3">Category</th><th className="p-3">Quantity</th><th className="p-3">Unit Price</th><th className="p-3">Total Value</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {parts.map(p => (
                            <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                                <td className="p-3 text-slate-500">{p.id}</td>
                                <td className="p-3 font-semibold text-slate-800">{p.Name}</td>
                                <td className="p-3 text-slate-600">{p.Category}</td>
                                <td className="p-3 font-medium">{p.Quantity}</td>
                                <td className="p-3">{p.UnitPrice} RWF</td>
                                <td className="p-3 font-bold text-blue-600">{p.TotalPrice} RWF</td>
                            </tr>
                        ))}

                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default SparePart;