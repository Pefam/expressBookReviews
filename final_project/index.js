const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

const jwt = require('jsonwebtoken');

app.use("/customer/auth/*", function auth(req, res, next) {
    // Check if session authorization exists
    if (!req.session.authorization) {
        return res.status(403).json({ message: "User not logged in" });
    }

    const token = req.session.authorization.accessToken;
    const username = req.session.authorization.username;

    try {
        // Verify JWT token
        const decoded = jwt.verify(token, 'access');
        
        // Attach username to request object for subsequent middleware/routes
        req.user = username;
        next();
    } catch (err) {
        // Handle token verification errors
        return res.status(403).json({ message: "User not authenticated" });
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
