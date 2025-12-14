const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const dataPath = path.join(__dirname, '../data/items.json');

// Load items
function loadItems() {
    if (!fs.existsSync(dataPath)) return [];
    const data = fs.readFileSync(dataPath);
    return JSON.parse(data);
}

// Save items
function saveItems(items) {
    fs.writeFileSync(dataPath, JSON.stringify(items, null, 2));
}

// Home page
router.get('/', (req, res) => {
    res.render('home', {
        isAdmin: req.session.isAdmin || false
    });
});

// Show all items (LIST PAGE)
router.get('/items', (req, res) => {
    const items = loadItems();
    res.render('list', { 
        items,
        msg: req.query.msg,
        isAdmin: req.session.isAdmin || false,
        page: 1,
        totalPages: 1
    });
});

// Report lost (GET + POST)
router.get('/report-lost', (req, res) => {
    res.render('report-lost');
});

router.post('/report-lost', (req, res) => {
    const items = loadItems();
    const newItem = {
        id: Date.now().toString(),
        ...req.body,
        status: 'lost',
        date: new Date().toLocaleDateString()
    };
    items.push(newItem);
    saveItems(items);
    res.redirect('/user_dashboard?msg=Lost item reported!');
});

// Report found
router.get('/report-found', (req, res) => {
    res.render('report-found');
});

router.post('/report-found', (req, res) => {
    const items = loadItems();
    const newItem = {
        id: Date.now().toString(),
        ...req.body,
        status: 'found',
        date: new Date().toLocaleDateString()
    };
    items.push(newItem);
    saveItems(items);
    res.redirect('/user_dashboard?msg=Found item reported!');
});

// Admin page
router.get('/admin', (req, res) => {
    const items = loadItems();
    res.render('admin', { 
        items,
        isAdmin: true
    });
});

// DELETE ITEM — ADMIN ONLY
router.post('/delete-item/:id', (req, res) => {
    if (!req.session.isAdmin) {
        return res.redirect('/items?msg=Access denied');
    }

    const items = loadItems();
    const filtered = items.filter(item => item.id !== req.params.id);
    saveItems(filtered);

    res.redirect('/items?msg=Item deleted');
});

module.exports = router;
