require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const morgan = require('morgan')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// DB
const ConnectDatabase = require("./app/config/dbcofing");
ConnectDatabase();

// View engine
app.set("view engine", "ejs");
app.set("views", "./views");

// Middleware
app.use(cookieParser());
app.use(morgan('dev'));


// API Routes
app.use(require("./app/routes/index"));


const port = 5001;

app.listen(port, (err) => {
    if(err){
        console.log(`Failed to start the server ${err}`);
    }
    console.log(`Open: http://localhost:${port}`);
});
