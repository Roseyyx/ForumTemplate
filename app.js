const express = require("express");
const app = express();
const session = require("express-session");

// Routes
const MainRoute = require("./@routes/MainRoute");
const UserRoute = require("./@routes/UserRoute");
const AdminRoute = require("./@routes/AdminRoute");
const db = require("./@models/Database");

// Session Middleware
app.use(session({
    secret: "arty",
    cookie: {maxAge: 300000},
    saveUninitialized: false,
}));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// View Engine
app.use(express.static("@public"));
app.use('/css', express.static(__dirname + "@public/css"));
app.use('/js', express.static(__dirname + "@public/js"));
app.use('/img', express.static(__dirname + "@public/img"));

// Set View Engine
app.set("views", "./@views");
app.set("view engine", "ejs");

// Routes
app.use("", MainRoute);
app.use("/auth", UserRoute);
app.use("/admin", AdminRoute);

// Listen
app.listen(3000, () => {
    console.log("Example app listening on port 3000!");
});
