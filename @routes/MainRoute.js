const router = require("express").Router();
const db = require("../@models/Database");

router.get("", (req,res) => {
    return res.render('index');
});

router.get("/login", (req,res) => {
    if (req.session.code != undefined) 
        return res.render("login", {code: req.session.code});
    else
        return res.render('login');
});

router.get("/register", (req,res) => {
    if (req.session.code != undefined) 
        return res.render("register", {code: req.session.code});
    else
        return res.render('register');
});

router.get("/dashboard", (req,res) => {
    if (req.session.user.id == undefined) return res.redirect("/login");
    // check if user is admin

    let sql = 'SELECT * FROM users WHERE id = ?';
    let data = [req.session.user.id];
    db.query(sql, data, (err, result) => {
        if (err) throw err;
        if (result[0].isAdmin == true){
            if (req.session.code != undefined && req.session.user != undefined) 
                return res.render("dashboard", {code: req.session.code, user: req.session.user});
            else
                return res.render('dashboard');
        }
        return res.redirect('/login');
    });

});

module.exports = router;