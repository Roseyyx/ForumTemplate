const router = require("express").Router();
const SimpleCrypto = require("simple-crypto-js").default
const db = require("../@models/Database");

router.post("/register", async (req,res) => {
    if (!req.body.username || !req.body.password || !req.body.email) 
        return res.status(400).json({error: "No data provided"});

    // Sanitize the data
    const username = req.body.username.replace(/[^a-zA-Z0-9]/g, "");
    const password = req.body.password.replace(/[^a-zA-Z0-9]/g, "");

    // Check if the user already exists
    let sql = 'SELECT * FROM users WHERE username = ?';
    let data = [username];
    const user = await db.query(sql, data);
    if (user.length > 0)
        return res.status(400).json({error: "User already exists"});

    // Check if the email already in use
    sql = 'SELECT * FROM users WHERE email = ?';
    data = [req.body.email];
    const email = await db.query(sql, data);
    if (email.length > 0)
        return res.status(400).json({error: "Email already in use"});

    // Create a new user
    const simpleCrypto = new SimpleCrypto(password);
    const encryptedPassword = simpleCrypto.encrypt(password);
    sql = 'INSERT INTO users (email, username, password) VALUES (?, ?, ?)';
    data = [req.body.email, username, encryptedPassword];
    const result = await db.query(sql, data);
    return res.redirect("/login");
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