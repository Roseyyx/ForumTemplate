const express = require("express");
const app = express();

// Routes
const MainRoute = require("./@routes/MainRoute");
const UserRoute = require("./@routes/UserRoute");
const db = require("./@models/Database");


app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(express.static("@public"));
app.use('/css', express.static(__dirname + "@public/css"));
app.use('/js', express.static(__dirname + "@public/js"));
app.use('/img', express.static(__dirname + "@public/img"));

app.set("views", "./@views");
app.set("view engine", "ejs");

app.use("", MainRoute);
app.use("/auth", UserRoute);

app.listen(3000, () => {
    console.log("Example app listening on port 3000!");
});
