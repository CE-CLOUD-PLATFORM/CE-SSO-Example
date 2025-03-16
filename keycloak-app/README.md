## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Keycloak

Update the Keycloak configuration in `app.js` with your server details:

```javascript
const keycloakConfig = {
  "clientId": "ce-app",
  "bearerOnly": false,
  "serverUrl": "http://10.98.0.213:8080/",
  "realm": "CE-SSO",
  "credentials": {
    "secret": "*********"
  }
};
```
### 3. Running the Application

Start the server:

```bash
npm start
```

For development with auto-restart:

```bash
npm run dev
```

Access the application at: http://localhost:3000

## Application Structure

```
/
├── app.js              # Main application file
├── package.json        # Project dependencies
├── public/             # Static assets
│   └── css/
│       └── style.css   # Application styles
└── views/              # EJS templates
    ├── admin.ejs       # Admin dashboard (role protected)
    ├── index.ejs       # Home page
    └── protected.ejs   # Protected page
```

### Changing the Session Secret

For production use, update the session secret in `app.js`:

```javascript
app.use(session({
  secret: 'your-strong-random-secret',
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));
```

### Adding More Protected Routes

Add new protected routes following this pattern:

```javascript
// Regular authentication
app.get('/your-route', keycloak.protect(), (req, res) => {
  // Your route handler
});

// Role-based authentication
app.get('/role-specific-route', keycloak.protect('role-name'), (req, res) => {
  // Your route handler
});
```


