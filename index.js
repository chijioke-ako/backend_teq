const cool = require("cool-ascii-faces");
// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const morgan = require("morgan");
// const cookieParser = require("cookie-parser");
// const session = require("express-session");
// // const Mail = require("./Routers/Mail");
// const data = require("./data.json");

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const Mail = require("./Routers/Mail");
const data = require("./data.json");
const pool = require("../db");
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

get("/db", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM test_table");
    const results = { results: result ? result.rows : null };
    res.render("pages/db", results);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});
app.get("/api", (req, res) => {
  res.send(data);
});

app.get("/cool", (req, res) => res.send(cool()));

app.use("/partners", require("./Routers/Partnerts"));
app.use("/publications", require("./Routers/Publication"));
app.use("/lastPublications", require("./Routers/pub"));
app.use("/archives", require("./Routers/Archment"));
app.use("/resumes", require("./Routers/resume"));
app.use("/api", Mail);
app.use("/mail", require("./Routers/mailContact"));
app.use("/contact", require("./Routers/Contact"));
app.use("/pcms", require("./Routers/Pcms"));
app.use("/openbravo", require("./Routers/Openbravo"));
app.use("/download", require("./Routers/download"));
app.use("/auth", require("./Routers/jwtAuth"));
app.use("/dashboard", require("./Routers/Dashbroad"));
app.use("/admin", require("./Routers/Admin"));
app.use("/users", require("./Routers/users"));

app.listen(PORT, () => {
  console.log(`listen on port ${PORT}`);
});
