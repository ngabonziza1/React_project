import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Reports() {
    const [statusReport, setStatusReport] = useState([]);
    const [stockOutHistory, setStockOutHistory] = useState([]);
    const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/reports/status').then(res => setStatusReport(res.data));
        axios.get('http://localhost:5000/api/stockout').then(res => setStockOutHistory(res.data));
    }, []);

    const dailyStockOut = stockOutHistory.filter(t => t.StockOutDate.split('T')[0] === filterDate);

    return (
        <div className="space-y-8">
            {/* Daily Stock Outflow Analysis Component */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4 border-b pb-2">
                    <h3 className="text-lg font-bold text-slate-800">Daily Stock-Out Dispatch Sheet</h3>
                    <div className="flex items-center gap-2">
                        <label className="text-xs font-bold text-slate-600 uppercase">Select Date:</label>
                        <input type="date" className="p-1.5 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-700" value={filterDate} onChange={e => setFilterDate(e.target.value)} />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    {dailyStockOut.length === 0 ? (
                        <p className="text-slate-400 text-center py-6 text-sm italic">No disbursements registered on this specific calendar date.</p>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase font-bold">
                                    <th className="p-3">Spare Part Name</th><th className="p-3">Quantity Issued</th><th className="p-3">Unit Billing Price</th><th className="p-3">Total Value Out</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {dailyStockOut.map(t => (
                                    <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                                        <td className="p-3 font-semibold text-slate-800">{t.part_name}</td>
                                        <td className="p-3 text-red-600 font-bold">-{t.StockOutQuantity}</td>
                                        <td className="p-3">{t.StockOutUnitPrice} RWF</td>
                                        <td className="p-3 font-medium text-amber-700">{t.StockOutTotalPrice} RWF</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* General Matrix Status Balancing Component */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 overflow-x-auto">
                <h3 className="text-lg font-bold mb-4 text-slate-800 border-b pb-2">Current Stock Level Status Report</h3>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 text-xs uppercase font-bold">
                            <th className="p-3">Spare Part Name</th>
                            <th className="p-3">Stored Quantity</th>
                            <th className="p-3">Total Stock Out</th>
                            <th className="p-3">Remaining Quantity</th>
                            <th className="p-3">Status Alert</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {statusReport.map((r, idx) => (
                            <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition">
                                <td className="p-3 font-semibold text-slate-800">{r.part_name}</td>
                                <td className="p-3 text-slate-600">{r.stored_quantity}</td>
                                <td className="p-3 text-red-500 font-medium">-{r.stock_out}</td>
                                <td className="p-3 text-blue-700 font-bold">{r.remaining_quantity}</td>
                                <td className="p-3">
                                    {r.remaining_quantity <= 3 ? (
                                        <span className="bg-red-100 text-red-800 text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">Low Stock</span>
                                    ) : (
                                        <span className="bg-green-100 text-green-800 text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">Healthy</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Reports;