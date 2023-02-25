import express from "express";
import cors from "cors";          // how does this work and what's its use?
import { readdirSync } from "fs"; // how does this work and what's its use?
import mongoose from "mongoose";
import csrf from "csurf";  // how does this work and what's its use?
import cookieParser from "cookie-parser"; // how does this work and what's its use?


// this is the main module   


const morgan = require("morgan"); // what is morgan for?
require("dotenv").config();

const csrfProtection = csrf({ cookie: true }); // how does this work?

// create express app
const app = express();

// db
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("**DB CONNECTED**"))
  .catch((err) => console.log("DB CONNECTION ERR => ", err)); // to check

// apply middlewares
app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000',
}));
app.use(express.json({limit: '5mb'}));
app.use(cookieParser());
app.use(morgan("dev"));

// route
readdirSync("./routes").map((r) => app.use("/api", require(`./routes/${r}`))); // this set the routes
// csrf
app.use(csrfProtection);

app.get("/api/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});


// port
const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
