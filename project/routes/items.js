const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const dataPath = path.join(__dirname, '../data/items.json');

// Utility to load items
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
    res.render('home');
});

// Show all items
router.get('/items', (req, res) => {
    const items = loadItems();
    res.render('list', { items });
});

// Report lost (GET + POST)
router.get('/report-lost', (req, res) => {
    res.render('report-lost');
});
router.post('/report-lost', (req, res) => {
    const items = loadItems();
    const newItem = {
        ...req.body,
        status: 'lost',
        date: new Date().toLocaleDateString()
    };
    items.push(newItem);
    saveItems(items);
    res.redirect('/items');
});

// Report found (GET + POST)
router.get('/report-found', (req, res) => {
    res.render('report-found');
});
router.post('/report-found', (req, res) => {
    const items = loadItems();
    const newItem = {
        ...req.body,
        status: 'found',
        date: new Date().toLocaleDateString()
    };
    items.push(newItem);
    saveItems(items);
    res.redirect('/items');
});

// Admin view
router.get('/admin', (req, res) => {
    const items = loadItems();
    res.render('admin', { items });
});

module.exports = router;
