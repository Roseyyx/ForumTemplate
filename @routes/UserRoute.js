const router = require("express").Router();

router.get("/login", (req,res) => {
    if (!req.body.username || !req.body.password)
        return res.status(200).json({error: "No data provided"});

    
});

module.exports = router;