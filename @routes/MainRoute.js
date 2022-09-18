const router = require("express").Router();

router.get("", (req,res) => {
    return res.render('index');
});

router.get("/login", (req,res) => {
    if (req.session.user) return res.redirect("/dashboard");
    if (req.session.code != undefined) 
        return res.render("login", {code: req.session.code});
    else
        return res.render('login');
});

router.get("/register", (req,res) => {
    if (req.session.user) return res.redirect("/dashboard");
    if (req.session.code != undefined) 
        return res.render("register", {code: req.session.code});
    else
        return res.render('register');
});

router.get("/dashboard", (req,res) => {
    if (req.session.code != undefined && req.session.user != undefined) 
        return res.render("dashboard", {code: req.session.code, user: req.session.user});
    else
        return res.render('dashboard');
});

module.exports = router;