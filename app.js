const express = require("express");
const app = express();
const session = require("express-session");


// Routes
const MainRoute = require("./@routes/MainRoute");
const UserRoute = require("./@routes/UserRoute");
const AdminRoute = require("./@routes/AdminRoute");
const db = require("./@models/Database");

// Session Middleware
let sessionMiddleware = session({
    secret: "arty",
    cookie: {maxAge: 30 * 24 * 60 * 60 * 1000},
    saveUninitialized: false,
    resave: false
});
app.use(sessionMiddleware);

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
let server = app.listen(3000, () => {
    console.log("Example app listening on port 3000!");
});

const { getIO, setIO} = require("./@models/Socket");
let io = setIO(server);
var ios = require('socket.io-express-session');
io.use(ios(sessionMiddleware));

let users = new Array();
io.on("connection", (socket) => {
    var session = socket.handshake.session;
    if (session.user) {
        // check if user is already in array
        let user = users.find(user => user.id == session.user.id);
        if (user) {
            users.sort();
            for (let i = 0; i < users.length; i++) {
                //console.log(users[i].username);
                socket.emit("user", users[i].username);
                socket.broadcast.emit("user", users[i].username);
            }
        } else {
            users.push(session.user);
            users.sort();
            for (let i = 0; i < users.length; i++) {
                //console.log(users[i].username);
                socket.emit("user", users[i].username);
                socket.broadcast.emit("user", users[i].username);
            }
        }
    }
    console.log("Client connected");
});