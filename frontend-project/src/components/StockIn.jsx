import React,{ useState, useEffect } from 'react';
import axios from 'axios';

function StockIn() {
    const [parts, setParts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [form, setForm] = useState({ spare_part_id: '', StockInQuantity: '', StockInDate: '' });

    const loadData = () => {
        axios.get('http://localhost:5000/api/spareparts').then(res => setParts(res.data));
        axios.get('http://localhost:5000/api/stockin').then(res => setTransactions(res.data));
    };

    useEffect(() => { loadData(); }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:5000/api/stockin', form).then(() => {
            loadData();
            setForm({ spare_part_id: '', StockInQuantity: '', StockInDate: '' });
        });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 h-fit">
                <h3 className="text-lg font-bold mb-4 text-slate-800 border-b pb-2">Log Stock-In Additions</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 uppercase">Select Spare Part</label>
                        <select className="w-full mt-1 p-2 border border-slate-300 rounded bg-slate-50 outline-none" value={form.spare_part_id} onChange={e => setForm({...form, spare_part_id: e.target.value})} required>
                            <option value="">-- Choose Item --</option>
                            {parts.map(p => <option key={p.id} value={p.id}>{p.Name} (Available: {p.Quantity})</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 uppercase">Received Quantity</label>
                        <input type="number" className="w-full mt-1 p-2 border border-slate-300 rounded outline-none" value={form.StockInQuantity} onChange={e => setForm({...form, StockInQuantity: e.target.value})} required />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 uppercase">Incoming Date</label>
                        <input type="date" className="w-full mt-1 p-2 border border-slate-300 rounded outline-none" value={form.StockInDate} onChange={e => setForm({...form, StockInDate: e.target.value})} required />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition shadow-sm">Process Intake</button>
                </form>
            </div>
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-slate-200 overflow-x-auto">
                <h3 className="text-lg font-bold mb-4 text-slate-800 border-b pb-2">Stock Intake Ledger</h3>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 text-xs uppercase font-bold">
                            <th className="p-3">Tx ID</th><th className="p-3">Part Name</th><th className="p-3">Quantity Added</th><th className="p-3">Received Date</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {transactions.map(t => (
                            <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                                <td className="p-3 text-slate-500">#{t.id}</td><td className="p-3 font-semibold text-slate-800">{t.part_name}</td><td className="p-3 text-emerald-600 font-bold">+{t.StockInQuantity}</td><td className="p-3 text-slate-600">{new Date(t.StockInDate).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default StockIn;