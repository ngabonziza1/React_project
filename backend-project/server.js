const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
    // Allow both common Vite ports (5173 and 5174) to avoid CORS errors
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true
}));
app.use(express.json());
app.use(session({
    secret: 'sims_secret_key_2026',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 day
}));

// Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'SIMS'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL SIMS Database.');
});

// --- AUTHENTICATION ROUTES ---
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
        if (hashErr) return res.status(500).json({ message: hashErr.message });

        const checkQuery = 'SELECT * FROM users WHERE username = ?';
        db.query(checkQuery, [username], (checkErr, results) => {
            if (checkErr) return res.status(500).json({ message: checkErr.message });
            if (results.length > 0) {
                return res.status(409).json({ message: 'Username already exists' });
            }

            const insertQuery = 'INSERT INTO users (username, password) VALUES (?, ?)';
            db.query(insertQuery, [username, hashedPassword], (insErr, result) => {
                if (insErr) return res.status(500).json({ message: insErr.message });

                // Auto-login after registration
                const user = { id: result.insertId, username };
                req.session.user = user;
                return res.json({ message: 'Registration successful', user });
            });
        });
    });
});

app.post('/api/login', (req, res) => {

    const { username, password } = req.body;

    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(401).json({ message: 'User not found' });

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        req.session.user = { id: user.id, username: user.username };
        res.json({ message: 'Login successful', user: req.session.user });
    });
});

app.post('/api/logout', (req, res) => {
    req.session.destroy(() => {
        res.json({ message: 'Logged out successfully' });
    });
});

app.get('/api/session', (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});

// --- SPARE PART ROUTES ---
app.get('/api/spareparts/', (req, res) => {
    db.query('SELECT * FROM Spare_Part', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post('/api/spareparts', (req, res) => {
    const { Name, Category, Quantity, UnitPrice } = req.body;
    const TotalPrice = Quantity * UnitPrice;
    const query = 'INSERT INTO Spare_Part (Name, Category, Quantity, UnitPrice, TotalPrice) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [Name, Category, Quantity, UnitPrice, TotalPrice], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Spare part inserted successfully', id: result.insertId });
    });
});

// --- STOCK IN ROUTES ---
app.get('/api/stockin', (req, res) => {
    const query = `
        SELECT Stock_In.*, Spare_Part.Name as part_name 
        FROM Stock_In 
        JOIN Spare_Part ON Stock_In.spare_part_id = Spare_Part.id
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post('/api/stockin', (req, res) => {
    const { spare_part_id, StockInQuantity, StockInDate } = req.body;
    
    // Insert into Stock_In
    db.query('INSERT INTO Stock_In (spare_part_id, StockInQuantity, StockInDate) VALUES (?, ?, ?)', 
    [spare_part_id, StockInQuantity, StockInDate], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        // Update Spare_Part Master Quantity & Total Price
        db.query('UPDATE Spare_Part SET Quantity = Quantity + ?, TotalPrice = Quantity * UnitPrice WHERE id = ?', 
        [StockInQuantity, spare_part_id], (updateErr) => {
            if (updateErr) return res.status(500).json({ error: updateErr.message });
            res.json({ message: 'Stock-In processed and master inventory updated' });
        });
    });
});

// --- STOCK OUT ROUTES (Full CRUD Required) ---
app.get('/api/stockout', (req, res) => {
    const query = `
        SELECT Stock_Out.*, Spare_Part.Name as part_name 
        FROM Stock_Out 
        JOIN Spare_Part ON Stock_Out.spare_part_id = Spare_Part.id
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post('/api/stockout', (req, res) => {
    const { spare_part_id, StockOutQuantity, StockOutUnitPrice, StockOutDate } = req.body;
    const StockOutTotalPrice = StockOutQuantity * StockOutUnitPrice;

    // Check if enough stock exists
    db.query('SELECT Quantity FROM Spare_Part WHERE id = ?', [spare_part_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results[0].Quantity < StockOutQuantity) {
            return res.status(400).json({ message: 'Insufficient items in stock!' });
        }

        // Insert transaction
        const query = 'INSERT INTO Stock_Out (spare_part_id, StockOutQuantity, StockOutUnitPrice, StockOutTotalPrice, StockOutDate) VALUES (?, ?, ?, ?, ?)';
        db.query(query, [spare_part_id, StockOutQuantity, StockOutUnitPrice, StockOutTotalPrice, StockOutDate], (insErr) => {
            if (insErr) return res.status(500).json({ error: insErr.message });

            // Deduct from master stock
            db.query('UPDATE Spare_Part SET Quantity = Quantity - ?, TotalPrice = Quantity * UnitPrice WHERE id = ?', 
            [StockOutQuantity, spare_part_id], (upErr) => {
                if (upErr) return res.status(500).json({ error: upErr.message });
                res.json({ message: 'Stock-Out transaction created successfully.' });
            });
        });
    });
});

app.put('/api/stockout/:id', (req, res) => {
    const { id } = req.params;
    const { StockOutQuantity, StockOutUnitPrice, StockOutDate } = req.body;
    const StockOutTotalPrice = StockOutQuantity * StockOutUnitPrice;

    // Fetch old record to reverse original quantity deduction first
    db.query('SELECT * FROM Stock_Out WHERE id = ?', [id], (err, records) => {
        if (err || records.length === 0) return res.status(404).json({ message: 'Record not found' });
        const oldRecord = records[0];

        // Update the Stock_Out record
        const updateQuery = 'UPDATE Stock_Out SET StockOutQuantity = ?, StockOutUnitPrice = ?, StockOutTotalPrice = ?, StockOutDate = ? WHERE id = ?';
        db.query(updateQuery, [StockOutQuantity, StockOutUnitPrice, StockOutTotalPrice, StockOutDate, id], (upErr) => {
            if (upErr) return res.status(500).json({ error: upErr.message });

            // Adjust master quantity: Add back old quantity, subtract new quantity
            const qtyDifference = oldRecord.StockOutQuantity - StockOutQuantity;
            db.query('UPDATE Spare_Part SET Quantity = Quantity + ?, TotalPrice = Quantity * UnitPrice WHERE id = ?', 
            [qtyDifference, oldRecord.spare_part_id], (masterErr) => {
                if (masterErr) return res.status(500).json({ error: masterErr.message });
                res.json({ message: 'Stock-Out record updated successfully' });
            });
        });
    });
});

app.delete('/api/stockout/:id', (req, res) => {
    const { id } = req.params;

    db.query('SELECT * FROM Stock_Out WHERE id = ?', [id], (err, records) => {
        if (err || records.length === 0) return res.status(404).json({ message: 'Record not found' });
        const record = records[0];

        db.query('DELETE FROM Stock_Out WHERE id = ?', [id], (delErr) => {
            if (delErr) return res.status(500).json({ error: delErr.message });

            // Return items back to stock
            db.query('UPDATE Spare_Part SET Quantity = Quantity + ?, TotalPrice = Quantity * UnitPrice WHERE id = ?', 
            [record.StockOutQuantity, record.spare_part_id], (masterErr) => {
                if (masterErr) return res.status(500).json({ error: masterErr.message });
                res.json({ message: 'Stock-Out record deleted and inventory restored.' });
            });
        });
    });
});

// --- REPORT ROUTES ---
app.get('/api/reports/status', (req, res) => {
    const query = `
        SELECT 
            sp.Name AS part_name,
            (sp.Quantity + IFNULL(so.total_out, 0) - IFNULL(si.total_in, 0)) AS stored_quantity,
            IFNULL(si.total_in, 0) AS total_in,
            IFNULL(so.total_out, 0) AS stock_out,
            sp.Quantity AS remaining_quantity
        FROM Spare_Part sp

        LEFT JOIN (SELECT spare_part_id, SUM(StockInQuantity) AS total_in FROM Stock_In GROUP BY spare_part_id) si ON sp.id = si.spare_part_id
        LEFT JOIN (SELECT spare_part_id, SUM(StockOutQuantity) AS total_out FROM Stock_Out GROUP BY spare_part_id) so ON sp.id = so.spare_part_id
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));