const express = require('express');
const { json } = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const { authenticated: customer_routes } = require('./router/auth_users.js');
const { general: genl_routes } = require('./router/general.js');

const app = express();

app.use(json());

app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));

app.use("/customer/auth/*", function auth(req, res, next) {
    if (req.session.authorization) {
        let token = req.session.authorization["token"];
        jwt.verify(token, "access", (err, user) => {
            if (err) {
                res.status(403).json({ message: "User not authenticated" });
            } else {
                req.user = user;
                next();
            }
        });
    }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
