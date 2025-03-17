// app.js - Main application file
const express = require('express');
const session = require('express-session');
const Keycloak = require('keycloak-connect');
const path = require('path');

// Initialize Express app
const app = express();
const port = process.env.PORT || 9000;

// Set up view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Set up static files directory
app.use(express.static(path.join(__dirname, 'public')));

// Configure session
const memoryStore = new session.MemoryStore();
app.use(session({
  secret: 'secret', // Change this
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));

// Configure Keycloak with your specific configuration
const keycloakConfig = {
  "clientId": "ce-app",
  "bearerOnly": false,
  "serverUrl": "https://sso.cloud.ce.kmitl.ac.th/",
  "realm": "ce-kmitl"
};

const keycloak = new Keycloak({ store: memoryStore }, keycloakConfig);

// Initialize Keycloak middleware
app.use(keycloak.middleware());

// Routes
app.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

// Protected route - requires authentication
app.get('/protected', keycloak.protect(), (req, res) => {
  res.render('protected', { 
    title: 'Protected Page',
    user: req.kauth.grant.access_token.content
  });
});

// Admin route - requires 'admin' role
app.get('/admin', keycloak.protect('realm:admin'), (req, res) => {
    res.render('admin', { 
      title: 'Admin Dashboard', 
      user: req.kauth.grant.access_token.content 
    });
  });

// Login route
app.get('/login', keycloak.protect(), (req, res) => {
  res.redirect('/protected');
});

// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect(keycloak.logoutUrl());
});

// API route example - protected with JWT
app.get('/api/data', keycloak.protect(), (req, res) => {
  res.json({
    message: 'This is protected data',
    user: req.kauth.grant.access_token.content.preferred_username
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});