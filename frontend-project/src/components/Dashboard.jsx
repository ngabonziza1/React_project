import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';


function Dashboard() {
  const [statusReport, setStatusReport] = useState([]);
  const [stockIn, setStockIn] = useState([]);
  const [stockOut, setStockOut] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_BASE = 'http://localhost:5000/api';

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError('');

        const [statusRes, stockInRes, stockOutRes] = await Promise.all([
          axios.get(`${API_BASE}/reports/status`),
          axios.get(`${API_BASE}/stockin`),
          axios.get(`${API_BASE}/stockout`),
        ]);

        if (cancelled) return;
        setStatusReport(statusRes.data || []);
        setStockIn(stockInRes.data || []);
        setStockOut(stockOutRes.data || []);
      } catch (e) {
        if (cancelled) return;
        setError(e?.response?.data?.message || e.message || 'Failed to load dashboard');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const metrics = useMemo(() => {
    const totalParts = statusReport.length;
    const lowStockCount = statusReport.filter(
      (r) => Number(r.remaining_quantity) <= 3
    ).length;

    const totalInQty = stockIn.reduce((sum, t) => sum + Number(t.StockInQuantity || 0), 0);
    const totalOutQty = stockOut.reduce((sum, t) => sum + Number(t.StockOutQuantity || 0), 0);

    return { totalParts, lowStockCount, totalInQty, totalOutQty };
  }, [statusReport, stockIn, stockOut]);

  const latestStockIn = useMemo(() => {
    const copy = [...stockIn];
    copy.sort((a, b) => new Date(b.StockInDate) - new Date(a.StockInDate));
    return copy.slice(0, 6);
  }, [stockIn]);

  const latestStockOut = useMemo(() => {
    const copy = [...stockOut];
    copy.sort((a, b) => new Date(b.StockOutDate) - new Date(a.StockOutDate));
    return copy.slice(0, 6);
  }, [stockOut]);

  if (loading) {
    return (
      <div className="text-center mt-12 font-bold text-slate-600">Loading dashboard...</div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Spare Parts</div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">{metrics.totalParts}</div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Low Stock (≤ 3)</div>
          <div className="text-3xl font-extrabold text-red-700 mt-2">{metrics.lowStockCount}</div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Stock-In Qty</div>
          <div className="text-3xl font-extrabold text-emerald-700 mt-2">{metrics.totalInQty}</div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Stock-Out Qty</div>
          <div className="text-3xl font-extrabold text-amber-700 mt-2">{metrics.totalOutQty}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 overflow-x-auto">
          <h3 className="text-lg font-bold text-slate-800">Latest Stock-In</h3>
          <div className="mt-3 overflow-x-auto">
            {latestStockIn.length === 0 ? (
              <p className="text-slate-400 text-sm italic">No stock-in records yet.</p>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase font-bold">
                    <th className="p-3">Tx ID</th>
                    <th className="p-3">Part</th>
                    <th className="p-3">Qty In</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {latestStockIn.map((t) => (
                    <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                      <td className="p-3 text-slate-500">#{t.id}</td>
                      <td className="p-3 font-semibold text-slate-800">{t.part_name}</td>
                      <td className="p-3 text-emerald-700 font-bold">+{t.StockInQuantity}</td>
                      <td className="p-3 text-slate-600">
                        {t.StockInDate ? new Date(t.StockInDate).toLocaleDateString() : ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 overflow-x-auto">
          <h3 className="text-lg font-bold text-slate-800">Latest Stock-Out</h3>
          <div className="mt-3 overflow-x-auto">
            {latestStockOut.length === 0 ? (
              <p className="text-slate-400 text-sm italic">No stock-out records yet.</p>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase font-bold">
                    <th className="p-3">Item</th>
                    <th className="p-3">Qty Out</th>
                    <th className="p-3">Value</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {latestStockOut.map((t) => (
                    <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                      <td className="p-3 font-semibold text-slate-800">{t.part_name}</td>
                      <td className="p-3 text-red-700 font-bold">-{t.StockOutQuantity}</td>
                      <td className="p-3 text-amber-700 font-semibold">{t.StockOutTotalPrice} RWF</td>
                      <td className="p-3 text-slate-600">
                        {t.StockOutDate ? new Date(t.StockOutDate).toLocaleDateString() : ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

