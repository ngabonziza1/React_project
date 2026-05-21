import React, { useState, useEffect } from 'react';
import axios from 'axios';

function StockOut() {
    const [parts, setParts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [form, setForm] = useState({ spare_part_id: '', StockOutQuantity: '', StockOutUnitPrice: '', StockOutDate: '' });
    const [editingId, setEditingId] = useState(null);

    const loadData = () => {
        axios.get('http://localhost:5000/api/spareparts').then(res => setParts(res.data));
        axios.get('http://localhost:5000/api/stockout').then(res => setTransactions(res.data));
    };

    useEffect(() => { loadData(); }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            axios.put(`http://localhost:5000/api/stockout/${editingId}`, form)
                .then(() => {
                    loadData();
                    setEditingId(null);
                    setForm({ spare_part_id: '', StockOutQuantity: '', StockOutUnitPrice: '', StockOutDate: '' });
                }).catch(err => alert(err.response?.data?.message || 'Transaction error'));
        } else {
            axios.post('http://localhost:5000/api/stockout', form)
                .then(() => {
                    loadData();
                    setForm({ spare_part_id: '', StockOutQuantity: '', StockOutUnitPrice: '', StockOutDate: '' });
                }).catch(err => alert(err.response?.data?.message || 'Transaction error'));
        }
    };

    const handleEdit = (t) => {
        setEditingId(t.id);
        setForm({
            spare_part_id: t.spare_part_id,
            StockOutQuantity: t.StockOutQuantity,
            StockOutUnitPrice: t.StockOutUnitPrice,
            StockOutDate: t.StockOutDate.split('T')[0]
        });
    };

    const handleDelete = (id) => {
        if (window.confirm("Delete this out-bound transaction profile permanently?")) {
            axios.delete(`http://localhost:5000/api/stockout/${id}`).then(() => loadData());
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 h-fit">
                <h3 className="text-lg font-bold mb-4 text-slate-800 border-b pb-2">{editingId ? 'Modify Tx Entry' : 'Issue Stock Out'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 uppercase">Select Spare Part</label>
                        <select className="w-full mt-1 p-2 border border-slate-300 rounded bg-slate-100" value={form.spare_part_id} onChange={e => setForm({...form, spare_part_id: e.target.value})} disabled={editingId !== null} required>
                            <option value="">-- Choose Item --</option>
                            {parts.map(p => <option key={p.id} value={p.id}>{p.Name} (Available: {p.Quantity})</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 uppercase">Quantity Issued</label>
                        <input type="number" className="w-full mt-1 p-2 border border-slate-300 rounded outline-none" value={form.StockOutQuantity} onChange={e => setForm({...form, StockOutQuantity: e.target.value})} required />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 uppercase">Release Unit Price</label>
                        <input type="number" step="0.01" className="w-full mt-1 p-2 border border-slate-300 rounded outline-none" value={form.StockOutUnitPrice} onChange={e => setForm({...form, StockOutUnitPrice: e.target.value})} required />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 uppercase">Release Date</label>
                        <input type="date" className="w-full mt-1 p-2 border border-slate-300 rounded outline-none" value={form.StockOutDate} onChange={e => setForm({...form, StockOutDate: e.target.value})} required />
                    </div>
                    <div className="flex gap-2 pt-2">
                        <button type="submit" className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2 rounded font-bold transition">{editingId ? 'Apply Edit' : 'Release Items'}</button>
                        {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ spare_part_id: '', StockOutQuantity: '', StockOutUnitPrice: '', StockOutDate: '' }); }} className="bg-slate-400 text-white px-4 rounded font-bold hover:bg-slate-500">Cancel</button>}
                    </div>
                </form>
            </div>
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-slate-200 overflow-x-auto">
                <h3 className="text-lg font-bold mb-4 text-slate-800 border-b pb-2">Stock Outflow Management Ledger</h3>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 text-xs uppercase font-bold">
                            <th className="p-3">Item Name</th><th className="p-3">Qty</th><th className="p-3">Price</th><th className="p-3">Total Value</th><th className="p-3">Date</th><th className="p-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {transactions.map(t => (
                            <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                                <td className="p-3 font-semibold text-slate-800">{t.part_name}</td>
                                <td className="p-3 text-red-600 font-bold">-{t.StockOutQuantity}</td>
                                <td className="p-3">{t.StockOutUnitPrice} RWF</td>
                                <td className="p-3 font-semibold text-amber-700">{t.StockOutTotalPrice} RWF</td>
                                <td className="p-3 text-slate-500">{new Date(t.StockOutDate).toLocaleDateString()}</td>
                                <td className="p-3 flex justify-center gap-1.5">
                                    <button onClick={() => handleEdit(t)} className="bg-blue-600 text-white text-xs px-2.5 py-1 rounded font-medium hover:bg-blue-700 shadow-sm">Edit</button>
                                    <button onClick={() => handleDelete(t.id)} className="bg-red-500 text-white text-xs px-2.5 py-1 rounded font-medium hover:bg-red-600 shadow-sm">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default StockOut;