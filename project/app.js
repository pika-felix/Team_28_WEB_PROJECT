// demo1.js
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public'))); // for style.css or images

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ===== DATA SETUP =====
const itemsPath = path.join(__dirname, 'data/items.json');
let items = [];

// Load items from data/items.json
try {
  const data = fs.readFileSync(itemsPath, 'utf8');
  items = JSON.parse(data);
} catch (err) {
  console.error('Error loading items.json:', err);
}

// Utility functions
function loadItems() {
  try {
    const data = fs.readFileSync(itemsPath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function saveItems(items) {
  fs.writeFileSync(itemsPath, JSON.stringify(items, null, 2));
}

// ===== ROUTES =====

// LOGIN PAGE (main page)
app.get('/', (req, res) => {
  res.render('login'); 
});

// VIEW ITEMS PAGE  
app.get('/view-items', (req, res) => {
  res.render('list', { items: loadItems() });
});

// REPORT LOST ITEM PAGE
app.get('/report-lost', (req, res) => {
  res.render('report-lost');
});

// REPORT FOUND ITEM PAGE
app.get('/report-found', (req, res) => {
  res.render('report-found');
});

// Include routes from item.js
app.use('/', require('./routes/items'));

// USER DASHBOARD
app.get('/user_dashboard', (req, res) => {
  res.render('user_dashboard', { items: loadItems() });
});

// ADMIN DASHBOARD
app.get('/admin_dashboard', (req, res) => {
  res.render('admin_dashboard', { items: loadItems() });
});

// Add item
app.post('/add-item', (req, res) => {
  const { name, description, location, contact, status } = req.body;
  const newItem = { name, description, location, contact, status, date: new Date().toLocaleDateString() };
  const currentItems = loadItems();
  currentItems.push(newItem);
  saveItems(currentItems);
  res.redirect('/admin_dashboard');
});

// Delete item
app.post('/delete/:index', (req, res) => {
  const index = parseInt(req.params.index, 10);
  const currentItems = loadItems();
  if (currentItems[index]) {
    currentItems.splice(index, 1);
    saveItems(currentItems);
  }
  res.redirect('/admin_dashboard');
});

// SERVER START
app.listen(PORT, () => {
  console.log(`Lost & Found Portal running at http://localhost:${PORT}`);
});
