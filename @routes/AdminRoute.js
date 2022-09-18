const router = require("express").Router();
const db = require("../@models/Database");

router.get("/genInvite", (req,res) => {

    const InviteCode = "arty_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const sql = 'INSERT INTO invites (code, used, createdBy) VALUES (?, ?, ?)';
    const data = [InviteCode, false, 1];
    const result = db.query(sql, data, (err, result) => {
        if (err) throw err;
        return res.status(200).json({code: InviteCode});
    });
})

module.exports = router;