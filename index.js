const cool = require("cool-ascii-faces");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
// const Mail = require("./Routers/Mail");
const data = require("./data.json");

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(morgan("dev"));
// parse application/json
app.use(bodyParser.json({ extended: true }));
app.use(cookieParser());

app.use("/uploads", express.static("uploads"));

app.use(function (err, res, req, next) {
  res.status(err.status).send(err);
});

app.use(
  session({
    key: "userId",
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 24,
    },
  })
);
app.get("/", (req, res) => {
  res.send("hello welcome ! ");
});

app.get("/api", (req, res) => {
  res.send(data);
});

app.get("/cool", (req, res) => res.send(cool()));

app.listen(PORT, () => {
  console.log(`listen on port ${PORT}`);
});
