const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// ===== MIDDLEWARE =====
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

// ===== VIEW ENGINE =====
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ===== DATA PATH =====
const dataPath = path.join(__dirname, 'data/items.json');

// ===== UTILITY FUNCTIONS =====
function loadItems() {
    try {
        const data = fs.readFileSync(dataPath, 'utf8');
        return JSON.parse(data);
    } catch {
        return [];
    }
}

function saveItems(items) {
    fs.writeFileSync(dataPath, JSON.stringify(items, null, 2));
}

// ===== ROUTES =====

// LOGIN PAGE
app.get('/', (req, res) => res.render('login'));

// USER DASHBOARD
app.get('/user_dashboard', (req, res) => {
    res.render('user_dashboard', { items: loadItems(), msg: req.query.msg });
});

// ADMIN DASHBOARD
app.get('/admin_dashboard', (req, res) => {
    res.render('admin_dashboard', { items: loadItems(), msg: req.query.msg });
});

// VIEW ITEMS WITH PAGINATION
app.get(['/view-items', '/items'], (req, res) => {
    const allItems = loadItems();
    const page = parseInt(req.query.page) || 1;
    const perPage = 5;
    const totalPages = Math.ceil(allItems.length / perPage);
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const items = allItems.slice(start, end);

    res.render('list', {
        items,
        page,
        totalPages,
        msg: req.query.msg
    });
});

// REPORT LOST / FOUND PAGES
app.get('/report-lost', (req, res) => res.render('report-lost'));
app.get('/report-found', (req, res) => res.render('report-found'));

// ADD ITEM (handles both lost and found)
app.post('/add-item', (req, res) => {
    const { name, description, location, contact, status } = req.body;

    if (status === 'lost' || status === 'found') {
        const newItem = {
            id: Date.now().toString(),
            name,
            description,
            location,
            contact,
            status,
            date: new Date().toLocaleDateString()
        };

        const items = loadItems();
        items.push(newItem);
        saveItems(items);

        return res.redirect(`/user_dashboard?msg=${status.charAt(0).toUpperCase() + status.slice(1)} item added successfully!`);
    }

    // Fallback if status is missing
    res.redirect('/user_dashboard?msg=Item could not be added.');
});

// DELETE ITEM (admin only)
app.post('/delete-item/:id', (req, res) => {
    const id = req.params.id;
    let items = loadItems();
    items = items.filter(item => item.id !== id);
    saveItems(items);

    const page = req.query.page || 1;
    res.redirect(`/view-items?page=${page}&msg=Item deleted successfully!`);
});

// ===== SERVER START =====
app.listen(PORT, () => {
    console.log(`Lost & Found Portal running at http://localhost:${PORT}`);
});
