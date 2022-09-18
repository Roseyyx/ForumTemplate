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
    const result = db.query(sql, data, (err, result) => {
        if (err) throw err;
        if (result.length == 0) return res.status(400).json({error: "Invalid invite code"});
        if (result[0].used == true) return res.status(400).json({error: "Invite code already used"});

        // Check if the user already exists
        sql = 'SELECT * FROM users WHERE username = ?';
        data = [username];
        const user = db.query(sql, data, (err, result) => {
            if (err) throw err;
            if (result.length > 0) {
                return res.status(400).json({error: "User already exists"});
            } else {
                sql = 'SELECT * FROM users WHERE email = ?';
                data = [req.body.email];
                const email = db.query(sql, data, (err, result) => {
                    if (err) throw err;
                    if (result.length > 0) {
                        return res.status(400).json({error: "Email already in use"});
                    } else {
                        // Create a new user
                        const simpleCrypto = new SimpleCrypto(password);
                        const encryptedPassword = simpleCrypto.encrypt(password);
                        sql = 'INSERT INTO users (email, username, password) VALUES (?, ?, ?)';
                        data = [req.body.email, username, encryptedPassword];
                        const result23 = db.query(sql, data, (err, result) => {
                            if (err) throw err;
                            sql = 'SELECT * FROM users WHERE username = ?';
                            data = [username];
                            db.query(sql, data, (err, result) => {
                                if (err) throw err;
                                sql = 'UPDATE invites SET used = ?, usedBy = ? WHERE code = ?';
                                data = [true, result[0].id, req.body.invite];
                                const result2 = db.query(sql, data, (err, result) => {
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

router.get("/login", async (req,res) => {
    if (!req.body.username || !req.body.password)
        return res.status(400).json({error: "No data provided"});

    // Sanitize the data
    const username = req.body.username.replace(/[^a-zA-Z0-9]/g, "");
    const password = req.body.password.replace(/[^a-zA-Z0-9]/g, "");

    // Encrypt Password
    let simpleCrypto = new SimpleCrypto(password);
    let CheckPassword = simpleCrypto.encrypt(password);
    
});

module.exports = router;