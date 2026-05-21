
import axios from 'axios';

function Navbar({ currentPage, setCurrentPage, setUser }) {
    const handleLogout = () => {
        axios.post('http://localhost:5000/api/logout').then(() => setUser(null));
    };

    const navItems = [
        { id: 'Dashboard', label: 'Dashboard' },
        { id: 'SparePart', label: 'Spare Part Catalog' },
        { id: 'StockIn', label: 'Stock In' },
        { id: 'StockOut', label: 'Stock Out' },
        { id: 'Reports', label: 'System Reports' }
    ];

    return (
        <nav className="bg-slate-800 text-white shadow-md">
            <div className="container mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                <h1 className="text-xl font-bold tracking-tight">SIMS Panel</h1>
                <div className="flex flex-wrap items-center gap-2">
                    {navItems.map(item => (
                        <button key={item.id} onClick={() => setCurrentPage(item.id)} className={`px-4 py-2 rounded-md font-semibold text-xs uppercase tracking-wider transition ${currentPage === item.id ? 'bg-blue-600 text-white shadow' : 'hover:bg-slate-700 text-slate-300'}`}>
                            {item.label}
                        </button>
                    ))}
                    <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs uppercase tracking-wider px-4 py-2 rounded-md transition">
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;