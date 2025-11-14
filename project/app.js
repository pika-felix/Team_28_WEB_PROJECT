const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Load data from items.json
const itemsPath = path.join(__dirname, 'items.json');
let items = [];

try {
  const data = fs.readFileSync(itemsPath, 'utf8');
  items = JSON.parse(data);
} catch (err) {
  console.error('Error loading items.json:', err);
}

// ROUTES

//  LOGIN PAGE (main page)
app.get('/', (req, res) => {
  res.render('login'); // login.ejs file
});

// REPORT LOST ITEM PAGE
app.get('/report-lost', (req, res) => {
  res.render('report-lost');
});

// REPORT FOUND ITEM PAGE
app.get('/report-found', (req, res) => {
  res.render('report-found');
});



//  USER DASHBOARD
app.get('/user_dashboard', (req, res) => {
  res.render('user_dashboard', { items });
});

//  ADMIN DASHBOARD
app.get('/admin_dashboard', (req, res) => {
  res.render('admin_dashboard', { items });
});

// Add item (future feature:stil testing)
app.post('/add-item', (req, res) => {
  const { name, description, location, contact, status, date } = req.body;
  const newItem = { name, description, location, contact, status, date };
  items.push(newItem);
  fs.writeFileSync(itemsPath, JSON.stringify(items, null, 2));
  res.redirect('/admin_dashboard');
});

//  Example: Delete item(future feature:stil testing)
app.post('/delete/:index', (req, res) => {
  const { index } = req.params;
  if (items[index]) {
    items.splice(index, 1);
    fs.writeFileSync(itemsPath, JSON.stringify(items, null, 2));
  }
  res.redirect('/admin_dashboard');
});

// SERVER START
app.listen(PORT, () => {
  console.log(` Lost & Found Portal running at http://localhost:${PORT}`);
});

