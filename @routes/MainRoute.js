const router = require("express").Router();

router.get("", (req,res) => {
    return res.render('index');
});

router.get("/login", (req,res) => {
    if (req.session.code) 
        return res.render("login", {code: req.session.code});
    else
        return res.render('login');
});

router.get("/register", (req,res) => {
    if (req.session.code) 
        return res.render("register", {code: req.session.code});
    else
        return res.render('register');
})

module.exports = router;