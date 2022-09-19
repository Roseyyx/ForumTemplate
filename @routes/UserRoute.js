const router = require("express").Router();
const SimpleCrypto = require("simple-crypto-js").default
const db = require("../@models/Database");

router.post("/register", async (req,res) => {
    if (!req.body.username || !req.body.password || !req.body.email || !req.body.invite) 
        return res.status(400).json({error: "No data provided"});

    // Sanitize the data
    const username = req.body.username.replace(/[^a-zA-Z0-9]/g, "");
    const password = req.body.password.replace(/[^a-zA-Z0-9]/g, "");

    // Check if the invite code is valid
    let sql = 'SELECT * FROM invites WHERE code = ?';
    let data = [req.body.invite];
    db.query(sql, data, (err, result) => {
        if (err) throw err;
        if (result.length == 0) { req.session.code = "Invalid invite code"; return res.redirect("/register"); }
        if (result[0].used == true) { req.session.code = "Invite code already used"; return res.redirect("/register"); }

        // Check if the user already exists
        sql = 'SELECT * FROM users WHERE username = ?';
        data = [username];
        db.query(sql, data, (err, result) => {
            if (err) throw err;
            if (result.length > 0) {
                req.session.code = "Username already taken";
                return res.redirect("/register");
            } else {
                sql = 'SELECT * FROM users WHERE email = ?';
                data = [req.body.email];
                db.query(sql, data, (err, result) => {
                    if (err) throw err;
                    if (result.length > 0) {
                        req.session.code = "Email already in use";
                        return res.redirect("/register");
                    } else {
                        // Create a new user
                        const simpleCrypto = new SimpleCrypto(password);
                        const encryptedPassword = simpleCrypto.encrypt(password);
                        sql = 'INSERT INTO users (email, username, password) VALUES (?, ?, ?)';
                        data = [req.body.email, username, encryptedPassword];
                       db.query(sql, data, (err, result) => {
                            if (err) throw err;
                            sql = 'SELECT * FROM users WHERE username = ?';
                            data = [username];
                            db.query(sql, data, (err, result) => {
                                if (err) throw err;
                                sql = 'UPDATE invites SET used = ?, usedBy = ? WHERE code = ?';
                                data = [true, result[0].id, req.body.invite];
                                db.query(sql, data, (err, result) => {
                                    if (err) throw err;
                                    req.session.code = "Successfully registered";
                                    return res.redirect("/login");
                                });
                            });
                        });
                    }
                });
            }
        });
    });
})

router.post("/login", async (req,res) => {
    if (!req.body.username || !req.body.password)
        return res.status(400).json({error: "No data provided"});

    // Sanitize the data
    const username = req.body.username.replace(/[^a-zA-Z0-9]/g, "");
    const password = req.body.password.replace(/[^a-zA-Z0-9]/g, "");

    // Check if the user exists
    let sql = 'SELECT * FROM users WHERE username = ?';
    let data = [username];
    db.query(sql, data, (err, result) => {
        if (err) throw err;
        if (result.length == 0) { req.session.code = "Invalid username"; return res.redirect("/login"); }
        try {
            const simpleCrypto = new SimpleCrypto(password);
            const CheckPassword = simpleCrypto.decrypt(result[0].password);
            if (CheckPassword != password) { req.session.code = "Invalid password"; return res.redirect("/login"); }
            req.session.code = "Welcome: " + username;
            req.session.user = result[0];
            return res.redirect("/");
        } catch (error) {
            req.session.code = "Invalid password"; return res.redirect("/login");
        }
    });
});

module.exports = router;